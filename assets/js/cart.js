const CART_KEY = "myguate_cart_v1";

/* -------------------------
   Core cart functions
------------------------- */
function loadCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] };
}

function saveCart(cart) {
  cart.updatedAt = new Date().toISOString();
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function addToCart(product) {
  const cart = loadCart();
  const existing = cart.items.find(i => i.sku === product.sku);

  if (existing) {
    existing.qty += product.qty;
  } else {
    cart.items.push(product);
  }

  saveCart(cart);
}

/* -------------------------
   Quantity controls
------------------------- */
function changeQty(sku, delta) {
  const cart = loadCart();
  const item = cart.items.find(i => i.sku === sku);

  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart.items = cart.items.filter(i => i.sku !== sku);
  }

  saveCart(cart);
  if (typeof renderCart === "function") {
  renderCart();
}

}

/* -------------------------
   Utilities
------------------------- */
function cartTotal() {
  const cart = loadCart();
  return cart.items.reduce((s, i) => s + i.price * i.qty, 0);
}

function formatQ(amount) {
  return "Q " + amount.toFixed(2);
}

/* -------------------------
   Cart badge
------------------------- */
function updateCartBadge() {
  const cart = loadCart();
  const count = cart.items.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) badge.innerText = count;
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
