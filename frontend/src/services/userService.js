const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : 'http://localhost:5001/api/users';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const getAllUsers = async () => {
    const res = await fetch(API_URL, {
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Error fetching users');
    return res.json();
};

const updateUserRole = async (id, role) => {
    const res = await fetch(`${API_URL}/${id}/role`, {
        method: 'PUT',
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error('Error updating user role');
    return res.json();
};

const deleteUser = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Error deleting user');
    return res.json();
};

const createUser = async (userData) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error creating user');
    }
    return res.json();
};

const updateUser = async (id, userData) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error updating user');
    }
    return res.json();
};

const userService = {
    getAllUsers,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser
};

export default userService;
