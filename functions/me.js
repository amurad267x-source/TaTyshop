export async function onRequestGet({ request, env }) {

  const cookie = request.headers.get("Cookie")
  if(!cookie) return new Response(null, { status: 401 })

  const match = cookie.match(/session=([^;]+)/)
  if(!match) return new Response(null, { status: 401 })

  const sessionId = match[1]

  const userId = await env.SESSIONS.get("session:" + sessionId)
  if(!userId) return new Response(null, { status: 401 })

  const user = await env.DB.prepare(
    "SELECT id, email, name, full_name, address, role FROM users WHERE id = ?"
  ).bind(userId).first()

  if(!user) return new Response(null, { status: 401 })

  return new Response(JSON.stringify(user), {
    headers: { "Content-Type": "application/json" }
  })
}