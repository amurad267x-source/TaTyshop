export async function onRequest({ request, env, data }) {
  const body = await request.json();
  const orderId = crypto.randomUUID();

  await env.DB.prepare(
    `INSERT INTO orders (id,user_id,total,status,created_at)
     VALUES (?,?,?,?,?)`
  ).bind(
    orderId,
    data.user.id,
    body.total,
    "pending",
    new Date().toISOString()
  ).run();

  return Response.json({ orderId });
}