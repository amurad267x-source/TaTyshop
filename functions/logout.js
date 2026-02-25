export async function onRequestGet({ request, env }) {

  const cookie = request.headers.get("Cookie")
  const match = cookie?.match(/session=([^;]+)/)

  if(match){
    await env.SESSIONS.delete("session:" + match[1])
  }

  return new Response(null,{
    status:302,
    headers:{
      "Set-Cookie":"session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
      "Location":"/"
    }
  })
}