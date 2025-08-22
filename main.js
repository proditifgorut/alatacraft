import { faker } from '@faker-js/faker';

// Application State
const state = {
    user: null,
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    products: [],
    categories: [],
    currentFilter: 'all',
    isLoading: true
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        checkLoginStatus();
        generateMockData();
        initializeEventListeners();
        renderCategories();
        renderProducts();
        updateCartUI();
        hideLoading();
        initializeScrollAnimations();
    } catch (error) {
        console.error('Error initializing app:', error);
        hideLoading();
    }
}

function checkLoginStatus() {
    const userJson = localStorage.getItem('loggedInUser');
    if (userJson) {
        state.user = JSON.parse(userJson);
    }
    updateAuthUI();
}


function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('opacity-0');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 300);
    }
}

function generateMockData() {
    // Generate categories
    const categoryNames = ['Keranjang', 'Dekorasi', 'Furniture', 'Aksesoris', 'Perlengkapan Rumah'];
    const categoryImages = [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544967882-d2d6b2f6e18a?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1566501206188-5dd0cf160a0e?w=400&h=300&fit=crop'
    ];

    state.categories = categoryNames.map((name, index) => ({
        id: index + 1,
        name,
        slug: name.toLowerCase(),
        image: categoryImages[index],
        productCount: faker.number.int({ min: 15, max: 45 })
    }));

    // Generate products
    const productCategories = ['keranjang', 'dekorasi', 'furniture', 'aksesoris', 'perlengkapan rumah'];
    const productImages = [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544967882-d2d6b2f6e18a?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1566501206188-5dd0cf160a0e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop'
    ];

    state.products = Array.from({ length: 32 }, (_, index) => {
        const category = faker.helpers.arrayElement(productCategories);
        return {
            id: index + 1,
            name: generateProductName(category),
            description: generateProductDescription(),
            price: faker.number.int({ min: 50000, max: 500000 }),
            originalPrice: faker.number.int({ min: 60000, max: 600000 }),
            image: faker.helpers.arrayElement(productImages),
            images: Array.from({ length: 3 }, () => faker.helpers.arrayElement(productImages)),
            category,
            seller: {
                name: faker.person.fullName(),
                location: faker.location.city() + ', Indonesia',
                rating: faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }),
                totalSales: faker.number.int({ min: 10, max: 500 })
            },
            rating: faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }),
            reviews: faker.number.int({ min: 5, max: 100 }),
            stock: faker.number.int({ min: 1, max: 50 }),
            sold: faker.number.int({ min: 0, max: 200 }),
            isNew: faker.datatype.boolean(0.3),
            isFeatured: faker.datatype.boolean(0.4),
            discount: faker.datatype.boolean(0.5) ? faker.number.int({ min: 10, max: 40 }) : 0
        };
    });
}

function generateProductName(category) {
    const names = {
        keranjang: ['Keranjang Eceng Gondok', 'Keranjang Anyaman', 'Keranjang Serbaguna', 'Keranjang Tradisional'],
        dekorasi: ['Hiasan Dinding Eceng', 'Pot Bunga Anyaman', 'Lampion Eceng Gondok', 'Ornamen Tradisional'],
        furniture: ['Kursi Anyaman Eceng', 'Meja Eceng Gondok', 'Rak Buku Anyaman', 'Sofa Eceng Tradisional'],
        aksesoris: ['Tas Anyaman Eceng', 'Dompet Eceng Gondok', 'Gelang Anyaman', 'Kalung Tradisional'],
        'perlengkapan rumah': ['Tempat Sampah Eceng', 'Rak Piring Anyaman', 'Tempat Tisu Eceng', 'Kotak Penyimpanan']
    };
    
    return faker.helpers.arrayElement(names[category] || names.keranjang);
}

function generateProductDescription() {
    const descriptions = [
        'Kerajinan tangan eceng gondok berkualitas tinggi dengan desain tradisional Indonesia. Ramah lingkungan dan tahan lama.',
        'Produk anyaman eceng gondok asli dari pengrajin lokal. Dibuat dengan teknik tradisional turun temurun.',
        'Kerajinan eceng gondok premium dengan finishing yang halus dan detail yang sempurna. Cocok untuk dekorasi rumah modern.',
        'Anyaman eceng gondok berkualitas export dengan bahan pilihan. Proses pembuatan menggunakan metode tradisional.',
        'Produk kerajinan eceng gondok unik dan artistik. Menggabungkan nilai budaya dengan fungsi praktis.'
    ];
    
    return faker.helpers.arrayElement(descriptions);
}

function initializeEventListeners() {
    // Navigation
    document.getElementById('mobileMenuBtn')?.addEventListener('click', toggleMobileMenu);
    
    // Search
    document.getElementById('searchInput')?.addEventListener('input', handleSearch);
    
    // Cart
    document.getElementById('cartBtn')?.addEventListener('click', showCart);
    
    // Product filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => filterProducts(e.target.dataset.filter));
    });
    
    // Load more products
    document.getElementById('loadMoreBtn')?.addEventListener('click', loadMoreProducts);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (query.length > 2) {
        const filteredProducts = state.products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        renderProducts(filteredProducts);
    } else if (query.length === 0) {
        renderProducts();
    }
}

function renderCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    const html = state.categories.map(category => `
        <div class="group cursor-pointer" onclick="filterProducts('${category.slug}')">
            <div class="relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div class="aspect-w-16 aspect-h-12 overflow-hidden">
                    <img src="${category.image}" alt="${category.name}" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105">
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        ${category.name}
                    </h3>
                    <p class="text-gray-600 text-sm">
                        ${category.productCount} produk tersedia
                    </p>
                </div>
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        </div>
    `).join('');

    categoriesGrid.innerHTML = html;
}

function renderProducts(products = null) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const productsToRender = products || state.products.slice(0, 12);
    
    const html = productsToRender.map(product => `
        <div class="group cursor-pointer" onclick="showProductDetail(${product.id})">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105">
                    
                    ${product.discount > 0 ? `
                        <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            -${product.discount}%
                        </div>
                    ` : ''}
                    
                    ${product.isNew ? `
                        <div class="absolute top-3 right-3 bg-primary-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            Baru
                        </div>
                    ` : ''}
                    
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button class="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform" onclick="event.stopPropagation(); addToCart(${product.id})">
                            Tambah ke Keranjang
                        </button>
                    </div>
                </div>
                
                <div class="p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-primary-600 font-medium uppercase tracking-wide">${product.category}</span>
                        <div class="flex items-center space-x-1">
                            <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L0 6.91l6.564-.955L10 0l3.436 5.955L20 6.91l-5.245 4.635L15.878 18z"/>
                            </svg>
                            <span class="text-sm text-gray-600">${product.rating}</span>
                            <span class="text-sm text-gray-400">(${product.reviews})</span>
                        </div>
                    </div>
                    
                    <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        ${product.name}
                    </h3>
                    
                    <div class="flex items-center space-x-2 mb-3">
                        <span class="text-lg font-bold text-gray-900">
                            Rp ${formatPrice(product.price)}
                        </span>
                        ${product.originalPrice > product.price ? `
                            <span class="text-sm text-gray-500 line-through">
                                Rp ${formatPrice(product.originalPrice)}
                            </span>
                        ` : ''}
                    </div>
                    
                    <div class="flex items-center justify-between text-sm text-gray-600">
                        <span>${product.seller.location}</span>
                        <span>${product.sold} terjual</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    productsGrid.innerHTML = html;
}

function filterProducts(filter) {
    state.currentFilter = filter;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    // Filter products
    let filteredProducts = state.products;
    if (filter !== 'all') {
        filteredProducts = state.products.filter(product => product.category === filter);
    }
    
    renderProducts(filteredProducts.slice(0, 12));
}

function loadMoreProducts() {
    // This would typically load more products from an API
    // For now, we'll just show all products
    renderProducts(state.products);
    document.getElementById('loadMoreBtn').style.display = 'none';
}

function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = state.cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            productId,
            quantity: 1,
            price: product.price
        });
    }

    localStorage.setItem('cart', JSON.stringify(state.cart));
    updateCartUI();
    showToast('Produk ditambahkan ke keranjang!');
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(state.cart));
    updateCartUI();
    showCart(); // Refresh cart modal
}

function updateCartQuantity(productId, quantity) {
    const item = state.cart.find(item => item.productId === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(state.cart));
            updateCartUI();
            showCart(); // Refresh cart modal
        }
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function showCart() {
    const cartItems = state.cart.map(item => {
        const product = state.products.find(p => p.id === item.productId);
        return { ...item, product };
    });

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const modal = `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick="closeModal()">
            <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-xl font-bold text-gray-900">Keranjang Belanja</h2>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="p-6 max-h-96 overflow-y-auto">
                    ${cartItems.length === 0 ? `
                        <div class="text-center py-12">
                            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8M7 13v8a2 2 0 002 2h7a2 2 0 002-2v-8m-9 0V9a2 2 0 012-2h5a2 2 0 012 2v4"></path>
                            </svg>
                            <p class="text-gray-500 mb-4">Keranjang Anda masih kosong</p>
                            <button class="btn-primary" onclick="closeModal(); scrollToSection('products')">Mulai Belanja</button>
                        </div>
                    ` : `
                        <div class="space-y-4">
                            ${cartItems.map(item => `
                                <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                    <img src="${item.product.image}" alt="${item.product.name}" class="w-16 h-16 object-cover rounded-lg">
                                    <div class="flex-1">
                                        <h4 class="font-medium text-gray-900">${item.product.name}</h4>
                                        <p class="text-sm text-gray-600">${item.product.seller.location}</p>
                                        <p class="text-lg font-bold text-primary-600">Rp ${formatPrice(item.price)}</p>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <button onclick="updateCartQuantity(${item.productId}, ${item.quantity - 1})" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                                            </svg>
                                        </button>
                                        <span class="w-8 text-center font-medium">${item.quantity}</span>
                                        <button onclick="updateCartQuantity(${item.productId}, ${item.quantity + 1})" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <button onclick="removeFromCart(${item.productId})" class="text-red-500 hover:text-red-700">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="mt-6 pt-6 border-t border-gray-200">
                            <div class="flex items-center justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span class="text-primary-600">Rp ${formatPrice(total)}</span>
                            </div>
                        </div>
                    `}
                </div>
                
                ${cartItems.length > 0 ? `
                    <div class="p-6 border-t border-gray-200 flex space-x-4">
                        <button class="flex-1 btn-secondary" onclick="closeModal()">Lanjut Belanja</button>
                        <button class="flex-1 btn-primary" onclick="showCheckout()">Checkout</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    showModal(modal);
}

function showProductDetail(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const modal = `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick="closeModal()">
            <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-xl font-bold text-gray-900">Detail Produk</h2>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <img src="${product.image}" alt="${product.name}" class="w-full h-80 object-cover rounded-xl mb-4">
                            <div class="grid grid-cols-3 gap-2">
                                ${product.images.map(img => `
                                    <img src="${img}" alt="${product.name}" class="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75">
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="space-y-6">
                            <div>
                                <span class="text-sm text-primary-600 font-medium uppercase tracking-wide">${product.category}</span>
                                <h1 class="text-2xl font-bold text-gray-900 mt-2">${product.name}</h1>
                                <div class="flex items-center space-x-2 mt-2">
                                    <div class="flex items-center">
                                        ${Array.from({ length: 5 }, (_, i) => `
                                            <svg class="w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L0 6.91l6.564-.955L10 0l3.436 5.955L20 6.91l-5.245 4.635L15.878 18z"/>
                                            </svg>
                                        `).join('')}
                                    </div>
                                    <span class="text-sm text-gray-600">${product.rating} (${product.reviews} ulasan)</span>
                                </div>
                            </div>
                            
                            <div class="space-y-2">
                                <div class="flex items-center space-x-3">
                                    <span class="text-3xl font-bold text-gray-900">Rp ${formatPrice(product.price)}</span>
                                    ${product.originalPrice > product.price ? `
                                        <span class="text-lg text-gray-500 line-through">Rp ${formatPrice(product.originalPrice)}</span>
                                        <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">-${product.discount}%</span>
                                    ` : ''}
                                </div>
                                <p class="text-green-600 text-sm">Stok tersedia: ${product.stock} unit</p>
                            </div>
                            
                            <div class="space-y-4">
                                <h3 class="font-semibold text-gray-900">Deskripsi</h3>
                                <p class="text-gray-600 leading-relaxed">${product.description}</p>
                            </div>
                            
                            <div class="space-y-4">
                                <h3 class="font-semibold text-gray-900">Informasi Penjual</h3>
                                <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span class="text-primary-600 font-semibold">${product.seller.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h4 class="font-medium text-gray-900">${product.seller.name}</h4>
                                        <p class="text-sm text-gray-600">${product.seller.location}</p>
                                        <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                            <span>Rating: ${product.seller.rating}</span>
                                            <span>•</span>
                                            <span>${product.seller.totalSales} penjualan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex space-x-4 pt-6">
                                <button class="flex-1 btn-secondary" onclick="closeModal()">Batal</button>
                                <button class="flex-1 btn-primary" onclick="addToCart(${product.id}); closeModal()">Tambah ke Keranjang</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    showModal(modal);
}

function showCheckout() {
    const cartItems = state.cart.map(item => {
        const product = state.products.find(p => p.id === item.productId);
        return { ...item, product };
    });

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15000;
    const total = subtotal + shipping;

    const modal = `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick="closeModal()">
            <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onclick="event.stopPropagation()">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-xl font-bold text-gray-900">Checkout</h2>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Alamat Pengiriman</h3>
                                <div class="space-y-4">
                                    <input type="text" placeholder="Nama Lengkap" class="input-field">
                                    <input type="text" placeholder="Nomor Telepon" class="input-field">
                                    <textarea placeholder="Alamat Lengkap" rows="3" class="input-field"></textarea>
                                    <div class="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="Kota" class="input-field">
                                        <input type="text" placeholder="Kode Pos" class="input-field">
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Metode Pembayaran</h3>
                                <div class="space-y-3">
                                    <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment" value="qris" class="text-primary-600">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium">QRIS</span>
                                        </div>
                                    </label>
                                    
                                    <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment" value="transfer" class="text-primary-600">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8-2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium">Transfer Bank</span>
                                        </div>
                                    </label>
                                    
                                    <label class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="payment" value="ewallet" class="text-primary-600">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                                                <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium">E-Wallet</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>
                                <div class="space-y-3">
                                    ${cartItems.map(item => `
                                        <div class="flex items-center justify-between text-sm">
                                            <div class="flex items-center space-x-3">
                                                <img src="${item.product.image}" alt="${item.product.name}" class="w-10 h-10 object-cover rounded">
                                                <div>
                                                    <p class="font-medium text-gray-900">${item.product.name}</p>
                                                    <p class="text-gray-600">${item.quantity}x</p>
                                                </div>
                                            </div>
                                            <span class="font-medium">Rp ${formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="border-t border-gray-200 pt-4 space-y-2">
                                <div class="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>Rp ${formatPrice(subtotal)}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span>Ongkos Kirim</span>
                                    <span>Rp ${formatPrice(shipping)}</span>
                                </div>
                                <div class="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                                    <span>Total</span>
                                    <span class="text-primary-600">Rp ${formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="p-6 border-t border-gray-200 flex space-x-4">
                    <button class="flex-1 btn-secondary" onclick="showCart()">Kembali</button>
                    <button class="flex-1 btn-primary" onclick="processPayment()">Bayar Sekarang</button>
                </div>
            </div>
        </div>
    `;

    showModal(modal);
}

function processPayment() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        showToast('Silakan pilih metode pembayaran', 'error');
        return;
    }

    // Simulate payment processing
    showToast('Sedang memproses pembayaran...', 'info');
    
    setTimeout(() => {
        if (selectedPayment.value === 'qris') {
            showQRISPayment();
        } else {
            showPaymentSuccess();
        }
    }, 2000);
}

function showQRISPayment() {
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 15000;
    
    const modal = `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick="closeModal()">
            <div class="bg-white rounded-xl max-w-md w-full" onclick="event.stopPropagation()">
                <div class="p-6 text-center">
                    <h2 class="text-xl font-bold text-gray-900 mb-6">Pembayaran QRIS</h2>
                    
                    <div class="bg-gray-100 p-6 rounded-xl mb-6">
                        <div class="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                            <div class="text-center">
                                <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                                </svg>
                                <p class="text-sm text-gray-600">QR Code QRIS</p>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 mb-2">Total Pembayaran</p>
                        <p class="text-2xl font-bold text-primary-600">Rp ${formatPrice(total)}</p>
                    </div>
                    
                    <div class="text-left space-y-2 text-sm text-gray-600 mb-6">
                        <p>• Scan QR code dengan aplikasi e-wallet Anda</p>
                        <p>• Pastikan nominal sesuai dengan yang tertera</p>
                        <p>• Pembayaran akan diverifikasi otomatis</p>
                    </div>
                    
                    <div class="flex space-x-4">
                        <button class="flex-1 btn-secondary" onclick="closeModal()">Batal</button>
                        <button class="flex-1 btn-primary" onclick="showPaymentSuccess()">Sudah Bayar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    showModal(modal);
}

function showPaymentSuccess() {
    // Clear cart
    state.cart = [];
    localStorage.setItem('cart', JSON.stringify(state.cart));
    updateCartUI();

    const modal = `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick="closeModal()">
            <div class="bg-white rounded-xl max-w-md w-full" onclick="event.stopPropagation()">
                <div class="p-6 text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    
                    <h2 class="text-xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h2>
                    <p class="text-gray-600 mb-6">Terima kasih atas pembelian Anda. Pesanan sedang diproses dan akan segera dikirim.</p>
                    
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <p class="text-sm text-gray-600 mb-2">Nomor Pesanan</p>
                        <p class="font-mono font-bold text-lg">#NE${Date.now().toString().slice(-6)}</p>
                    </div>
                    
                    <button class="w-full btn-primary" onclick="closeModal()">Kembali ke Beranda</button>
                </div>
            </div>
        </div>
    `;

    showModal(modal);
}

function updateAuthUI() {
    const authButtonsContainer = document.getElementById('auth-buttons');
    const mobileAuthButtonsContainer = document.getElementById('mobile-auth-buttons');
    
    let desktopButtonsHTML = '';
    let mobileButtonsHTML = '';

    if (state.user) {
        desktopButtonsHTML = `
            <a href="/dashboard.html" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">Dashboard</a>
            <button id="logout-btn-nav" class="btn-secondary">Keluar</button>
        `;
        mobileButtonsHTML = `
            <a href="/dashboard.html" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">Dashboard</a>
            <button id="logout-btn-mobile" class="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50">Keluar</button>
        `;
    } else {
        desktopButtonsHTML = `
            <a href="/login.html" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">Masuk</a>
            <a href="/login.html?action=register" class="btn-primary">Daftar</a>
        `;
        mobileButtonsHTML = `
            <a href="/login.html" class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600">Masuk</a>
            <a href="/login.html?action=register" class="block w-full text-left px-3 py-2 text-base font-medium btn-primary mt-2">Daftar</a>
        `;
    }

    authButtonsContainer.innerHTML = desktopButtonsHTML;
    mobileAuthButtonsContainer.innerHTML = mobileButtonsHTML;

    if (state.user) {
        document.getElementById('logout-btn-nav')?.addEventListener('click', logout);
        document.getElementById('logout-btn-mobile')?.addEventListener('click', logout);
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    state.user = null;
    updateAuthUI();
    showToast('Anda telah keluar.', 'info');
}

function showModal(html) {
    const modalsContainer = document.getElementById('modals');
    modalsContainer.innerHTML = html;
}

function closeModal() {
    const modalsContainer = document.getElementById('modals');
    modalsContainer.innerHTML = '';
}

function showToast(message, type = 'success') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function initializeScrollAnimations() {
    // Add scroll-based navbar styling
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-xl');
        } else {
            navbar.classList.remove('shadow-xl');
        }
    });

    // Update active navigation links
    const sections = ['home', 'categories', 'products', 'about'];
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = sectionId;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-gray-900');
            link.classList.add('text-gray-500');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.remove('text-gray-500');
                link.classList.add('text-gray-900');
            }
        });
    });
}

// Add custom styles for filter buttons
const style = document.createElement('style');
style.textContent = `
    .filter-btn {
        @apply px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:text-primary-600 hover:border-primary-300 transition-colors duration-200;
    }
    
    .filter-btn.active {
        @apply bg-primary-600 text-white border-primary-600;
    }
    
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Expose functions to global scope for inline event handlers
window.closeModal = closeModal;
window.showProductDetail = showProductDetail;
window.addToCart = addToCart;
window.showCart = showCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.showCheckout = showCheckout;
window.processPayment = processPayment;
window.showQRISPayment = showQRISPayment;
window.showPaymentSuccess = showPaymentSuccess;
window.scrollToSection = scrollToSection;
window.filterProducts = filterProducts;
