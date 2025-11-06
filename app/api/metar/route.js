export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const icao = searchParams.get("icao") || "UAAA";

  try {
    const response = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${icao}&format=json`
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Ошибка запроса: ${response.status}` }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Получаем текст, т.к. иногда сервер может вернуть не JSON
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // если ответ не JSON, вернём часть текста для отладки
      return new Response(
        JSON.stringify({
          error: "Ответ не в формате JSON",
          raw: text.slice(0, 500),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Ошибка сети или сервера",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}