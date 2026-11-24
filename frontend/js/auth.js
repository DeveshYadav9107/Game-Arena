/* auth.js
   Small helper library for session state (stored in localStorage)
   and route protection. Included on every page after api.js. */

const Session = {
  setSession(data) {
    localStorage.setItem('ga_token', data.token);
    localStorage.setItem(
      'ga_user',
      JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role })
    );
  },
  getUser() {
    const raw = localStorage.getItem('ga_user');
    return raw ? JSON.parse(raw) : null;
  },
  getToken() {
    return localStorage.getItem('ga_token');
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  logout() {
    localStorage.removeItem('ga_token');
    localStorage.removeItem('ga_user');
    window.location.href = 'login.html';
  },
};

/**
 * Call at the top of any page that requires login.
 * Optionally pass a role ('organizer' | 'player') to restrict access further.
 */
function requireAuth(role = null) {
  if (!Session.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }
  const user = Session.getUser();
  if (role && user.role !== role) {
    alert(`This page is only available to ${role}s.`);
    window.location.href = 'index.html';
  }
}

/**
 * Builds the shared navigation bar, adapting links to the user's
 * logged-in state and role. Every page has an empty <div id="ga-navbar">
 * that this function fills in.
 */
function renderNavbar(activePage = '') {
  const mount = document.getElementById('ga-navbar');
  if (!mount) return;

  const user = Session.getUser();
  const loggedIn = Session.isLoggedIn();

  const dashboardLink = user
    ? `<li class="nav-item"><a class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" href="dashboard.html">Dashboard</a></li>`
    : '';

  const authLinks = loggedIn
    ? `
      <li class="nav-item"><a class="nav-link ${activePage === 'profile' ? 'active' : ''}" href="profile.html"><i class="bi bi-person-circle"></i> ${user.name}</a></li>
      <li class="nav-item"><a class="nav-link" href="#" onclick="Session.logout(); return false;">Logout</a></li>
    `
    : `
      <li class="nav-item"><a class="nav-link ${activePage === 'login' ? 'active' : ''}" href="login.html">Login</a></li>
      <li class="nav-item"><a class="nav-link ${activePage === 'register' ? 'active' : ''}" href="register.html">Register</a></li>
    `;

  mount.innerHTML = `
    <nav class="navbar navbar-expand-lg ga-navbar sticky-top">
      <div class="container">
        <a class="navbar-brand" href="index.html">Game<span>Arena</span></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#gaNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="gaNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link ${activePage === 'home' ? 'active' : ''}" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link ${activePage === 'tournaments' ? 'active' : ''}" href="tournaments.html">Tournaments</a></li>
            ${dashboardLink}
          </ul>
          <ul class="navbar-nav">
            ${authLinks}
          </ul>
        </div>
      </div>
    </nav>
  `;
}

/**
 * Shows a Bootstrap toast notification.
 * type: 'success' | 'danger' | 'warning' | 'info'
 */
function showToast(message, type = 'success') {
  let container = document.getElementById('ga-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ga-toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = 1080;
    document.body.appendChild(container);
  }

  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  container.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusBadgeClass(status) {
  const map = {
    Upcoming: 'badge-upcoming',
    Ongoing: 'badge-ongoing',
    Completed: 'badge-completed',
    Pending: 'badge-pending',
    Approved: 'badge-approved',
    Rejected: 'badge-rejected',
    Cancelled: 'badge-cancelled',
  };
  return map[status] || 'bg-secondary';
}
