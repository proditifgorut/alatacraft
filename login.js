import { faker } from '@faker-js/faker';

document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
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
        
        <div id="auth-error" class="text-red-500 text-sm text-center mt-4"></div>

        ${isLogin ? `
            <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                <p class="font-semibold text-center mb-1">Gunakan Akun Demo</p>
                <ul class="list-disc list-inside">
                    <li><b>Admin:</b> admin@admin.com / admin</li>
                    <li><b>Pengrajin:</b> user@user.com / user</li>
                </ul>
            </div>
        ` : ''}
        
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
    const errorElement = document.getElementById('auth-error');
    errorElement.textContent = ''; // Clear previous errors

    if (type === 'register') {
        const name = form.name.value;
        const role = form.role.value;
        const confirmPassword = form['confirm-password'].value;

        if (password !== confirmPassword) {
            errorElement.textContent = 'Password dan konfirmasi password tidak cocok!';
            return;
        }

        // Simulate successful registration
        const user = {
            id: faker.string.uuid(),
            name,
            email,
            role,
            avatar: faker.image.avatar(),
        };
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = '/dashboard.html';

    } else { // Login
        let user = null;

        if (email === 'admin@admin.com' && password === 'admin') {
            user = {
                id: faker.string.uuid(),
                name: 'Admin Alatacraft',
                email: 'admin@admin.com',
                role: 'admin',
                avatar: faker.image.avatar(),
            };
        } else if (email === 'user@user.com' && password === 'user') {
            user = {
                id: faker.string.uuid(),
                name: 'Pengrajin Demo',
                email: 'user@user.com',
                role: 'pengrajin',
                avatar: faker.image.avatar(),
            };
        }

        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = '/dashboard.html';
        } else {
            errorElement.textContent = 'Email atau password salah. Silakan coba lagi.';
        }
    }
}

// Make functions available globally for event handlers in HTML string
window.renderAuthForm = renderAuthForm;
window.handleAuth = handleAuth;
