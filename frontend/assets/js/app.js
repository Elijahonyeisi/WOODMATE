// --- CART FUNCTIONALITY FOR carts.html ---

// Sample structure for cart items in localStorage:
// [
//   {
//     id: "product-1",
//     name: "Executive Office Chair",
//     price: 85000,
//     image: "url",
//     workshop: "Lagos Workshop",
//     material: "African Mahogany",
//     status: "In Stock",
//     statusType: "success", // success, warning, danger
//     quantity: 1
//   },
//   ...
// ]

const CART_KEY = "woodmate_cart";

// Utility: Format price
function formatPrice(n) {
    return "₦" + n.toLocaleString();
}

// Utility: Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Utility: Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Utility: Find item index by id
function findItemIndex(cart, id) {
    return cart.findIndex(item => item.id === id);
}

// Render cart items
function renderCart() {
    const cart = getCart();
    const cartList = document.querySelector(".col-lg-8");
    const summary = document.querySelector(".summary-card");
    const cartCountBadges = document.querySelectorAll(".badge.bg-dark");
    let itemsHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>${cart.length} Item${cart.length !== 1 ? "s" : ""} in your cart</h4>
            <a href="#" class="btn btn-outline-danger btn-sm" id="clear-cart"><i class="fas fa-trash me-1"></i> Clear Cart</a>
        </div>
    `;

    if (cart.length === 0) {
        itemsHTML += `<div class="alert alert-info">Your cart is empty. <a href="./products.html">Browse products</a>.</div>`;
        cartList.innerHTML = itemsHTML;
        if (summary) summary.innerHTML = "";
        cartCountBadges.forEach(b => b.textContent = "0");
        return;
    }

    // Render each cart item
    cart.forEach(item => {
        itemsHTML += `
        <div class="cart-item" data-id="${item.id}">
            <div class="row g-0">
                <div class="col-md-4 position-relative">
                    <img src="${item.image}" class="cart-item-image" alt="${item.name}">
                    <span class="workshop-badge badge">${item.workshop}</span>
                    <span class="quality-badge badge bg-${item.statusType}">
                        <i class="fas fa-${item.statusType === "success" ? "check-circle" : item.statusType === "warning" ? "exclamation-triangle" : "clock"} me-1"></i>${item.status}
                    </span>
                </div>
                <div class="col-md-8">
                    <div class="p-3">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h5>${item.name}</h5>
                                <p class="text-muted mb-2">${item.desc || ""}</p>
                                <span class="material-badge badge"><i class="fas fa-tree me-1"></i>${item.material}</span>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-danger btn-remove" title="Remove"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="quantity-selector">
                                <button class="quantity-btn btn-qty-minus">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" min="1">
                                <button class="quantity-btn btn-qty-plus">+</button>
                            </div>
                            <div class="text-end">
                                <h5 class="mb-0">${formatPrice(item.price * item.quantity)}</h5>
                                <small class="text-${item.statusType}">
                                    <i class="fas fa-${item.statusType === "success" ? "check-circle" : item.statusType === "warning" ? "exclamation-triangle" : "clock"} me-1"></i>${item.status}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    itemsHTML += `
        <div class="d-flex justify-content-between mt-4">
            <a href="./products.html" class="btn btn-outline-primary"><i class="fas fa-arrow-left me-1"></i> Continue Shopping</a>
        </div>
    `;

    cartList.innerHTML = itemsHTML;

    // Update cart badge(s)
    cartCountBadges.forEach(b => b.textContent = cart.length);

    // Update summary
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal; // Add delivery/tax if needed
    if (summary) {
        summary.innerHTML = `
            <h4 class="mb-4">Order Summary</h4>
            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal (${cart.length} item${cart.length !== 1 ? "s" : ""})</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            <div class="d-flex justify-content-between mb-3 fw-bold">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
            </div>
            <button class="btn btn-checkout w-100 mb-3">
                <i class="fas fa-lock me-2"></i> Proceed to Checkout
            </button>
            <div class="text-center">
                <small class="text-muted">By placing your order, you agree to our <a href="#" style="color: #fd7e14;">Terms of Service</a></small>
            </div>
        `;
    }

    // Attach event listeners
    attachCartEvents();
}

// Attach event listeners for cart actions
function attachCartEvents() {
    // Remove item
    document.querySelectorAll(".btn-remove").forEach(btn => {
        btn.onclick = function () {
            const id = btn.closest(".cart-item").dataset.id;
            let cart = getCart();
            cart = cart.filter(item => item.id !== id);
            saveCart(cart);
            renderCart();
        };
    });

    // Quantity minus
    document.querySelectorAll(".btn-qty-minus").forEach(btn => {
        btn.onclick = function () {
            const itemDiv = btn.closest(".cart-item");
            const id = itemDiv.dataset.id;
            let cart = getCart();
            const idx = findItemIndex(cart, id);
            if (cart[idx].quantity > 1) {
                cart[idx].quantity--;
                saveCart(cart);
                renderCart();
            }
        };
    });

    // Quantity plus
    document.querySelectorAll(".btn-qty-plus").forEach(btn => {
        btn.onclick = function () {
            const itemDiv = btn.closest(".cart-item");
            const id = itemDiv.dataset.id;
            let cart = getCart();
            const idx = findItemIndex(cart, id);
            cart[idx].quantity++;
            saveCart(cart);
            renderCart();
        };
    });

    // Quantity input
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.onchange = function () {
            const itemDiv = input.closest(".cart-item");
            const id = itemDiv.dataset.id;
            let cart = getCart();
            const idx = findItemIndex(cart, id);
            let val = parseInt(input.value);
            if (isNaN(val) || val < 1) val = 1;
            cart[idx].quantity = val;
            saveCart(cart);
            renderCart();
        };
    });

    // Clear cart
    const clearBtn = document.getElementById("clear-cart");
    if (clearBtn) {
        clearBtn.onclick = function (e) {
            e.preventDefault();
            if (confirm("Are you sure you want to clear your cart?")) {
                saveCart([]);
                renderCart();
            }
        };
    }
}

// On page load, render cart if on carts.html
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.endsWith("carts.html")) {
        renderCart();
    }
});

// WhatsApp checkout integration
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.endsWith("carts.html")) {
        // Delegate to handle dynamic rendering
        document.body.addEventListener("click", function (e) {
            if (e.target.closest(".btn-checkout")) {
                e.preventDefault();
                const cart = JSON.parse(localStorage.getItem("woodmate_cart")) || [];
                if (cart.length === 0) {
                    alert("Your cart is empty!");
                    return;
                }
                let message = "Hello, I want to place an order on WOODMATE:%0A";
                cart.forEach((item, idx) => {
                    message += `${idx + 1}. ${item.name} (${item.material}) x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}%0A`;
                });
                const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                message += `%0ATotal: ₦${total.toLocaleString()}`;
                // WhatsApp number in international format (Nigeria: +2348139930726)
                const phone = "2348139930726";
                const waUrl = `https://wa.me/${phone}?text=${message}`;
                window.open(waUrl, "_blank");
            }
        });
    }
});

// --- OPTIONAL: Add-to-cart logic for products.html ---
// On products.html, when user clicks "Add to Cart", push product to localStorage
// Example usage (to be placed in products.html's JS):
/*
function addToCart(product) {
    let cart = getCart();
    const idx = findItemIndex(cart, product.id);
    if (idx !== -1) {
        cart[idx].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    // Optionally show a toast/alert
}
*/

