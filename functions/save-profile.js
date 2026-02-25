export async function onRequestPost({ request, env }) {

  const order = await request.json()

  const id = crypto.randomUUID()

  order.status = "pending"
  order.id = id

  await env.ORDERS.put("order:"+id, JSON.stringify(order))

  return new Response(JSON.stringify({
    orderId:id,
    amount:order.amount
  }))
}