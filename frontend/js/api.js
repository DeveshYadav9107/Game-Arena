/* api.js
   Single place that talks to the backend REST API.
   Every page includes this file before its own page script. */

// Change this if your backend runs on a different host/port
const API_BASE_URL = 'https://gamearena-pdqa.onrender.com/api';

/**
 * Generic request helper.
 * Automatically attaches the JWT token (if the user is logged in)
 * and parses the JSON response.
 */
async function apiRequest(endpoint, { method = 'GET', body = null, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = localStorage.getItem('ga_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  } catch (networkError) {
    throw new Error('Cannot reach the server. Is the backend running on port 5000?');
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error((data && data.message) || 'Something went wrong. Please try again.');
  }

  return data;
}

/* ---------------- Auth ---------------- */
const AuthAPI = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload, auth: false }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  me: () => apiRequest('/auth/me'),
};

/* ---------------- Users ---------------- */
const UserAPI = {
  updateProfile: (payload) => apiRequest('/users/profile', { method: 'PUT', body: payload }),
  getById: (id) => apiRequest(`/users/${id}`),
};

/* ---------------- Tournaments ---------------- */
const TournamentAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/tournaments${query ? `?${query}` : ''}`, { auth: false });
  },
  getById: (id) => apiRequest(`/tournaments/${id}`, { auth: false }),
  create: (payload) => apiRequest('/tournaments', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/tournaments/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/tournaments/${id}`, { method: 'DELETE' }),
  mine: () => apiRequest('/tournaments/organizer/mine'),
};

/* ---------------- Registrations ---------------- */
const RegistrationAPI = {
  join: (tournamentId) => apiRequest(`/registrations/${tournamentId}`, { method: 'POST' }),
  cancel: (id) => apiRequest(`/registrations/cancel/${id}`, { method: 'PUT' }),
  approve: (id) => apiRequest(`/registrations/${id}/approve`, { method: 'PUT' }),
  reject: (id) => apiRequest(`/registrations/${id}/reject`, { method: 'PUT' }),
  forTournament: (tournamentId) => apiRequest(`/registrations/tournament/${tournamentId}`),
  mine: () => apiRequest('/registrations/mine'),
};

/* ---------------- Matches ---------------- */
const MatchAPI = {
  create: (payload) => apiRequest('/matches', { method: 'POST', body: payload }),
  forTournament: (tournamentId) => apiRequest(`/matches/tournament/${tournamentId}`, { auth: false }),
  updateSchedule: (id, payload) => apiRequest(`/matches/${id}`, { method: 'PUT', body: payload }),
  updateResult: (id, payload) => apiRequest(`/matches/${id}/result`, { method: 'PUT', body: payload }),
};

/* ---------------- Leaderboard ---------------- */
const LeaderboardAPI = {
  forTournament: (tournamentId) => apiRequest(`/leaderboard/${tournamentId}`, { auth: false }),
};

/* ---------------- Results ---------------- */
const ResultAPI = {
  publish: (tournamentId) => apiRequest(`/results/${tournamentId}/publish`, { method: 'POST' }),
  getResult: (tournamentId) => apiRequest(`/results/${tournamentId}`, { auth: false }),
};

/* ---------------- Dashboard ---------------- */
const DashboardAPI = {
  organizer: () => apiRequest('/dashboard/organizer'),
  player: () => apiRequest('/dashboard/player'),
};
