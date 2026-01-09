const API_BASE_URL = 'http://localhost:8000';

export async function fetchLocations() {
    const response = await fetch(`${API_BASE_URL}/api/locations/list`);
    if (!response.ok) throw new Error('Failed to fetch locations');
    return response.json();
}

export async function fetchSalesData(location) {
    let url = `${API_BASE_URL}/api/dashboard/sales-data`;
    if (location) url += `?location=${encodeURIComponent(location)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch sales data');
    return response.json();
}

// Auth functions
export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
    }
    return response.json();
}

export async function signup(userData) {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
    }
    return response.json();
}

export async function resetPassword(email, newPassword) {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password: newPassword })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Reset failed');
    }
    return response.json();
}

export async function getCurrentUser(token) {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return response.json();
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function fetchComprehensiveData() {
    const url = `${API_BASE_URL}/api/dashboard/comprehensive`;
    const response = await fetch(url, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch comprehensive data');
    return response.json();
}

export async function predictSales(inputs) {
    const response = await fetch(`${API_BASE_URL}/api/predict/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
    });
    if (!response.ok) throw new Error('Sales prediction failed');
    return response.json();
}

export async function predictStock(inputs) {
    const response = await fetch(`${API_BASE_URL}/api/predict/stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
    });
    if (!response.ok) throw new Error('Stock prediction failed');
    return response.json();
}
export async function uploadCSV(file) {
    const url = `${API_BASE_URL}/api/upload/csv`;
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload CSV');
    }
    return response.json();
}
