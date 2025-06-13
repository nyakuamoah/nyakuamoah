function renderCart() {
  const container = document.getElementById("cart-container");
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty.</p>`;
    return;
  }

  let subtotal = 0;
  let cartHTML = `
      <h2>Your Cart</h2>
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th></th></tr></thead>
          <tbody>
    `;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    cartHTML += `
        <tr>
          <td>${item.name}</td>
          <td>
            <input type="number" class="form-control" value="${
              item.quantity
            }" min="1"
                   onchange="updateQuantity(${index}, this.value)">
          </td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Remove</button>
          </td>
        </tr>
      `;
  });

  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat + SHIPPING;

  cartHTML += `
          </tbody>
        </table>
      </div>
  
      <div class="border-top pt-3">
        <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
        <p><strong>Shipping:</strong> $${SHIPPING.toFixed(2)}</p>
        <p><strong>VAT (20%):</strong> $${vat.toFixed(2)}</p>
        <h4>Total: $${total.toFixed(2)}</h4>
        <a href="checkout.html" class="btn btn-dark mt-3">Proceed to Checkout</a>
      </div>
    `;

  container.innerHTML = cartHTML;
}

function updateQuantity(index, quantity) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (quantity < 1) quantity = 1;
  cart[index].quantity = parseInt(quantity);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartModal();
  updateCartCount();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartModal();
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
