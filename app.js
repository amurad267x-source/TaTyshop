// ================== AUTH ==================

async function handleCredentialResponse(response) {

  await fetch('/auth', {
    method: 'POST',
    body: JSON.stringify({ token: response.credential })
  })

  localStorage.setItem("logged", "true")
  location.href = "/catalog.html"
}

window.onload = () => {

  if(document.getElementById("g_id_onload")){
    google.accounts.id.initialize({
      client_id: "ТВОЙ_GOOGLE_CLIENT_ID",
      callback: handleCredentialResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("auth"),
      { theme: "filled_blue", size: "large" }
    )
  }
}

// ================== CART ==================

let cart = JSON.parse(localStorage.getItem("cart") || "[]")

function addToCart(product){
  cart.push(product)
  localStorage.setItem("cart", JSON.stringify(cart))
  alert("Добавлено в корзину")
}

function renderCart(){

  const container = document.getElementById("cart-items")
  const totalBox = document.getElementById("total")

  if(!container) return

  container.innerHTML = ""

  let total = 0

  cart.forEach((item,i)=>{
    total += item.price
    container.innerHTML += `
      <div class="card">
        ${item.name} - ${item.price} TON
        <button onclick="removeItem(${i})">Удалить</button>
      </div>
    `
  })

  totalBox.innerText = total + " TON"
  localStorage.setItem("orderTotal", total)
}

function removeItem(i){
  cart.splice(i,1)
  localStorage.setItem("cart", JSON.stringify(cart))
  renderCart()
}

renderCart()

// ================== TON CONNECT ==================

let tonConnectUI

function initTon(){

  tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://tonconnect8888.pages.dev/tonconnect.manifest.json',
    buttonRootId: 'ton-connect'
  })
}

async function payOrder(){

  const amount = localStorage.getItem("orderTotal")

  const create = await fetch('/create-order',{
    method:"POST",
    body:JSON.stringify({
      amount: parseFloat(amount)
    })
  })

  const order = await create.json()

  const tx = {
    validUntil: Math.floor(Date.now()/1000)+600,
    messages: [
      {
        address: "UQBmj5_NTvN1-QnRzPtKBm6T9gsgNAoirhs9aCXICcPpNOXP",
        amount: (order.amount * 1e9).toString()
      }
    ]
  }

  const result = await tonConnectUI.sendTransaction(tx)

  await fetch('/verify-ton',{
    method:"POST",
    body:JSON.stringify({
      orderId: order.orderId,
      txHash: result.boc
    })
  })

  alert("Оплата подтверждена")
  localStorage.removeItem("cart")
  location.href="/account.html"
}