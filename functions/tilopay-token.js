export async function onRequest(context) {
  const response = await fetch("https://api.tilopay.com/v2/GetTokenSdk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: context.env.TILOPAY_USER,
      apiKey: context.env.TILOPAY_API_KEY
    })
  });

  const data = await response.json();

  return new Response(JSON.stringify({ token: data.token }), {
    headers: { "Content-Type": "application/json" }
  });
}
