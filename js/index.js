fetch('./data/data.json')
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('product-list');
    const html = products.map(product => `
      <div class="row mb-5 align-items-center">
        <div class="col-md-6">
          <img src="${product.image.desktop}" alt="${product.name}" class="img-fluid rounded" />
        </div>
        <div class="col-md-6 text-md-start text-center">
          ${product.new ? '<p class="text-danger text-uppercase fw-bold">New Product</p>' : ''}
          <h2 class="fw-bold">${product.name}</h2>
          <p class="text-muted">${product.description}</p>
          <a href="product.html?slug=${product.slug}" class="btn btn-dark mt-2">See Product</a>
        </div>
      </div>
    `).join('');
    container.innerHTML = html;
  })
  .catch(err => console.error("Failed to load products:", err));