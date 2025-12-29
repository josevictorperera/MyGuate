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
if (window.location.pathname.includes('cart') && typeof renderCart === "function") {
        renderCart();
}

}

/* -------------------------
   Utilities
------------------------- */
function cartTotal() {
    const cart = loadCart();
    // Ensure both price and qty are treated as numbers during reduction
    return cart.items.reduce((sum, item) => {
        const p = parseFloat(item.price) || 0;
        const q = parseInt(item.qty) || 0;
        return sum + (p * q);
    }, 0);
}

function formatQ(amount) {
  // If amount is null, undefined, or NaN, default to 0
  const value = parseFloat(amount) || 0;
  return "Q " + value.toFixed(2);
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

// Function to open the drawer
function openCartDrawer() {
    document.getElementById("side-cart").classList.add("open");
    document.getElementById("cart-overlay").classList.add("show");
    renderSideCart();
}

// Function to close the drawer
function closeCartDrawer() {
    document.getElementById("side-cart").classList.remove("open");
    document.getElementById("cart-overlay").classList.remove("show");
}

// Render items inside the drawer
function renderSideCart() {
    const cart = loadCart();
    const container = document.getElementById("side-cart-items");
    const totalEl = document.getElementById("side-cart-total");
    
    if (!cart.items.length) {
        container.innerHTML = "<p class='text-center mt-5'>Tu carrito está vacío.</p>";
        totalEl.innerText = "Q 0.00";
        return;
    }

    container.innerHTML = cart.items.map(i => `
        <div class="d-flex align-items-center mb-3 border-bottom pb-2">
            <div class="flex-grow-1">
                <h6 class="mb-0" style="font-size: 0.9rem;">${i.name}</h6>
                <small class="text-muted">${i.qty} x ${formatQ(i.price)}</small>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="changeQty('${i.sku}', -1)">×</button>
        </div>
    `).join("");

    totalEl.innerText = formatQ(cartTotal());
}

// Initialize Close Listeners
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("cart-overlay");
    const closeBtn = document.getElementById("close-cart");

    if(overlay) overlay.addEventListener("click", closeCartDrawer);
    if(closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
});

// CRITICAL: Update your existing addToCart to trigger the drawer
const originalAddToCart = addToCart;
addToCart = function(product) {
    originalAddToCart(product); // Run existing logic
    openCartDrawer();           // Then slide open the cart
};