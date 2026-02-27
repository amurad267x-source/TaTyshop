const API = "https://backend.tatyshop.workers.dev";

async function loadProducts() {
  const res = await fetch(API + "/products");
  const products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.image}" alt="">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="price">${p.price_ton} TON</div>
      <button class="buy-btn">Добавить в корзину</button>
    `;

    container.appendChild(card);
  });
}

loadProducts();