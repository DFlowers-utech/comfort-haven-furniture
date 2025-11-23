// Name: Dave Flowers
// ID #: 2404257
// OCC: UM1
// Tutor: Cristine Anuli

// Image mapping function
function getImageName(productId) {
    const imageMap = {
        1: "sofa.jpeg",
        2: "oaktable.jpeg", 
        3: "queenbed.jpeg",
        4: "officechair.jpeg",
        5: "coffeetable.jpeg",
        6: "cabinet.jpeg"
    };
    return imageMap[productId] || "sofa.jpeg";
}

// DOM Manipulation - Question 2a
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize cart count
    updateCartCount();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load products if on products page
    if (document.getElementById('products').classList.contains('active')) {
        loadProducts();
    }
    
    // Load cart if on cart page
    if (document.getElementById('cart').classList.contains('active')) {
        loadCart();
    }
    
    // Load checkout if on checkout page
    if (document.getElementById('checkout').classList.contains('active')) {
        loadCheckout();
    }
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Initialize page-specific functionality
    if (pageId === 'products') {
        loadProducts();
    } else if (pageId === 'cart') {
        loadCart();
    } else if (pageId === 'checkout') {
        loadCheckout();
    }
    
    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    if (navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
    
    return false;
}

// Event Handling - Question 2b
function setupEventListeners() {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            addToCart(e.target);
        }
    });

    // Form submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Cart functionality
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    const cancelCheckoutBtn = document.getElementById('cancel-checkout');
    if (cancelCheckoutBtn) {
        cancelCheckoutBtn.addEventListener('click', cancelCheckout);
    }

    const confirmCheckoutBtn = document.getElementById('confirm-checkout');
    if (confirmCheckoutBtn) {
        confirmCheckoutBtn.addEventListener('click', confirmOrder);
    }

    // Filter functionality
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
}

// Form Validation / Input Handling - Question 2c
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    let isValid = true;

    // Clear previous errors
    clearErrors(['username-error', 'password-error']);

    // Validate username
    if (!username) {
        showError('username-error', 'Username or email is required');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('password-error', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password-error', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (isValid) {
        alert('Login successful!');
        showPage('home');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const dob = document.getElementById('dob').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    
    let isValid = true;

    // Clear previous errors
    clearErrors(['fullname-error', 'email-error', 'dob-error', 'reg-username-error', 'reg-password-error', 'confirm-password-error', 'terms-error']);

    // Validate full name
    if (!fullname) {
        showError('fullname-error', 'Full name is required');
        isValid = false;
    }

    // Validate email
    if (!email) {
        showError('email-error', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email-error', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate date of birth
    if (!dob) {
        showError('dob-error', 'Date of birth is required');
        isValid = false;
    } else {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
            showError('dob-error', 'You must be at least 18 years old');
            isValid = false;
        }
    }

    // Validate username
    if (!username) {
        showError('reg-username-error', 'Username is required');
        isValid = false;
    } else if (username.length < 3) {
        showError('reg-username-error', 'Username must be at least 3 characters');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('reg-password-error', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('reg-password-error', 'Password must be at least 6 characters');
        isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
        showError('confirm-password-error', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirm-password-error', 'Passwords do not match');
        isValid = false;
    }

    // Validate terms
    if (!terms) {
        showError('terms-error', 'You must agree to the terms and conditions');
        isValid = false;
    }

    if (isValid) {
        alert('Registration successful!');
        showPage('login');
    }
}

function handleCheckout(e) {
    e.preventDefault();
    
    const shippingName = document.getElementById('shipping-name').value;
    const shippingAddress = document.getElementById('shipping-address').value;
    const shippingCity = document.getElementById('shipping-city').value;
    const shippingZip = document.getElementById('shipping-zip').value;
    const shippingPhone = document.getElementById('shipping-phone').value;
    
    let isValid = true;

    // Basic validation
    if (!shippingName || !shippingAddress || !shippingCity || !shippingZip || !shippingPhone) {
        alert('Please fill in all shipping information');
        isValid = false;
    }

    return isValid;
}

// Helper functions for validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrors(errorIds) {
    errorIds.forEach(id => {
        const errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    });
}

// Basic Interactivity / Logic 
// Cart functionality
function addToCart(button) {
    const productId = button.getAttribute('data-id');
    const productName = button.getAttribute('data-name');
    const productPrice = parseFloat(button.getAttribute('data-price'));
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation
    alert(productName + ' added to cart!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsElement = document.getElementById('cart-items');
    const emptyCartElement = document.getElementById('empty-cart');
    const cartSummaryElement = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        emptyCartElement.classList.remove('hidden');
        cartSummaryElement.classList.add('hidden');
        return;
    }
    
    emptyCartElement.classList.add('hidden');
    cartSummaryElement.classList.remove('hidden');
    
    cartItemsElement.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="item-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
            <div class="item-subtotal">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        `;
        cartItemsElement.appendChild(cartItemElement);
    });
    
    updateCartTotals();
}

function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        loadCart();
        updateCartCount();
    }
}

function updateCartTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = subtotal * 0.1; // 10% discount
    const tax = (subtotal - discount) * 0.15; // 15% tax
    const total = subtotal - discount + tax;
    
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('discount').textContent = '-$' + discount.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    showPage('checkout');
}

function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItemsElement = document.getElementById('checkout-items');
    
    if (cart.length === 0) {
        showPage('cart');
        return;
    }
    
    checkoutItemsElement.innerHTML = '';
    
    cart.forEach(item => {
        const checkoutItemElement = document.createElement('div');
        checkoutItemElement.className = 'checkout-item';
        checkoutItemElement.innerHTML = `
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        `;
        checkoutItemsElement.appendChild(checkoutItemElement);
    });
    
    updateCheckoutTotals();
}

function updateCheckoutTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = subtotal * 0.1; // 10% discount
    const tax = (subtotal - discount) * 0.15; // 15% tax
    const total = subtotal - discount + tax;
    
    document.getElementById('checkout-subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('checkout-discount').textContent = '-$' + discount.toFixed(2);
    document.getElementById('checkout-tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('checkout-total').textContent = '$' + total.toFixed(2);
}

function cancelCheckout() {
    if (confirm('Are you sure you want to cancel checkout?')) {
        showPage('cart');
    }
}

function confirmOrder() {
    if (handleCheckout(new Event('submit'))) {
        alert('Thank you for your order! Your furniture will be delivered soon.');
        localStorage.removeItem('cart');
        showPage('home');
    }
}

// Product filtering and loading
function loadProducts() {
    const products = [
        {
            id: 1,
            name: "Modern Comfort Sofa",
            price: 899.99,
            category: "living",
            description: "Luxurious 3-seater sofa with premium fabric"
        },
        {
            id: 2,
            name: "Oak Dining Table",
            price: 599.99,
            category: "dining",
            description: "Solid oak dining table seats 6 people"
        },
        {
            id: 3,
            name: "Queen Size Bed Frame",
            price: 749.99,
            category: "bedroom",
            description: "Elegant wooden bed frame with storage"
        },
        {
            id: 4,
            name: "Ergonomic Office Chair",
            price: 299.99,
            category: "office",
            description: "Comfortable office chair with lumbar support"
        },
        {
            id: 5,
            name: "Coffee Table Set",
            price: 349.99,
            category: "living",
            description: "Modern coffee table with matching side tables"
        },
        {
            id: 6,
            name: "Wardrobe Cabinet",
            price: 499.99,
            category: "bedroom",
            description: "Spacious 4-door wardrobe with mirror"
        }
    ];
    
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts(products);
}

function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="images/${getImageName(product.id)}" alt="${product.name}" class="product-img">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" 
                    data-id="${product.id}" 
                    data-name="${product.name}" 
                    data-price="${product.price}">
                Add to Cart
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
}

function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    let filteredProducts = products;
    
    // Filter by category
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    // Filter by price
    if (priceFilter !== 'all') {
        switch (priceFilter) {
            case '0-500':
                filteredProducts = filteredProducts.filter(product => product.price <= 500);
                break;
            case '500-1000':
                filteredProducts = filteredProducts.filter(product => product.price > 500 && product.price <= 1000);
                break;
            case '1000+':
                filteredProducts = filteredProducts.filter(product => product.price > 1000);
                break;
        }
    }
    
    displayProducts(filteredProducts);
}
