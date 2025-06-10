document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) return;

  fetch("./data/data.json")
    .then((res) => res.json())
    .then((data) => {
      const product = data.find((p) => p.slug === slug);
      if (!product) return;
      renderProduct(product);
    });
});

function renderProduct(product) {
  const container = document.getElementById("product-detail");
  if (!container) return;

  container.innerHTML = `
      <section class="container my-5">
        <a href="javascript:history.back()" class="text-muted small d-inline-block mb-3">Go Back</a>
        <div class="row align-items-center mb-5">
          <div class="col-md-6">
            <img src="${
              product.image.desktop
            }" class="img-fluid rounded" alt="${product.name}" />
          </div>
          <div class="col-md-6">
            <p class="text-uppercase letter-spacing text-primary small">${
              product.new ? "New Product" : ""
            }</p>
            <h1 class="display-6 fw-bold">${product.name}</h1>
            <p class="text-muted">${product.description}</p>
            <p class="fw-bold fs-5 mb-4">$${product.price.toLocaleString()}</p>
            <div class="d-flex align-items-center gap-3">
              <div class="quantity-box border rounded d-flex">
                <button class="btn px-3" onclick="changeQty(-1)">-</button>
                <span class="px-3" id="qty">1</span>
                <button class="btn px-3" onclick="changeQty(1)">+</button>
              </div>
              <button class="btn-primary text-uppercase" onclick="addToCart('${
                product.slug
              }')">Add to Cart</button>
            </div>
          </div>
        </div>
  
        <div class="row mb-5">
          <div class="col-md-8">
            <h4 class="text-uppercase mb-3">Features</h4>
            <p class="text-muted">${product.features}</p>
          </div>
          <div class="col-md-4">
            <h4 class="text-uppercase mb-3">In the Box</h4>
            <ul class="list-unstyled">
              ${product.includes
                .map(
                  (item) => `
                <li class="mb-2">
                  <span class="text-primary fw-bold">${item.quantity}x</span>
                  <span class="text-muted ms-2">${item.item}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
  
        <div class="row g-4 mb-5">
          ${
            product.gallery.first.desktop
              ? `<div class="col-md-4">
                <img src="${product.gallery.first.desktop}" class="img-fluid rounded" />
               </div>
               <div class="col-md-4">
                <img src="${product.gallery.second.desktop}" class="img-fluid rounded" />
               </div>
               <div class="col-md-4">
                <img src="${product.gallery.third.desktop}" class="img-fluid rounded" />
               </div>`
              : ""
          }
        </div>
  
        <h3 class="text-center text-uppercase mt-4">You may also like</h3>
        <div class="row text-center g-4">
          ${product.others
            .map(
              (other) => `
            <div class="col-md-4">
              <img src="${other.image.desktop}" class="img-fluid mb-3 rounded" alt="${other.name}" />
              <h5 class="text-uppercase">${other.name}</h5>
              <a href="product.html?slug=${other.slug}" class="btn-primary text-uppercase mt-3">See Product</a>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;
}

function changeQty(amount) {
  const qtyEl = document.getElementById("qty");
  let current = parseInt(qtyEl.textContent);
  current = Math.max(1, current + amount);
  qtyEl.textContent = current;
}

function addToCart(slug) {
  const qty = parseInt(document.getElementById("qty").textContent);
  fetch("./data/data.json")
    .then((res) => res.json())
    .then((data) => {
      const product = data.find((p) => p.slug === slug);
      if (!product) return;

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item) => item.slug === slug);

      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({
          slug: slug,
          name: product.shortName || product.name,
          price: product.price,
          image: `.${product.image.desktop}`,
          quantity: qty,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      updateCartModal();
    });
}
