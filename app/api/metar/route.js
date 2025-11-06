export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, message: "API маршрут работает" }),
    { headers: { "Content-Type": "application/json" } }
  );
}