function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const slug = getQueryParam("slug");

fetch("./data/data.json")
  .then((res) => res.json())
  .then((data) => {
    const product = data.find((p) => p.slug === slug);
    if (!product) {
      document.getElementById(
        "product-container"
      ).innerHTML = `<p>Product not found.</p>`;
      return;
    }

    const includesHTML = product.includes
      .map((item) => `<li>${item.quantity}x ${item.item}</li>`)
      .join("");

    const galleryHTML = `
        <div class="row g-3">
          <div class="col-md-4"><img src="${product.gallery.first.desktop}" class="img-fluid rounded" /></div>
          <div class="col-md-4"><img src="${product.gallery.second.desktop}" class="img-fluid rounded" /></div>
          <div class="col-md-4"><img src="${product.gallery.third.desktop}" class="img-fluid rounded" /></div>
        </div>
      `;

    const html = `
        <div class="row mb-5 align-items-center">
          <div class="col-md-6">
            <img src="${product.image.desktop}" alt="${
      product.name
    }" class="img-fluid rounded" />
          </div>
          <div class="col-md-6">
            ${
              product.new
                ? '<p class="text-danger text-uppercase fw-bold">New Product</p>'
                : ""
            }
            <h2 class="fw-bold">${product.name}</h2>
            <p class="text-muted">${product.description}</p>
            <p class="fw-bold">$${product.price}</p>
            <div class="d-flex align-items-center mb-3">
              <input type="number" id="quantity" class="form-control me-3" value="1" min="1" style="width: 80px;" />
              <button class="btn btn-dark" onclick="addToCart('${
                product.slug
              }', ${product.id}, '${product.name}', ${
      product.price
    })">Add to Cart</button>
            </div>
          </div>
        </div>
  
        <div class="row mb-5">
          <div class="col-md-6">
            <h4>Features</h4>
            <p>${product.features.replace(/\n/g, "<br>")}</p>
          </div>
          <div class="col-md-6">
            <h4>In the Box</h4>
            <ul>${includesHTML}</ul>
          </div>
        </div>
  
        <h4 class="mb-3">Gallery</h4>
        ${galleryHTML}
      `;

    document.getElementById("product-container").innerHTML = html;
  })
  .catch((err) => {
    console.error("Failed to load product:", err);
    document.getElementById(
      "product-container"
    ).innerHTML = `<p>Error loading product.</p>`;
  });

function addToCart(slug, id, name, price) {
  const qty = parseInt(document.getElementById("quantity").value);
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ id, slug, name, price, quantity: qty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartModal();
  updateCartCount();
  alert(`${name} added to cart.`);
}
