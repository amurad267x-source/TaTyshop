let cart = JSON.parse(localStorage.getItem("cart")||"[]");

function addToCart(product){
  cart.push(product);
  localStorage.setItem("cart",JSON.stringify(cart));
}

function getCart(){
  return cart;
}