import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/clientes` : 'http://localhost:5001/api/clientes';

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
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    },

    createCliente: async (data) => {
        const response = await axios.post(API_URL, data, getAuthHeaders());
        return response.data;
    },

    updateCliente: async (id, data) => {
        const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
        return response.data;
    }
};
