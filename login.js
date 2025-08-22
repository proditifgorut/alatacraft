import { faker } from '@faker-js/faker';

document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        // Check if there's an action in URL (e.g., from clicking "register")
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action') || 'login';
        renderAuthForm(action);
    }
});

function renderAuthForm(type = 'login') {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;

    const isLogin = type === 'login';

    authContainer.innerHTML = `
        <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900">${isLogin ? 'Selamat Datang Kembali!' : 'Buat Akun Baru'}</h2>
            <p class="text-gray-500 mt-2">${isLogin ? 'Masuk untuk melanjutkan ke dashboard Anda.' : 'Bergabung dengan ribuan pengrajin dan pembeli.'}</p>
        </div>
        
        <form id="auth-form" class="space-y-6">
            ${!isLogin ? `
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input type="text" id="name" name="name" class="input-field" placeholder="John Doe" required>
                </div>
            ` : ''}
            
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" name="email" class="input-field" placeholder="anda@email.com" required>
            </div>
            
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" id="password" name="password" class="input-field" placeholder="••••••••" required>
            </div>
            
            ${!isLogin ? `
                <div>
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                    <input type="password" id="confirm-password" name="confirm-password" class="input-field" placeholder="••••••••" required>
                </div>
                
                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Daftar Sebagai</label>
                    <select id="role" name="role" class="input-field">
                        <option value="pembeli">Pembeli</option>
                        <option value="pengrajin">Pengrajin</option>
                        <option value="admin">Admin (Demo)</option>
                    </select>
                </div>
            ` : ''}
            
            ${isLogin ? `
                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                        <span class="ml-2 text-sm text-gray-600">Ingat saya</span>
                    </label>
                    <a href="#" class="text-sm text-primary-600 hover:underline">Lupa password?</a>
                </div>
            ` : ''}
            
            <button type="submit" class="w-full btn-primary py-3 text-base font-semibold">
                ${isLogin ? 'Masuk' : 'Daftar'}
            </button>
        </form>
        
        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
                ${isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                <button id="switch-auth" class="font-medium text-primary-600 hover:underline">
                    ${isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
                </button>
            </p>
        </div>
    `;

    document.getElementById('switch-auth').addEventListener('click', () => {
        renderAuthForm(isLogin ? 'register' : 'login');
    });

    document.getElementById('auth-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleAuth(type);
    });
}

function handleAuth(type) {
    const form = document.getElementById('auth-form');
    const email = form.email.value;
    const password = form.password.value;

    if (type === 'register') {
        const name = form.name.value;
        const role = form.role.value;
        const confirmPassword = form['confirm-password'].value;

        if (password !== confirmPassword) {
            alert('Password dan konfirmasi password tidak cocok!');
            return;
        }

        // Simulate successful registration
        const user = {
            id: faker.string.uuid(),
            name,
            email,
            role, // 'pembeli', 'pengrajin', 'admin'
            avatar: faker.image.avatar(),
        };
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = '/dashboard.html';

    } else { // Login
        // Simulate successful login
        // In a real app, you'd fetch user data based on email/password
        const role = email.includes('admin') ? 'admin' : (email.includes('pengrajin') ? 'pengrajin' : 'pembeli');
        const name = email.split('@')[0].replace('.', ' ').replace(/\d+/g, '').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

        const user = {
            id: faker.string.uuid(),
            name: name || "Demo User",
            email,
            role,
            avatar: faker.image.avatar(),
        };
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = '/dashboard.html';
    }
}

// Make functions available globally for event handlers in HTML string
window.renderAuthForm = renderAuthForm;
window.handleAuth = handleAuth;
