import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

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
        const response = await axios.get(`${API_URL}/api/registros`, getAuthHeaders());
        return response.data;
    },
    
    getOptions: async () => {
        const response = await axios.get(`${API_URL}/api/registros/options`, getAuthHeaders());
        return response.data;
    },

    createRegistro: async (data) => {
        const response = await axios.post(`${API_URL}/api/registros`, data, getAuthHeaders());
        return response.data;
    },

    updateRegistro: async (id, data) => {
        const response = await axios.put(`${API_URL}/api/registros/${id}`, data, getAuthHeaders());
        return response.data;
    }
};
