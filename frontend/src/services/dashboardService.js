const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/dashboard` : 'http://localhost:5001/api/dashboard';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const getStats = async () => {
    const res = await fetch(`${API_URL}/stats`, {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Error fetching stats');
    return res.json();
};

const getChartsData = async () => {
    const res = await fetch(`${API_URL}/charts`, {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Error fetching charts data');
    return res.json();
};

const dashboardService = {
    getStats,
    getChartsData
};

export default dashboardService;
