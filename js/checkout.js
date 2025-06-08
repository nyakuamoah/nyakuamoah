// js/checkout.js
const SHIPPING = 50;
const VAT_RATE = 0.2;

function loadCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) {
    document.getElementById("summary").innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let subtotal = 0;
  let itemsHTML = "<ul class='list-group mb-3'>";
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    itemsHTML += `<li class='list-group-item d-flex justify-content-between'>
      ${item.name} x${item.quantity}
      <span>$${itemTotal.toFixed(2)}</span>
    </li>`;
  });
  itemsHTML += "</ul>";

  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat + SHIPPING;

  const summaryHTML = `
    <h4>Order Summary</h4>
    ${itemsHTML}
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p><strong>Shipping:</strong> $${SHIPPING}</p>
    <p><strong>VAT (20%):</strong> $${vat.toFixed(2)}</p>
    <h5>Total: $${total.toFixed(2)}</h5>
  `;

  document.getElementById("summary").innerHTML = summaryHTML;
}

document
  .getElementById("checkout-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    let summary = "<ul class='list-group'>";
    cart.forEach((item) => {
      summary += `<li class='list-group-item d-flex justify-content-between'>
      ${item.name} x${item.quantity}
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </li>`;
    });
    summary += "</ul>";

    document.getElementById("orderSummary").innerHTML = summary;

    // Clear cart and show modal
    localStorage.removeItem("cart");

    const modal = new bootstrap.Modal(
      document.getElementById("confirmationModal")
    );
    modal.show();
  });

loadCartSummary();
