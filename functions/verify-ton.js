export async function onRequestPost({ request, env }) {

  const { orderId, txHash } = await request.json()

  const orderRaw = await env.ORDERS.get("order:"+orderId)
  if(!orderRaw) return new Response("No order",{status:404})

  const order = JSON.parse(orderRaw)

  const res = await fetch(
    "https://toncenter.com/api/v2/getTransactions?hash=" + txHash
  )

  const data = await res.json()

  if(!data.ok) return new Response("Fail",{status:400})

  const tx = data.result[0]

  if(parseFloat(tx.in_msg.value)/1e9 >= order.amount){

    order.status = "paid"
    order.txHash = txHash

    await env.ORDERS.put("order:"+orderId, JSON.stringify(order))

    return new Response(JSON.stringify({paid:true}))
  }

  return new Response(JSON.stringify({paid:false}))
}