export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const icao = searchParams.get("icao") || "UAAA";

  try {
    const res = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`,
      { next: { revalidate: 0 } } // отключаем кэш
    );

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Не удалось получить данные METAR" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // API иногда возвращает текст, не строго JSON
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: "Ошибка парсинга METAR" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Ошибка сети или сервера" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}