export async function onRequest({ request, env }) {
  const { id, status } = await request.json();

  await env.DB.prepare(
    `UPDATE orders SET status=? WHERE id=?`
  ).bind(status, id).run();

  return Response.json({ ok: true });
}