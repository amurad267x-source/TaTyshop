export async function onRequestGet({ env }){

  const list = await env.ORDERS.list()

  const orders = []

  for(const key of list.keys){
    const o = await env.ORDERS.get(key.name)
    orders.push(JSON.parse(o))
  }

  return new Response(JSON.stringify(orders))
}