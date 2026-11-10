/* AUTH — АВТОРИЗАЦИЯ */
let currentUser = null;
function initAuth() {
  const stored = localStorage.getItem(CONFIG.storageKeys.user);
  currentUser = stored ? JSON.parse(stored) : null;
  updateAuthUI();
}
function updateAuthUI() {
  const authBtn = document.getElementById('authBtn');
  if (authBtn) {
    if (currentUser) {
      authBtn.innerHTML = '👤';
      authBtn.title = `Вход: ${currentUser.name}`;
      authBtn.onclick = () => {
        if (confirm(`Вы вошли как ${currentUser.name}.\nВыйти?`)) logout();
      };
    } else {
      authBtn.innerHTML = '👤';
      authBtn.title = 'Вход';
      authBtn.onclick = () => {
        const modal = document.getElementById('authModal');
        if (modal) modal.classList.add('active');
      };
    }
  }
}
function login(email, password) {
  if (email === CONFIG.demoUser.email && password === CONFIG.demoUser.password) {
    currentUser = { email, name: CONFIG.demoUser.name };
    localStorage.setItem(CONFIG.storageKeys.user, JSON.stringify(currentUser));
    updateAuthUI();
    showToast('Вход выполнен успешно', 'success');
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
    return true;
  }
  showToast('Неверный email или пароль', 'error');
  return false;
}
function logout() {
  currentUser = null;
  localStorage.removeItem(CONFIG.storageKeys.user);
  updateAuthUI();
  showToast('Вы вышли из аккаунта', 'success');
}
function isLoggedIn() { return !!currentUser; }
function getCurrentUser() { return currentUser; }
document.addEventListener('DOMContentLoaded', () => {
  const doLogin = document.getElementById('doLogin');
  const closeAuth = document.getElementById('closeAuthModal');
  const loginForm = document.getElementById('loginForm');
  if (doLogin) {
    doLogin.addEventListener('click', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      login(email, password);
    });
  }
  if (closeAuth) {
    closeAuth.addEventListener('click', () => {
      document.getElementById('authModal').classList.remove('active');
    });
  }
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => { e.preventDefault(); });
  }
});
window.login = login;
window.logout = logout;
window.isLoggedIn = isLoggedIn;