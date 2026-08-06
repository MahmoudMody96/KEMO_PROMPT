// src/lib/apiClient.js — The single door to our backend.
//
// Replaces the Supabase client. The session lives in an httpOnly cookie that
// JavaScript cannot read, so there is no token to attach here and nothing for
// an XSS payload to steal — the browser sends it automatically.

/** Thrown for account-level rejections so the UI can react specifically. */
export class ApiError extends Error {
    constructor(message, status, kind) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.kind = kind;   // 'auth' | 'credits' | 'rate' | null
    }
}

function kindFor(status) {
    if (status === 401 || status === 403) return 'auth';
    if (status === 402) return 'credits';
    if (status === 429) return 'rate';
    return null;
}

async function request(path, { method = 'GET', body, signal } = {}) {
    const response = await fetch(`/api${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'same-origin',   // send the session cookie
        signal,
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        // A non-JSON body on an error is still an error; fall through.
    }

    if (!response.ok) {
        const message = data?.error || `Request failed (${response.status})`;
        throw new ApiError(message, response.status, kindFor(response.status));
    }

    return data;
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
    patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
    delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};

// --- auth ---------------------------------------------------------------
export const auth = {
    me: () => api.get('/auth/me'),
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password, displayName) =>
        api.post('/auth/register', { email, password, displayName }),
    logout: () => api.post('/auth/logout'),
    changePassword: (currentPassword, newPassword) =>
        api.post('/auth/password', { currentPassword, newPassword }),
};

// --- account ------------------------------------------------------------
export const account = {
    credits: () => api.get('/account/credits'),
    transactions: (limit = 20) => api.get(`/account/transactions?limit=${limit}`),
    usage: () => api.get('/account/usage'),
    updateProfile: (patch) => api.patch('/account/profile', patch),
};

// --- projects -----------------------------------------------------------
export const projects = {
    list: (limit = 20) => api.get(`/projects?limit=${limit}`),
    create: (project) => api.post('/projects', project),
    update: (id, patch) => api.patch(`/projects/${id}`, patch),
    remove: (id) => api.delete(`/projects/${id}`),
};

// --- admin --------------------------------------------------------------
export const admin = {
    overview: () => api.get('/admin/overview'),
    users: ({ search = '', sort = 'created_at', dir = 'desc', limit = 50 } = {}) =>
        api.get(`/admin/users?search=${encodeURIComponent(search)}&sort=${sort}&dir=${dir}&limit=${limit}`),
    logs: ({ action = 'all', limit = 200 } = {}) =>
        api.get(`/admin/logs?action=${action}&limit=${limit}`),
    updateUser: (id, patch) => api.patch(`/admin/users/${id}`, patch),
    settings: () => api.get('/admin/settings'),
    updateSettings: (patch) => api.patch('/admin/settings', patch),
};

// --- billing ------------------------------------------------------------
export const billing = {
    createCheckout: (variantId) => api.post('/create-checkout', { variantId }),
};

export default api;
