
const products = [
    {id: 1, name: "Notebook", price: 120, category: "Stationery", image: "📓"},
    {id: 2, name: "Pen Pack", price: 80, category: "Stationery", image: "🖊️"},
    {id: 3, name: "Headphones", price: 650, category: "Electronics", image: "🎧"},
    {id: 4, name: "Smart Watch", price: 1200, category: "Electronics", image: "⌚"},
    {id: 5, name: "Backpack", price: 850, category: "Accessories", image: "🎒"},
    {id: 6, name: "Water Bottle", price: 250, category: "Accessories", image: "🧴"},
    {id: 7, name: "Desk Lamp", price: 450, category: "Home", image: "💡"},
    {id: 8, name: "Calculator", price: 350, category: "Stationery", image: "🧮"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || {};

const productsDiv = document.getElementById("products");
const cartDiv = document.getElementById("cart-items");

function money(amount) {
    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    });
}

// Display Products
function displayProducts() {
    productsDiv.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p><strong>${money(product.price)}</strong></p>
            <button data-action="add" data-id="${product.id}">
                Add to Cart
            </button>
        </div>
    `).join("");
}

// Add Product
function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
}

// Change Quantity
function changeQuantity(id, delta) {
    cart[id] = (cart[id] || 0) + delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart();
}

// Remove Product
function removeItem(id) {
    delete cart[id];
    saveCart();
}

// Calculate Total
function calculateTotals() {
    const subtotal = Object.keys(cart).reduce((sum, id) => {
        const product = products.find(p => p.id === Number(id));

        if (!product) return sum;

        return sum + product.price * cart[id];
    }, 0);

    const delivery = subtotal > 0 && subtotal < 500 ? 40 : 0;

    return {
        subtotal: subtotal,
        delivery: delivery,
        total: subtotal + delivery
    };
}

// Save Cart
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Display Cart
function renderCart() {
    const ids = Object.keys(cart);

    if (ids.length === 0) {
        cartDiv.innerHTML = "<p>Your cart is empty!</p>";
    } else {
        cartDiv.innerHTML = ids.map(id => {
            const product = products.find(
                p => p.id === Number(id)
            );

            if (!product) return "";

            const quantity = cart[id];

            return `
                <div class="cart-row">
                    <span>${product.name}</span>
                    <span>${money(product.price)}</span>

                    <div>
                        <button data-action="decrease" data-id="${id}">-</button>
                        <strong>${quantity}</strong>
                        <button data-action="increase" data-id="${id}">+</button>
                    </div>

                    <span>${money(product.price * quantity)}</span>

                    <button data-action="remove" data-id="${id}">
                        Remove
                    </button>
                </div>
            `;
        }).join("");
    }

    const totals = calculateTotals();

    document.getElementById("cart-count").textContent =
        ids.reduce((sum, id) => sum + cart[id], 0);

    document.getElementById("subtotal").textContent =
        money(totals.subtotal);

    document.getElementById("delivery").textContent =
        money(totals.delivery);

    document.getElementById("total").textContent =
        money(totals.total);
}

// Product Button Events
productsDiv.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    if (button.dataset.action === "add") {
        addToCart(Number(button.dataset.id));
    }
});

// Cart Button Events
cartDiv.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.dataset.action === "increase") {
        changeQuantity(id, 1);
    }

    if (button.dataset.action === "decrease") {
        changeQuantity(id, -1);
    }

    if (button.dataset.action === "remove") {
        removeItem(id);
    }
});

// Checkout Preview
document.getElementById("checkout-btn").addEventListener("click", function() {
    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty! Please add products first.");
        return;
    }

    const totals = calculateTotals();

    const orderItems = Object.keys(cart).map(id => {
        const product = products.find(p => p.id === Number(id));

        return `<p>${product.name} × ${cart[id]} = ${
            money(product.price * cart[id])
        }</p>`;
    }).join("");

    document.getElementById("order-details").innerHTML = `
        ${orderItems}
        <hr>
        <p>Subtotal: ${money(totals.subtotal)}</p>
        <p>Delivery: ${money(totals.delivery)}</p>
        <h3>Total: ${money(totals.total)}</h3>
    `;

    document.getElementById("checkout-dialog").showModal();
});

// Close Checkout
document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("checkout-dialog").close();
});

// Start Website
displayProducts();
renderCart();
