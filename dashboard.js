import { faker } from '@faker-js/faker';

// --- STATE & INITIALIZATION ---
const state = {
    user: null,
    currentPage: 'dashboard',
    users: [],
    products: [],
    orders: [],
    posCart: [],
};

document.addEventListener('DOMContentLoaded', () => {
    authenticate();
    if (state.user) {
        initializeApp();
    }
});

function authenticate() {
    const userJson = localStorage.getItem('loggedInUser');
    if (!userJson) {
        window.location.href = '/login.html';
        return;
    }
    state.user = JSON.parse(userJson);
}

function initializeApp() {
    generateMockData();
    setupUI();
    setupEventListeners();
    renderPage(state.currentPage);
}

function generateMockData() {
    // Mock users for admin view
    state.users = Array.from({ length: 15 }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(['pengrajin', 'pembeli']),
        joinDate: faker.date.past({ years: 2 }),
        status: faker.helpers.arrayElement(['Aktif', 'Nonaktif'])
    }));

    const ecengCraftImages = [
        'https://images.unsplash.com/photo-1589801258579-21c881ebb6ac?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1576722296633-5c74a3c3a4a7?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1618221313813-9d21626c7b13?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1561042138-89c5b8331a75?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1594735548698-76140543c8a7?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1605664041952-4a2855d966c2?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1552010099-5343844501a2?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1588789263210-db4c2c172e83?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1622484256447-1768b2184c8a?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1579586337278-35d19d18a531?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1611094454922-3e3c609b1d3c?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1621293299244-932f7b489b4e?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1542884748-2b87b36c3b9e?w=128&h=128&fit=crop',
        'https://images.unsplash.com/photo-1599493345842-c4e8f331649f?w=128&h=128&fit=crop'
    ];

    const productCategories = ['Keranjang', 'Dekorasi', 'Tas', 'Alas Makan', 'Topi'];
    const productNames = {
        Keranjang: ['Keranjang Eceng Bulat', 'Keranjang Anyaman Serbaguna'],
        Dekorasi: ['Hiasan Dinding Eceng Estetik', 'Pot Bunga Anyaman Gantung'],
        Tas: ['Tas Tote Anyaman Eceng', 'Tas Selempang Bulat'],
        'Alas Makan': ['Alas Piring Anyaman Rapi', 'Tatakan Gelas Eceng Gondok'],
        Topi: ['Topi Pantai Anyaman Lebar', 'Topi Fedora Eceng Gondok']
    };

    // Mock products for admin/pengrajin view
    state.products = Array.from({ length: 25 }, () => {
        const category = faker.helpers.arrayElement(productCategories);
        const name = faker.helpers.arrayElement(productNames[category]);
        return {
            id: faker.string.uuid(),
            name: name,
            category: category,
            price: faker.commerce.price({ min: 50000, max: 500000, dec: 0 }),
            stock: faker.number.int({ min: 0, max: 100 }),
            sold: faker.number.int({ min: 10, max: 200 }),
            image: faker.helpers.arrayElement(ecengCraftImages)
        };
    });
    
    // Mock orders for pengrajin view
    state.orders = Array.from({ length: 30 }, () => ({
        id: `#AC${faker.string.alphanumeric(6).toUpperCase()}`,
        customer: faker.person.fullName(),
        date: faker.date.recent({ days: 30 }),
        total: faker.commerce.price({ min: 100000, max: 1500000, dec: 0 }),
        status: faker.helpers.arrayElement(['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'])
    }));
}

// --- UI SETUP & RENDERING ---

function setupUI() {
    // Set user info
    document.getElementById('user-greeting').innerText = `Halo, ${state.user.name.split(' ')[0]}!`;
    document.getElementById('user-avatar').innerText = state.user.name.charAt(0).toUpperCase();

    // Render navigation based on role
    const navContainer = document.getElementById('sidebar-nav');
    const navItems = getNavItemsByRole(state.user.role);
    navContainer.innerHTML = navItems.map(item => `
        <a href="#" class="nav-item ${item.id === state.currentPage ? 'active' : ''}" data-page="${item.id}">
            ${item.icon}
            <span>${item.label}</span>
        </a>
    `).join('');
}

function setupEventListeners() {
    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = '/index.html';
    });
    
    // Sidebar navigation
    document.getElementById('sidebar-nav').addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            e.preventDefault();
            const pageId = navItem.dataset.page;
            renderPage(pageId);
        }
    });

    // Mobile menu toggle
    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('-translate-x-full');
    });
}

function renderPage(pageId) {
    state.currentPage = pageId;
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });

    const pageTitle = getNavItemsByRole(state.user.role).find(p => p.id === pageId)?.label || 'Dashboard';
    document.getElementById('page-title').innerText = pageTitle;

    const mainContent = document.getElementById('main-content');
    switch (pageId) {
        case 'dashboard':
            mainContent.innerHTML = renderDashboardSummary();
            break;
        case 'users':
            mainContent.innerHTML = renderUserManagement();
            break;
        case 'products':
            mainContent.innerHTML = renderProductManagement();
            break;
        case 'orders':
            mainContent.innerHTML = renderOrderManagement();
            break;
        case 'pos':
            mainContent.innerHTML = renderPOS();
            renderPOSProducts(state.products);
            renderPOSCart();
            attachPOSEventListeners();
            break;
        default:
            mainContent.innerHTML = `<div class="card"><p>Halaman tidak ditemukan.</p></div>`;
    }
}


// --- PAGE CONTENT RENDERERS ---

function renderDashboardSummary() {
    const isAdmin = state.user.role === 'admin';
    const stats = isAdmin ? getAdminStats() : getSellerStats();

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${stats.map(stat => `
                <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor} text-2xl">
                        ${stat.icon}
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">${stat.title}</p>
                        <p class="text-2xl font-bold text-gray-800">${stat.value}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h2 class="text-xl font-bold text-gray-800 mb-4">${isAdmin ? 'Aktivitas Terbaru' : 'Pesanan Terbaru'}</h2>
            <div class="overflow-x-auto">
                <!-- Chart or recent activity list can go here -->
                <p class="text-gray-600">Fitur grafik dan aktivitas akan segera hadir.</p>
            </div>
        </div>
    `;
}

function renderUserManagement() {
    return `
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Manajemen Pengguna</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b bg-gray-50">
                            <th class="p-3 text-sm font-semibold text-gray-600">Nama</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Role</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Tanggal Bergabung</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Status</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.users.map(user => `
                            <tr class="border-b hover:bg-gray-50">
                                <td class="p-3 flex items-center gap-3">
                                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">${user.name.charAt(0)}</div>
                                    <div>
                                        <p class="font-medium text-gray-800">${user.name}</p>
                                        <p class="text-sm text-gray-500">${user.email}</p>
                                    </div>
                                </td>
                                <td class="p-3"><span class="px-2 py-1 text-xs rounded-full ${user.role === 'pengrajin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">${user.role}</span></td>
                                <td class="p-3 text-gray-600">${new Date(user.joinDate).toLocaleDateString('id-ID')}</td>
                                <td class="p-3"><span class="px-2 py-1 text-xs rounded-full ${user.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${user.status}</span></td>
                                <td class="p-3">
                                    <button class="text-gray-500 hover:text-primary-600 p-1">Edit</button>
                                    <button class="text-gray-500 hover:text-red-600 p-1">Hapus</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderProductManagement() {
     return `
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-gray-800">Manajemen Produk</h2>
                <button class="btn-primary">Tambah Produk</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b bg-gray-50">
                            <th class="p-3 text-sm font-semibold text-gray-600">Produk</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Kategori</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Harga</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Stok</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Terjual</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.products.map(product => `
                            <tr class="border-b hover:bg-gray-50">
                                <td class="p-3 flex items-center gap-3">
                                    <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded-md">
                                    <p class="font-medium text-gray-800">${product.name}</p>
                                </td>
                                <td class="p-3 text-gray-600">${product.category}</td>
                                <td class="p-3 text-gray-600">Rp ${new Intl.NumberFormat('id-ID').format(product.price)}</td>
                                <td class="p-3 text-gray-600">${product.stock}</td>
                                <td class="p-3 text-gray-600">${product.sold}</td>
                                <td class="p-3">
                                    <button class="text-gray-500 hover:text-primary-600 p-1">Edit</button>
                                    <button class="text-gray-500 hover:text-red-600 p-1">Hapus</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderOrderManagement() {
    const statusColors = {
        'Menunggu Pembayaran': 'bg-yellow-100 text-yellow-800',
        'Diproses': 'bg-blue-100 text-blue-800',
        'Dikirim': 'bg-indigo-100 text-indigo-800',
        'Selesai': 'bg-green-100 text-green-800',
        'Dibatalkan': 'bg-red-100 text-red-800'
    };
    return `
        <div class="bg-white p-6 rounded-xl shadow-sm">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Pesanan Masuk</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                     <thead>
                        <tr class="border-b bg-gray-50">
                            <th class="p-3 text-sm font-semibold text-gray-600">Order ID</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Pelanggan</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Tanggal</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Total</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Status</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.orders.map(order => `
                            <tr class="border-b hover:bg-gray-50">
                                <td class="p-3 font-mono text-sm text-gray-800">${order.id}</td>
                                <td class="p-3 text-gray-600">${order.customer}</td>
                                <td class="p-3 text-gray-600">${new Date(order.date).toLocaleDateString('id-ID')}</td>
                                <td class="p-3 text-gray-600">Rp ${new Intl.NumberFormat('id-ID').format(order.total)}</td>
                                <td class="p-3"><span class="px-2 py-1 text-xs rounded-full ${statusColors[order.status]}">${order.status}</span></td>
                                <td class="p-3"><button class="text-gray-500 hover:text-primary-600 p-1">Detail</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// --- POS (POINT OF SALE) / KASIR ---

function renderPOS() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <!-- Product List -->
            <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
                <div class="relative mb-4">
                    <input type="text" id="pos-search-input" placeholder="Cari produk berdasarkan nama..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <div class="absolute left-3 top-2.5 text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                <div id="pos-product-grid" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto flex-1">
                    <!-- Products will be rendered here -->
                </div>
            </div>

            <!-- Cart/Transaction -->
            <div class="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
                <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-3">Transaksi Saat Ini</h3>
                <div id="pos-cart-items" class="flex-1 overflow-y-auto space-y-3 pr-2">
                    <!-- Cart items will be rendered here -->
                </div>
                <div class="border-t pt-4 mt-4 space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Subtotal</span>
                        <span id="pos-subtotal" class="font-medium text-gray-800">Rp 0</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Pajak (10%)</span>
                        <span id="pos-tax" class="font-medium text-gray-800">Rp 0</span>
                    </div>
                    <div class="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span id="pos-total" class="text-primary-600">Rp 0</span>
                    </div>
                    <button id="complete-pos-transaction" class="w-full btn-primary py-3 mt-4 text-base font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed" disabled>
                        Selesaikan Transaksi
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderPOSProducts(products) {
    const grid = document.getElementById('pos-product-grid');
    if (!grid) return;
    if (products.length === 0) {
        grid.innerHTML = `<p class="text-gray-500 col-span-full text-center mt-8">Produk tidak ditemukan.</p>`;
        return;
    }
    grid.innerHTML = products.map(p => `
        <div class="border rounded-lg p-3 flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:border-primary-300 transition-all add-to-pos-cart-btn" data-product-id="${p.id}">
            <img src="${p.image}" alt="${p.name}" class="w-24 h-24 object-cover rounded-md mb-2">
            <p class="text-sm font-medium text-gray-800 flex-1">${p.name}</p>
            <p class="text-sm font-bold text-primary-600 mt-1">Rp ${formatPrice(p.price)}</p>
        </div>
    `).join('');
}

function renderPOSCart() {
    const cartItemsContainer = document.getElementById('pos-cart-items');
    const subtotalEl = document.getElementById('pos-subtotal');
    const taxEl = document.getElementById('pos-tax');
    const totalEl = document.getElementById('pos-total');
    const completeBtn = document.getElementById('complete-pos-transaction');

    if (!cartItemsContainer) return;

    if (state.posCart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center py-8">Keranjang masih kosong.</p>`;
    } else {
        cartItemsContainer.innerHTML = state.posCart.map(item => {
            const product = state.products.find(p => p.id === item.productId);
            return `
                <div class="flex items-center gap-3">
                    <img src="${product.image}" class="w-12 h-12 rounded-md object-cover">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-800">${product.name}</p>
                        <p class="text-xs text-gray-500">Rp ${formatPrice(product.price)}</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <button data-action="decrease" data-product-id="${product.id}" class="w-6 h-6 border rounded hover:bg-gray-100">-</button>
                        <span class="w-8 text-center font-medium">${item.quantity}</span>
                        <button data-action="increase" data-product-id="${product.id}" class="w-6 h-6 border rounded hover:bg-gray-100">+</button>
                    </div>
                    <button data-action="remove" data-product-id="${product.id}" class="text-red-500 hover:text-red-700 p-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            `;
        }).join('');
    }

    const subtotal = state.posCart.reduce((sum, item) => {
        const product = state.products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    subtotalEl.textContent = `Rp ${formatPrice(subtotal)}`;
    taxEl.textContent = `Rp ${formatPrice(tax)}`;
    totalEl.textContent = `Rp ${formatPrice(total)}`;

    if (completeBtn) {
        completeBtn.disabled = state.posCart.length === 0;
    }
}

function attachPOSEventListeners() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.addEventListener('input', e => {
        if (e.target.id === 'pos-search-input') {
            const query = e.target.value.toLowerCase();
            const filtered = state.products.filter(p => p.name.toLowerCase().includes(query));
            renderPOSProducts(filtered);
        }
    });

    mainContent.addEventListener('click', e => {
        const productCard = e.target.closest('.add-to-pos-cart-btn');
        if (productCard) {
            addToPOSCart(productCard.dataset.productId);
            return;
        }

        const cartButton = e.target.closest('button[data-action]');
        if (cartButton) {
            const { action, productId } = cartButton.dataset;
            if (action === 'increase') updatePOSCartQuantity(productId, 1);
            if (action === 'decrease') updatePOSCartQuantity(productId, -1);
            if (action === 'remove') removeFromPOSCart(productId);
            return;
        }

        if (e.target.id === 'complete-pos-transaction') {
            if (state.posCart.length > 0) {
                showPOSReceipt();
            }
        }
        
        if (e.target.closest('.close-modal-btn')) {
            closeModal();
        }
    });
}

function addToPOSCart(productId) {
    const existingItem = state.posCart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.posCart.push({ productId, quantity: 1 });
    }
    renderPOSCart();
}

function updatePOSCartQuantity(productId, change) {
    const item = state.posCart.find(item => item.productId === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromPOSCart(productId);
        } else {
            renderPOSCart();
        }
    }
}

function removeFromPOSCart(productId) {
    state.posCart = state.posCart.filter(item => item.productId !== productId);
    renderPOSCart();
}

function showPOSReceipt() {
    const subtotal = state.posCart.reduce((sum, item) => {
        const product = state.products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    const modalHTML = `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl max-w-sm w-full" onclick="event.stopPropagation()">
                <div class="p-6 text-center">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Struk Transaksi</h2>
                    <div class="text-left text-sm space-y-2 border-y py-4 my-4">
                        ${state.posCart.map(item => {
                            const product = state.products.find(p => p.id === item.productId);
                            return `<div class="flex justify-between"><span>${item.quantity}x ${product.name}</span><span>Rp ${formatPrice(product.price * item.quantity)}</span></div>`;
                        }).join('')}
                    </div>
                    <div class="text-left text-sm space-y-1">
                        <div class="flex justify-between"><span>Subtotal:</span><span>Rp ${formatPrice(subtotal)}</span></div>
                        <div class="flex justify-between"><span>Pajak (10%):</span><span>Rp ${formatPrice(tax)}</span></div>
                        <div class="flex justify-between font-bold text-base mt-2"><span>Total:</span><span>Rp ${formatPrice(total)}</span></div>
                    </div>
                    <button class="w-full btn-primary mt-6 close-modal-btn">Transaksi Baru</button>
                </div>
            </div>
        </div>
    `;
    showModal(modalHTML);
    // Clear cart for next transaction
    state.posCart = [];
    renderPOSCart();
}


// --- HELPERS & DATA GETTERS ---

function getNavItemsByRole(role) {
    const icons = {
        dashboard: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 16l-4-4-4 4M12 12V4"></path></svg>',
        users: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
        products: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>',
        orders: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>',
        pos: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>'
    };

    const commonItems = [
        { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    ];
    
    if (role === 'admin') {
        return [
            ...commonItems,
            { id: 'users', label: 'Manajemen Pengguna', icon: icons.users },
            { id: 'products', label: 'Semua Produk', icon: icons.products },
            { id: 'orders', label: 'Semua Pesanan', icon: icons.orders },
            { id: 'pos', label: 'POS Kasir', icon: icons.pos },
        ];
    }
    
    if (role === 'pengrajin') {
        return [
            ...commonItems,
            { id: 'products', label: 'Produk Saya', icon: icons.products },
            { id: 'orders', label: 'Pesanan Masuk', icon: icons.orders },
            { id: 'pos', label: 'POS Kasir', icon: icons.pos },
        ];
    }

    // Default for 'pembeli'
    return [
        ...commonItems,
        { id: 'orders', label: 'Pesanan Saya', icon: icons.orders },
    ];
}

function getAdminStats() {
    return [
        { title: 'Total Penjualan', value: `Rp ${formatPrice(faker.finance.amount(5000000, 20000000, 0))}`, icon: '💰', bgColor: 'bg-green-100' },
        { title: 'Total Pengguna', value: faker.number.int(1000), icon: '👥', bgColor: 'bg-blue-100' },
        { title: 'Total Produk', value: faker.number.int(500), icon: '📦', bgColor: 'bg-yellow-100' },
        { title: 'Pesanan Baru', value: faker.number.int(50), icon: '🛒', bgColor: 'bg-indigo-100' },
    ];
}

function getSellerStats() {
    return [
        { title: 'Pendapatan (Bulan Ini)', value: `Rp ${formatPrice(faker.finance.amount(1000000, 5000000, 0))}`, icon: '💰', bgColor: 'bg-green-100' },
        { title: 'Produk Terjual', value: faker.number.int(150), icon: '📦', bgColor: 'bg-yellow-100' },
        { title: 'Pesanan Baru', value: faker.number.int(25), icon: '🛒', bgColor: 'bg-indigo-100' },
        { title: 'Rating Toko', value: '4.8', icon: '⭐', bgColor: 'bg-blue-100' },
    ];
}

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

function showModal(html) {
    const modalsContainer = document.getElementById('modals');
    if (modalsContainer) {
        modalsContainer.innerHTML = html;
    }
}

function closeModal() {
    const modalsContainer = document.getElementById('modals');
    if (modalsContainer) {
        modalsContainer.innerHTML = '';
    }
}


// Add custom styles for dashboard
const style = document.createElement('style');
style.textContent = `
    .nav-item {
        @apply flex items-center gap-3 px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors;
    }
    .nav-item.active {
        @apply bg-primary-600 text-white shadow-lg;
    }
`;
document.head.appendChild(style);
