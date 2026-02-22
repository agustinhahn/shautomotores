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

export const clientesService = {
    getClientes: async () => {
        const response = await axios.get(`${API_URL}/api/clientes`, getAuthHeaders());
        return response.data;
    },

    createCliente: async (data) => {
        const response = await axios.post(`${API_URL}/api/clientes`, data, getAuthHeaders());
        return response.data;
    },

    updateCliente: async (id, data) => {
        const response = await axios.put(`${API_URL}/api/clientes/${id}`, data, getAuthHeaders());
        return response.data;
    }
};
