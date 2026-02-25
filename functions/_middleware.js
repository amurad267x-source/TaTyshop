export async function onRequest(context) {

  const { request, env } = context
  const url = new URL(request.url)

  // публичные пути
  if (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/callback") ||
    url.pathname.startsWith("/")
  ) {
    return context.next()
  }

  const cookie = request.headers.get("Cookie")
  if(!cookie) return Response.redirect(env.BASE_URL, 302)

  const match = cookie.match(/session=([^;]+)/)
  if(!match) return Response.redirect(env.BASE_URL, 302)

  const sessionId = match[1]
  const userId = await env.SESSIONS.get("session:" + sessionId)

  if(!userId)
    return Response.redirect(env.BASE_URL, 302)

  return context.next()
}