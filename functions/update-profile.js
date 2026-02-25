export async function onRequestPost({ request, env }) {

  const cookie = request.headers.get("Cookie")
  const match = cookie?.match(/session=([^;]+)/)
  if(!match) return new Response("Unauthorized", { status: 401 })

  const sessionId = match[1]
  const userId = await env.SESSIONS.get("session:" + sessionId)
  if(!userId) return new Response("Unauthorized", { status: 401 })

  const data = await request.json()

  if(!data.full_name || !data.address)
    return new Response("Invalid data", { status: 400 })

  await env.DB.prepare(
    "UPDATE users SET full_name = ?, address = ? WHERE id = ?"
  ).bind(data.full_name, data.address, userId).run()

  return new Response("OK")
}