export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const icao = searchParams.get("icao") || "UAAA";

  try {
    const res = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`,
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Ошибка при запросе: ${res.status}` }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const text = await res.text();

    // Пробуем безопасно распарсить
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: "Ответ не в формате JSON", raw: text.slice(0, 500) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Ошибка сети или сервера", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}