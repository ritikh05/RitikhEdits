const products = [
  {
    id: 1,
    name: "Premium Black Hoodie",
    price: 1299,
    originalPrice: 1599,
    category: "hoodie",
    gender: "men",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    description: "Comfortable premium cotton blend hoodie"
  },
  {
    id: 2,
    name: "Elegant White Oversized Shirt",
    price: 1099,
    originalPrice: 1299,
    category: "oversized",
    gender: "women",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    description: "Relaxed fit oversized shirt for casual wear"
  },
  {
    id: 3,
    name: "Classic White T-Shirt",
    price: 699,
    originalPrice: 899,
    category: "tshirt",
    gender: "men",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    description: "Essential cotton t-shirt for everyday wear"
  },
  {
    id: 4,
    name: "Stylish Navy Hoodie",
    price: 1399,
    originalPrice: 1699,
    category: "hoodie",
    gender: "women",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    description: "Trendy navy blue hoodie with modern fit"
  },
  {
    id: 5,
    name: "Vintage Graphic Tee",
    price: 799,
    originalPrice: 999,
    category: "tshirt",
    gender: "women",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    description: "Retro-style graphic t-shirt with unique design"
  },
  {
    id: 6,
    name: "Comfort Oversized Hoodie",
    price: 1499,
    originalPrice: 1799,
    category: "oversized",
    gender: "men",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    description: "Ultra-comfortable oversized hoodie for maximum comfort"
  }
];

// Application State
let cart = [];
let selectedCategory = "all";
let selectedGender = "all";
let currentSort = "default";

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Modal Elements
const shippingOverlay = document.getElementById('shippingOverlay');
const paymentOverlay = document.getElementById('paymentOverlay');
const successOverlay = document.getElementById('successOverlay');
const shippingForm = document.getElementById('shippingForm');
const orderSummary = document.getElementById('orderSummary');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  renderProducts();
  updateCartDisplay();
  addScrollAnimations();
});

function initializeApp() {
  // Load cart from memory (not localStorage as per restrictions)
  cart = [];
  updateCartDisplay();
}

function setupEventListeners() {
  // Gender Filter Buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedGender = this.dataset.gender;
      renderProducts();
    });
  });

  // Category Cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
      selectedCategory = this.dataset.category;
      renderProducts();
      // Scroll to products section
      document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Sort Dropdown
  document.getElementById('sortSelect').addEventListener('change', function() {
    currentSort = this.value;
    renderProducts();
  });

  // Cart Toggle
  document.getElementById('cartToggle').addEventListener('click', toggleCart);
  document.getElementById('cartClose').addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);

  // Checkout Button
  checkoutBtn.addEventListener('click', openShippingModal);

  // Shipping Form
  shippingForm.addEventListener('submit', handleShippingSubmit);

  // Modal Close Buttons
  document.getElementById('shippingClose').addEventListener('click', closeShippingModal);
  document.getElementById('paymentClose').addEventListener('click', closePaymentModal);
  document.getElementById('placeOrderBtn').addEventListener('click', placeOrder);
  document.getElementById('continueBtn').addEventListener('click', closeSuccessModal);

  // Mobile Menu Toggle (future implementation)
  document.getElementById('mobileToggle').addEventListener('click', function() {
    // Mobile menu functionality can be added here
    console.log('Mobile menu clicked');
  });
}

function renderProducts() {
  const container = productGrid;
  container.innerHTML = '';

  let filteredProducts = products.filter(product => {
    const genderMatch = selectedGender === 'all' || product.gender === selectedGender;
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    return genderMatch && categoryMatch;
  });

  // Sort products
  switch(currentSort) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // Keep original order
      break;
  }

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="grid-column: 1 / -1; padding: 60px 20px;">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 20px;"></i>
        <p style="color: var(--text-light); font-size: 1.1rem;">No products found matching your criteria</p>
      </div>
    `;
    return;
  }

  filteredProducts.forEach((product, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card fade-in';
    productCard.style.animationDelay = `${index * 0.1}s`;
    
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          ₹${product.price.toLocaleString()}
          ${product.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-light); font-size: 0.9rem; margin-left: 8px;">₹${product.originalPrice.toLocaleString()}</span>` : ''}
          ${discount > 0 ? `<span style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; margin-left: 8px;">${discount}% OFF</span>` : ''}
        </div>
        <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 20px;">${product.description}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
          <i class="fas fa-shopping-cart"></i>
          Add to Cart
        </button>
      </div>
    `;
    
    container.appendChild(productCard);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    cart.push({ ...product, cartId: Date.now() + Math.random() });
    updateCartDisplay();
    showNotification('Product added to cart!');
  }
}

function removeFromCart(cartId) {
  cart = cart.filter(item => item.cartId !== cartId);
  updateCartDisplay();
  showNotification('Product removed from cart!');
}

function updateCartDisplay() {
  // Update cart count
  cartCount.textContent = cart.length;
  cartCount.style.display = cart.length > 0 ? 'flex' : 'none';

  // Update cart total
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = total.toLocaleString();

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-bag"></i>
        <p>Your cart is empty</p>
      </div>
    `;
    checkoutBtn.disabled = true;
  } else {
    cartItems.innerHTML = '';
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.cartId})">
          <i class="fas fa-trash"></i>
        </button>
      `;
      cartItems.appendChild(cartItem);
    });
    checkoutBtn.disabled = false;
  }
}

function toggleCart() {
  cartSidebar.classList.toggle('active');
  cartOverlay.classList.toggle('active');
}

function openShippingModal() {
  if (cart.length === 0) {
    showNotification('Your cart is empty!');
    return;
  }
  shippingOverlay.classList.add('active');
  toggleCart(); // Close cart
}

function closeShippingModal() {
  shippingOverlay.classList.remove('active');
}

function handleShippingSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const shippingDetails = {
    name: document.getElementById('fullName').value,
    address: document.getElementById('address').value,
    contact: document.getElementById('contact').value,
    email: document.getElementById('email').value
  };

  // Store shipping details in memory
  window.shippingDetails = shippingDetails;
  
  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="loading"></span> Processing...';
  submitBtn.disabled = true;

  // Simulate processing delay
  setTimeout(() => {
    closeShippingModal();
    openPaymentModal();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 1000);
}

function openPaymentModal() {
  // Update order summary
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = 99;
  const tax = Math.round(total * 0.18);
  const finalTotal = total + shipping + tax;

  orderSummary.innerHTML = `
    <div class="summary-item">
      <span>Subtotal (${cart.length} items)</span>
      <span>₹${total.toLocaleString()}</span>
    </div>
    <div class="summary-item">
      <span>Shipping</span>
      <span>₹${shipping}</span>
    </div>
    <div class="summary-item">
      <span>Tax (18%)</span>
      <span>₹${tax.toLocaleString()}</span>
    </div>
    <div class="summary-item summary-total">
      <span>Total</span>
      <span>₹${finalTotal.toLocaleString()}</span>
    </div>
  `;

  paymentOverlay.classList.add('active');
}

function closePaymentModal() {
  paymentOverlay.classList.remove('active');
}

function placeOrder() {
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const originalText = placeOrderBtn.innerHTML;

  placeOrderBtn.innerHTML = '<span class="loading"></span> Processing Order...';
  placeOrderBtn.disabled = true;

  const order = {
    shipping: window.shippingDetails,
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    })),
    total: cart.reduce((sum, item) => sum + item.price, 0) + 99 + Math.round(cart.reduce((sum, item) => sum + item.price, 0) * 0.18),
    timestamp: new Date().toISOString()
  };

  fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        cart = [];
        updateCartDisplay();
        closePaymentModal();
        successOverlay.classList.add("active");
      } else {
        alert("Order failed: " + data.message);
      }
      placeOrderBtn.innerHTML = originalText;
      placeOrderBtn.disabled = false;
    })
    .catch(err => {
      alert("Something went wrong.");
      console.error(err);
      placeOrderBtn.innerHTML = originalText;
      placeOrderBtn.disabled = false;
    });
}

function closeSuccessModal() {
  successOverlay.classList.remove('active');
  // Reset filters
  selectedCategory = 'all';
  selectedGender = 'all';
  currentSort = 'default';
  document.querySelector('.filter-btn[data-gender="all"]').classList.add('active');
  document.querySelectorAll('.filter-btn:not([data-gender="all"])').forEach(btn => btn.classList.remove('active'));
  document.getElementById('sortSelect').value = 'default';
  renderProducts();
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--primary-color);
    color: var(--secondary-color);
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 1003;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-weight: 500;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Hide notification
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function addScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  });

  // Observe category cards and product cards
  document.querySelectorAll('.category-card, .product-card').forEach(el => {
    observer.observe(el);
  });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = 'var(--shadow-md)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = 'none';
  }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (shippingOverlay.classList.contains('active')) {
      closeShippingModal();
    } else if (paymentOverlay.classList.contains('active')) {
      closePaymentModal();
    } else if (successOverlay.classList.contains('active')) {
      closeSuccessModal();
    } else if (cartSidebar.classList.contains('active')) {
      toggleCart();
    }
  }
});