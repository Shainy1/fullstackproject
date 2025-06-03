// Sample data for restaurants
const restaurants = [
    {
        id: 1,
        name: "Spice Garden",
        image: "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        rating: 4.5,
        cuisine: "Indian",
        location: "Downtown",
        deliveryTime: "30-40 min",
        priceForTwo: "$20"
    },
    {
        id: 2,
        name: "Pasta Paradise",
        image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        rating: 4.3,
        cuisine: "Italian",
        location: "Westside",
        deliveryTime: "25-35 min",
        priceForTwo: "$25"
    },
    {
        id: 3,
        name: "Sushi Master",
        image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        rating: 4.7,
        cuisine: "Japanese",
        location: "Eastside",
        deliveryTime: "35-45 min",
        priceForTwo: "$30"
    }
];

// User preferences and order history
let userPreferences = {
    orderHistory: [],
    preferences: {
        categories: [],
        tags: [],
        cuisineTypes: []
    }
};

// Food tags and categories
const foodTags = ['spicy', 'vegetarian', 'dessert', 'healthy', 'quick', 'popular'];
const cuisineTypes = ['Indian', 'Italian', 'Chinese', 'Japanese', 'Mexican', 'American'];

// Extended menu items with tags and cuisine
const menuItems = [
    {
        id: 1,
        name: "Butter Chicken",
        description: "Tender chicken in a rich, creamy tomato-based curry sauce",
        price: 12.99,
        image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Main Course",
        tags: ['spicy', 'popular'],
        cuisine: 'Indian'
    },
    {
        id: 2,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        price: 10.99,
        image: "https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Main Course",
        tags: ['vegetarian', 'popular'],
        cuisine: 'Italian'
    },
    {
        id: 3,
        name: "California Roll",
        description: "Crab, avocado, and cucumber wrapped in rice and seaweed",
        price: 8.99,
        image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Starters",
        tags: ['healthy'],
        cuisine: 'Japanese'
    },
    {
        id: 4,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
        price: 7.99,
        image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Desserts",
        tags: ['dessert', 'popular'],
        cuisine: 'American'
    },
    {
        id: 5,
        name: "Vegetable Biryani",
        description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices",
        price: 11.99,
        image: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        category: "Main Course",
        tags: ['vegetarian', 'spicy'],
        cuisine: 'Indian'
    }
];

// Sample data for categories
const categories = [
    {
        id: 1,
        name: "Pizza",
        image: "https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 2,
        name: "Burgers",
        image: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 3,
        name: "Sushi",
        image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
];

// Cart functionality
let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load user preferences from localStorage
    loadUserPreferences();
    
    // Load content based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        loadHomePage();
    } else if (currentPage === 'restaurants.html') {
        loadRestaurantsPage();
    } else if (currentPage === 'menu.html') {
        loadMenuPage();
    }

    // Initialize cart functionality
    initializeCart();
});

// Load user preferences from localStorage
function loadUserPreferences() {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
        userPreferences = JSON.parse(savedPreferences);
    }
}

// Save user preferences to localStorage
function saveUserPreferences() {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
}

// Update user preferences when adding to cart
function updateUserPreferences(item) {
    // Add to order history
    userPreferences.orderHistory.push({
        itemId: item.id,
        timestamp: new Date().toISOString()
    });

    // Update preferences based on item tags and cuisine
    if (item.tags) {
        item.tags.forEach(tag => {
            if (!userPreferences.preferences.tags.includes(tag)) {
                userPreferences.preferences.tags.push(tag);
            }
        });
    }

    if (item.cuisine && !userPreferences.preferences.cuisineTypes.includes(item.cuisine)) {
        userPreferences.preferences.cuisineTypes.push(item.cuisine);
    }

    if (item.category && !userPreferences.preferences.categories.includes(item.category)) {
        userPreferences.preferences.categories.push(item.category);
    }

    // Save updated preferences
    saveUserPreferences();
}

// Get personalized recommendations
function getRecommendations() {
    const recommendations = [];
    const userTags = userPreferences.preferences.tags;
    const userCuisines = userPreferences.preferences.cuisineTypes;
    const userCategories = userPreferences.preferences.categories;

    // Score each menu item based on user preferences
    const scoredItems = menuItems.map(item => {
        let score = 0;

        // Score based on tags
        if (item.tags) {
            item.tags.forEach(tag => {
                if (userTags.includes(tag)) score += 2;
            });
        }

        // Score based on cuisine
        if (userCuisines.includes(item.cuisine)) score += 3;

        // Score based on category
        if (userCategories.includes(item.category)) score += 2;

        return { ...item, score };
    });

    // Sort by score and get top 3 recommendations
    return scoredItems
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

// Create recommendation card
function createRecommendationCard(item) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    
    // Get matching preferences for tooltip
    const matchingPreferences = [];
    if (item.tags) {
        item.tags.forEach(tag => {
            if (userPreferences.preferences.tags.includes(tag)) {
                matchingPreferences.push(tag);
            }
        });
    }
    
    const tooltipText = matchingPreferences.length > 0 
        ? `You might like this! Matches your preferences: ${matchingPreferences.join(', ')}`
        : 'Popular in your area';

    card.innerHTML = `
        <div class="food-card card" data-bs-toggle="tooltip" data-bs-placement="top" title="${tooltipText}">
            <div class="position-relative">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                ${matchingPreferences.length > 0 ? 
                    '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Recommended</span>' : 
                    '<span class="badge bg-primary position-absolute top-0 end-0 m-2">Popular</span>'}
            </div>
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="btn btn-danger" onclick="addToCart(${item.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Load home page content
function loadHomePage() {
    // Load popular restaurants
    const popularRestaurantsContainer = document.getElementById('popular-restaurants');
    if (popularRestaurantsContainer) {
        restaurants.forEach(restaurant => {
            const restaurantCard = createRestaurantCard(restaurant);
            popularRestaurantsContainer.appendChild(restaurantCard);
        });
    }

    // Load top categories
    const topCategoriesContainer = document.getElementById('top-categories');
    if (topCategoriesContainer) {
        categories.forEach(category => {
            const categoryCard = createCategoryCard(category);
            topCategoriesContainer.appendChild(categoryCard);
        });
    }

    // Load trending foods
    const trendingFoodsContainer = document.getElementById('trending-foods');
    if (trendingFoodsContainer) {
        menuItems.forEach(item => {
            const foodCard = createFoodCard(item);
            trendingFoodsContainer.appendChild(foodCard);
        });
    }

    // Load recommendations
    const recommendationsContainer = document.getElementById('recommendations');
    if (recommendationsContainer) {
        const recommendations = getRecommendations();
        recommendations.forEach(item => {
            const recommendationCard = createRecommendationCard(item);
            recommendationsContainer.appendChild(recommendationCard);
        });

        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Load restaurants page content
function loadRestaurantsPage() {
    const restaurantsContainer = document.getElementById('restaurants-container');
    if (restaurantsContainer) {
        restaurants.forEach(restaurant => {
            const restaurantCard = createRestaurantCard(restaurant);
            restaurantsContainer.appendChild(restaurantCard);
        });
    }
}

// Load menu page content
function loadMenuPage() {
    const menuItemsContainer = document.getElementById('menu-items-container');
    if (menuItemsContainer) {
        menuItems.forEach(item => {
            const menuItemCard = createMenuItemCard(item);
            menuItemsContainer.appendChild(menuItemCard);
        });
    }
}

// Create restaurant card
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
        <div class="restaurant-card card">
            <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
            <div class="card-body">
                <h5 class="card-title">${restaurant.name}</h5>
                <div class="rating mb-2">
                    <i class="fas fa-star"></i>
                    <span>${restaurant.rating}</span>
                </div>
                <p class="card-text">
                    <small class="text-muted">
                        ${restaurant.cuisine} • ${restaurant.location}<br>
                        ${restaurant.deliveryTime} • ${restaurant.priceForTwo} for two
                    </small>
                </p>
                <a href="menu.html?id=${restaurant.id}" class="btn btn-danger">View Menu</a>
            </div>
        </div>
    `;
    return card;
}

// Create category card
function createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
        <div class="category-card">
            <img src="${category.image}" alt="${category.name}">
            <h5>${category.name}</h5>
        </div>
    `;
    return card;
}

// Create food card
function createFoodCard(food) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
        <div class="food-card card">
            <img src="${food.image}" class="card-img-top" alt="${food.name}">
            <div class="card-body">
                <h5 class="card-title">${food.name}</h5>
                <p class="card-text">${food.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="price">$${food.price.toFixed(2)}</span>
                    <button class="btn btn-danger" onclick="addToCart(${food.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Create menu item card
function createMenuItemCard(item) {
    const card = document.createElement('div');
    card.className = 'col-md-6 mb-4';
    card.innerHTML = `
        <div class="food-card card">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="price">$${item.price.toFixed(2)}</span>
                            <button class="btn btn-danger" onclick="addToCart(${item.id})">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Initialize cart functionality
function initializeCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }

    // Add click event to cart link
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCart();
        });
    }
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
        const existingItem = cart.find(cartItem => cartItem.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }
        updateCart();
        updateUserPreferences(item);
        showToast('Item added to cart!');
    }
}

// Update cart
function updateCart() {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Update cart modal if it's open
    const cartModal = document.getElementById('cartModal');
    if (cartModal && cartModal.classList.contains('show')) {
        showCart();
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show cart modal
function showCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    
    if (cartItems && cartTotalAmount) {
        // Clear existing items
        cartItems.innerHTML = '';
        
        // Add cart items
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h6>${item.name}</h6>
                    <p class="text-muted">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalAmount.textContent = total.toFixed(2);
    }
    
    // Show modal
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity > 0) {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            updateCart();
        }
    } else {
        removeFromCart(itemId);
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Food Munch</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    document.body.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
} 