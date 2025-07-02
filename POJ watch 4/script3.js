let cartCount = 0;
const cartCounter = document.getElementById("cart-count");
const productList = document.getElementById("product-list");
const count = document.getElementById("count");

const products = ["Rolex", "Omega"];
let start = 0;
let limit = 0;
let obj = {};
let cart = [];
let watchList = [];

async function loadWatches() {
  try {
    const response = await fetch('Rolex.json');
    obj = await response.json();
    limit = Object.keys(obj).length;

    const slice = products.slice(start, start + limit);

    for (const brand of slice) {
      const brandResponse = await fetch(`${brand}.json`);
      const brandData = await brandResponse.json();

      const heading = document.createElement('div');
      heading.innerHTML = `<h3 class="mt-4">${brand}</h3>`;
      productList.appendChild(heading);

      brandData.forEach(watch => {
        watch.brand = brand;
        watchList.push(watch);
        displayWatchCard(watch);
      });

      start += limit;
    }
  } catch (error) {
    console.error("Error loading watches:", error);
  }
}

function displayWatchCard(watch) {
  const col = document.createElement('div');
  col.className = 'col-md-3 mb-4';
  col.innerHTML = `
    <div class="card h-100">

      <img src="${watch.image}" class="card-img-top" alt="${watch.name}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${watch.name}</h5>
        <p class="card-text">Rs ${watch.price}</p>
        <button class="btn btn-success mt-auto add-to-cart">Add to Cart</button>
      </div>
    </div>
  `;

  const addCartBtn = col.querySelector('.add-to-cart');
  addCartBtn.addEventListener('click', () => {
    cartCount++;
    cartCounter.innerText = cartCount;
    count.innerText = cartCount;

    const existingItem = cart.find(item => item.name === watch.name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...watch, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
  });

  productList.appendChild(col);
}

function displayCart() {
  const container = document.getElementById('item');
  const totalAmount = document.getElementById('total');

  container.innerHTML = '';
  let total = 0;

  cart.forEach((watch, index) => {
    total += watch.price * watch.quantity;

    container.innerHTML += `
      <tr>
        <td>
          <a href="javascript:void(0)">
            <ion-icon name="trash-outline" class="trash" onclick="removeItem(${index})"></ion-icon>
          </a>
        </td>
        <td><img src="${watch.image}" height="100"></td>
        <td><h5 class="cart-product-title">${watch.name}</h5></td>
        <td><h5>₹${watch.price}</h5></td>
        <td class="quantity">
          <button style="width:50px;" onclick="changeQty(${index}, -1)">-</button>
          <span class="numquantity">${watch.quantity}</span>
          <button style="width:50px;" onclick="changeQty(${index}, 1)">+</button>
        </td>
      </tr>
    `;
  });

  totalAmount.innerText = `Total: ₹${total}/-`;
}

function changeQty(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
    cartCount--;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  count.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCounter.innerText = count.innerText;
  displayCart();
}

function removeItem(index) {
  cartCount -= cart[index].quantity;
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  count.innerText = cartCount;
  cartCounter.innerText = cartCount;
  displayCart();
}

document.querySelector(".btn-buy")?.addEventListener("click", () => {
  const container = document.getElementById('item');
  const totalAmount = document.getElementById('total');

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    totalAmount.innerText = '';
    return;
  }

  alert("Thank you for your purchase!");
  cart = [];
  cartCount = 0;
  count.innerText = 0;
  cartCounter.innerText = 0;
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
});

// Search Function
function searchWatches() {
  const searchTerm = document.getElementById('search-bar').value.toLowerCase();
  productList.innerHTML = '';

  const filteredWatches = watchList.filter(watch =>
    watch.name.toLowerCase().includes(searchTerm)
  );

  if (filteredWatches.length === 0) {
    productList.innerHTML = '<p>No watches found.</p>';
  } else {
    filteredWatches.forEach(watch => displayWatchCard(watch));
  }
}

// Dropdown Category
function load(brand) {
  productList.innerHTML = '';

  if (brand === "all") {
    watchList.forEach(watch => displayWatchCard(watch));
  } else {
    const filtered = watchList.filter(watch =>
      watch.brand.toLowerCase() === brand.toLowerCase()
    );
    if (filtered.length === 0) {
      productList.innerHTML = `<p>No ${brand} watches found.</p>`;
    } else {
      filtered.forEach(watch => displayWatchCard(watch));
    }
  }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.style.display = cartSidebar.style.display === 'none' ? 'block' : 'none';
  }
  


// Load on startup
loadWatches();
