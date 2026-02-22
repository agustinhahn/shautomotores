const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/vehicles` : 'http://localhost:5001/api/vehicles';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const getAllVehicles = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_URL}?${query}` : API_URL;
    const res = await fetch(url, {
        headers: getAuthHeader()
    });
    return res.json();
};

const getMyVehicles = async () => {
    const res = await fetch(`${API_URL}/my-vehicles`, {
        headers: getAuthHeader()
    });
    return res.json();
};

const createVehicle = async (vehicleData) => {
    // If vehicleData is FormData, don't set Content-Type header (browser does it)
    const isFormData = vehicleData instanceof FormData;
    const headers = getAuthHeader();
    
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: isFormData ? vehicleData : JSON.stringify(vehicleData)
    });

    if (!res.ok) {
        const text = await res.text();
        try {
            const errorData = JSON.parse(text);
            const error = new Error(errorData.message || 'Error creating vehicle');
            error.response = { data: errorData };
            throw error;
        } catch (e) {
            // If it's not JSON (e.g. HTML 404/500), throw the raw text or a generic error with the text
            if (e.response) throw e; // It was a valid JSON error that we just threw above
            
            console.error('Backend returned non-JSON error:', text);
            const error = new Error(`Server error (${res.status}): ${text.substring(0, 200)}...`);
            error.response = { data: { message: error.message } };
            throw error;
        }
    }

    return res.json();
};

const deleteVehicle = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    return res.json();
};

const getVehicleById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeader()
    });
    return res.json();
};

export const updateVehicle = async (id, vehicleData) => {
    const isFormData = vehicleData instanceof FormData;
    const headers = getAuthHeader();
    
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: headers,
        body: isFormData ? vehicleData : JSON.stringify(vehicleData)
    });

    if (!res.ok) {
        const text = await res.text();
        try {
            const error = JSON.parse(text);
            throw new Error(error.message || 'Error updating vehicle');
        } catch (e) {
             console.error('Update error:', text);
             throw new Error(`Server error (${res.status})`);
        }
    }
    return res.json();
};

export default {
    getAllVehicles,
    getMyVehicles,
    createVehicle,
    deleteVehicle,
    getVehicleById,
    updateVehicle
};
