import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/registros` : 'http://localhost:5001/api/registros';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const registrosService = {
    getRegistros: async () => {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    },
    
    getOptions: async () => {
        const response = await axios.get(`${API_URL}/options`, getAuthHeaders());
        return response.data;
    },

    createRegistro: async (data) => {
        const response = await axios.post(API_URL, data, getAuthHeaders());
        return response.data;
    },

    updateRegistro: async (id, data) => {
        const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
        return response.data;
    }
};
