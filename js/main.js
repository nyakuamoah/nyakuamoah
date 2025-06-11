// Cart Counter
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? "inline-block" : "none";
  }
}

function highlightActiveNav() {
  const path = location.pathname.split("/").pop();
  document.querySelectorAll("a[data-page]").forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active", "text-warning");
    } else {
      link.classList.remove("active", "text-warning");
    }
  });
}

// Main script to handle cart and navigation
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  highlightActiveNav();
  if (typeof renderCart === "function") renderCart(); // if cart.js is active
  if (typeof updateCartModal === "function") updateCartModal(); // if cart.js is active
  if (typeof syncCartUI === "function") syncCartUI(); // if cart.js is active
  if (document.getElementById("cart-items-container")) {
    updateCartModal();
  }

  // Add clear-cart button handler
  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      updateCartCount();
      updateCartModal();
    });
  }
});

// Cart
function updateCartModal() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const container = document.getElementById("cart-items-container");
  const countEl = document.getElementById("modal-cart-count");
  const totalEl = document.getElementById("cart-product-total");
  const vatEl = document.getElementById("cart-vat");
  const grandEl = document.getElementById("cart-grand-total");
  const shippingEl = document.getElementById("cart-shipping");
  const footer = document.querySelector(".modal-footer");
  const clearBtn = document.getElementById("clear-cart");

  // Empty cart display
  if (cart.length === 0) {
    if (container)
      container.innerHTML = `<p class="text-center w-100">Your cart is empty.</p>`;
    if (countEl) countEl.textContent = "0";
    if (totalEl) totalEl.textContent = "$0";
    if (vatEl) vatEl.textContent = "$0";
    if (grandEl) grandEl.textContent = "$0";
    if (shippingEl) shippingEl.textContent = "$0";
    if (footer) footer.style.display = "none";
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  // If cart is not empty, render contents
  if (footer) footer.style.display = "flex";
  if (clearBtn) clearBtn.style.display = "inline-block";
  if (container) container.innerHTML = "";

  let productTotal = 0;
  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    productTotal += subtotal;

    const row = document.createElement("div");
    row.className = "d-flex align-items-center justify-content-between";
    row.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${item.image}" alt="${item.name}" style="width: 64px; border-radius: 8px;">
        <div>
          <p class="mb-0 fw-bold">${item.name}</p>
          <p class="mb-0 text-muted">$${item.price}</p>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-light" onclick="updateQty('${item.slug}', -1)">-</button>
        <span>${item.quantity}</span>
        <button class="btn btn-sm btn-light" onclick="updateQty('${item.slug}', 1)">+</button>
      </div>
    `;
    container.appendChild(row);
  });

  const shipping = 50;
  const vat = productTotal * 0.2;
  const grandTotal = productTotal + shipping;

  if (countEl)
    countEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalEl) totalEl.textContent = `$${productTotal.toLocaleString()}`;
  if (vatEl)
    vatEl.textContent = `$${vat.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;
  if (grandEl) grandEl.textContent = `$${grandTotal.toLocaleString()}`;
  if (shippingEl) shippingEl.textContent = `$${shipping.toLocaleString()}`;
}

function updateQty(slug, delta) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex((item) => item.slug === slug);
  if (index !== -1) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) {
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartModal();
  }
}

function syncCartUI() {
  updateCartModal();
  updateCartCount();
  if (typeof renderCart === "function") renderCart(); // if cart.js is active
}
