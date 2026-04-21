document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const body = document.body;
        const icon = themeToggle.querySelector('i');
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            icon.classList.replace('fa-moon', 'fa-sun');
        }
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            if (body.classList.contains('dark-theme')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 2. Comprehensive Product Data (from simba_products.json)
    const allProducts = [
        { id: 13001, name: "Lentz Radiant Heater 80036", price: 83600, category: "Cosmetics & Personal Care", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507692/simba_contest/product_13001.jpg", discount: "-10%" },
        { id: 13002, name: "Simba SS Icecream Scoop", price: 3000, category: "Cosmetics & Personal Care", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507692/simba_contest/product_13002.jpg" },
        { id: 13003, name: "Simba SS Shovel", price: 3000, category: "Cosmetics & Personal Care", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507692/simba_contest/product_13003.jpg" },
        { id: 15001, name: "Plastic Massage Roller", price: 8136, category: "Sports & Wellness", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507692/simba_contest/product_15001.jpg", discount: "-15%" },
        { id: 16001, name: "RC Plane Aviation", price: 15500, category: "Baby Products", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507693/simba_contest/product_16001.jpg" },
        { id: 16002, name: "Building Blocks 1110", price: 14800, category: "Baby Products", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507693/simba_contest/product_16002.jpg" },
        { id: 16003, name: "Drawing Board Art", price: 12600, category: "Baby Products", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507693/simba_contest/product_16003.jpg" },
        { id: 16004, name: "Jump Rope GH315", price: 2500, category: "Baby Products", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507693/simba_contest/product_16004.jpg" },
        { id: 17001, name: "Classic Wall Clock", price: 5000, category: "Household Items", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507693/simba_contest/product_16001.jpg" }, // Reuse image for simulation
        { id: 17002, name: "Stainless Steel Fork Set", price: 12000, category: "Household Items", image: "https://res.cloudinary.com/eskalate/image/upload/v1776507692/simba_contest/product_13002.jpg" }
    ];

    // 3. Helper: Render Products
    const renderProducts = (container, products) => {
        if (!container) return;
        container.innerHTML = '';
        if (products.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found.</p>';
            return;
        }
        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${p.image}" alt="${p.name}">
                    ${p.discount ? `<span class="discount">${p.discount}</span>` : ''}
                </div>
                <div class="product-info">
                    <h4>${p.name}</h4>
                    <div class="price"><span class="current-price">${p.price.toLocaleString()} RWF</span></div>
                    <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
                </div>
            `;
            container.appendChild(card);
        });
    };

    // 4. Cart Logic
    let cart = JSON.parse(localStorage.getItem('simbaCart')) || [];
    const updateBadge = () => {
        const cartBadge = document.querySelector('.badge');
        if (cartBadge) {
            const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
            cartBadge.textContent = totalCount;
        }
    };
    updateBadge();

    // 5. Page-Specific Logic
    const currentPath = window.location.pathname;

    // Home Page
    const homeProductList = document.getElementById('product-list');
    if (homeProductList) renderProducts(homeProductList, allProducts.slice(0, 8));

    // Category & Search Logic
    const categoryProductList = document.getElementById('category-product-list');
    if (categoryProductList) {
        const urlParams = new URLSearchParams(window.location.search);
        const cat = urlParams.get('cat');
        const query = urlParams.get('q');
        
        let filtered = allProducts;
        if (cat) {
            filtered = allProducts.filter(p => p.category.toLowerCase().includes(cat.toLowerCase()));
            document.getElementById('category-title').textContent = cat;
        }
        if (query) {
            filtered = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()));
            document.getElementById('category-title').textContent = `Search: "${query}"`;
        }
        renderProducts(categoryProductList, filtered);
    }

    // Search Engine Implementation
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
    searchInputs.forEach(input => {
        const btn = input.nextElementSibling;
        const handleSearch = () => {
            const q = input.value.trim();
            if (q) window.location.href = `category.html?q=${encodeURIComponent(q)}`;
        };
        if (btn && btn.tagName === 'BUTTON') btn.addEventListener('click', handleSearch);
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });
    });

    // Add to Cart
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.dataset.id);
            const product = allProducts.find(p => p.id === id);
            const existing = cart.find(item => item.id === id);
            
            if (existing) existing.quantity++;
            else cart.push({ ...product, quantity: 1 });
            
            localStorage.setItem('simbaCart', JSON.stringify(cart));
            updateBadge();
            
            const originalText = e.target.textContent;
            e.target.textContent = 'Added!';
            e.target.style.backgroundColor = '#FF8C00';
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.backgroundColor = '';
            }, 1000);
        }
    });

    // Cart Page Rendering
    const cartItemsList = document.getElementById('cart-items');
    if (cartItemsList) {
        const renderCart = () => {
            cartItemsList.innerHTML = '';
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
                document.getElementById('cart-subtotal').textContent = '0 RWF';
                document.getElementById('cart-total').textContent = '1,000 RWF';
                return;
            }
            
            let subtotal = 0;
            cart.forEach((item, index) => {
                subtotal += item.price * item.quantity;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString()} RWF</p>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                `;
                cartItemsList.appendChild(itemDiv);
            });
            
            document.getElementById('cart-subtotal').textContent = `${subtotal.toLocaleString()} RWF`;
            document.getElementById('cart-total').textContent = `${(subtotal + 1000).toLocaleString()} RWF`;
        };
        renderCart();

        cartItemsList.addEventListener('click', (e) => {
            const index = e.target.closest('button')?.dataset.index;
            if (index === undefined) return;
            
            if (e.target.closest('.plus')) cart[index].quantity++;
            else if (e.target.closest('.minus')) {
                if (cart[index].quantity > 1) cart[index].quantity--;
            }
            else if (e.target.closest('.remove-btn')) cart.splice(index, 1);
            
            localStorage.setItem('simbaCart', JSON.stringify(cart));
            renderCart();
            updateBadge();
        });
    }

    // Countdown Timer (Home only)
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        const updateCountdown = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59);
            const diff = endOfDay - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            countdownEl.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        };
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }
});
