import { faker } from '@faker-js/faker';

// --- STATE & INITIALIZATION ---
const state = {
    user: null,
    currentPage: 'dashboard',
    users: [],
    products: [],
    orders: []
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

    // Mock products for admin/pengrajin view
    state.products = Array.from({ length: 25 }, () => ({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: faker.commerce.price({ min: 50000, max: 500000 }),
        stock: faker.number.int({ min: 0, max: 100 }),
        sold: faker.number.int({ min: 10, max: 200 }),
        image: faker.image.urlLoremFlickr({ category: 'crafts', width: 128, height: 128 })
    }));
    
    // Mock orders for pengrajin view
    state.orders = Array.from({ length: 30 }, () => ({
        id: `#${faker.string.alphanumeric(6).toUpperCase()}`,
        customer: faker.person.fullName(),
        date: faker.date.recent({ days: 30 }),
        total: faker.commerce.price({ min: 100000, max: 1500000 }),
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
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.dataset.page;
            renderPage(pageId);
        });
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
                    <div class="w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor}">
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

// --- HELPERS & DATA GETTERS ---

function getNavItemsByRole(role) {
    const icons = {
        dashboard: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
        users: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
        products: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>',
        orders: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>',
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
        ];
    }
    
    if (role === 'pengrajin') {
        return [
            ...commonItems,
            { id: 'products', label: 'Produk Saya', icon: icons.products },
            { id: 'orders', label: 'Pesanan Masuk', icon: icons.orders },
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
        { title: 'Total Penjualan', value: `Rp ${new Intl.NumberFormat('id-ID').format(faker.finance.amount(5000000, 20000000, 0))}`, icon: '💰', bgColor: 'bg-green-100' },
        { title: 'Total Pengguna', value: faker.number.int(1000), icon: '👥', bgColor: 'bg-blue-100' },
        { title: 'Total Produk', value: faker.number.int(500), icon: '📦', bgColor: 'bg-yellow-100' },
        { title: 'Pesanan Baru', value: faker.number.int(50), icon: '🛒', bgColor: 'bg-indigo-100' },
    ];
}

function getSellerStats() {
    return [
        { title: 'Pendapatan (Bulan Ini)', value: `Rp ${new Intl.NumberFormat('id-ID').format(faker.finance.amount(1000000, 5000000, 0))}`, icon: '💰', bgColor: 'bg-green-100' },
        { title: 'Produk Terjual', value: faker.number.int(150), icon: '📦', bgColor: 'bg-yellow-100' },
        { title: 'Pesanan Baru', value: faker.number.int(25), icon: '🛒', bgColor: 'bg-indigo-100' },
        { title: 'Rating Toko', value: '4.8', icon: '⭐', bgColor: 'bg-blue-100' },
    ];
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
