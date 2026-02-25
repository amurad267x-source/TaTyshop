export async function onRequest({ env }) {

  const googleUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID.trim(),
      redirect_uri: env.GOOGLE_REDIRECT_URI.trim(),
      response_type: "code",
      scope: "openid email profile",
      access_type: "online",
      prompt: "select_account"
    });

  return Response.redirect(googleUrl, 302);
}