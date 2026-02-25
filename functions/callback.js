export async function onRequestGet({ request, env }) {

  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if(!code)
    return new Response("No code", { status: 400 })

  const redirectUri = env.BASE_URL + "/callback"

  // Обмен кода на токен
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  })

  const tokenData = await tokenRes.json()

  if(!tokenData.access_token)
    return new Response("Token error", { status: 400 })

  // Получаем профиль
  const userRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: "Bearer " + tokenData.access_token
      }
    }
  )

  const user = await userRes.json()

  if(!user.email_verified)
    return new Response("Email not verified", { status: 403 })

  // Проверяем пользователя в БД
  let existing = await env.DB.prepare(
    "SELECT id FROM users WHERE email = ?"
  ).bind(user.email).first()

  let userId

  if(!existing){
    userId = crypto.randomUUID()
    await env.DB.prepare(
      "INSERT INTO users (id, email, name) VALUES (?, ?, ?)"
    ).bind(userId, user.email, user.name).run()
  } else {
    userId = existing.id
  }

  // Создаём сессию
  const sessionId = crypto.randomUUID()

  await env.SESSIONS.put(
    "session:" + sessionId,
    userId,
    { expirationTtl: 60 * 60 * 24 * 7 }
  )

  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/`,
      "Location": "/catalog.html"
    }
  })
}