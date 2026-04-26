import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export function fetchCustomers() {
    return apiClient.get('/customers')
        .then(response => response.data);
}

export function createCustomer(data) {
    return apiClient.post('/customers', data)
        .then(response => response.data);
}

export function updateCustomer(id, data) {
    return apiClient.put(`/customers/${id}`, data)
        .then(response => response.data);
}

export function deleteCustomer(id) {
    return apiClient.delete(`/customers/${id}`)
        .then(response => response.data);
}

export function uploadExcel(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/customers/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => response.data);
}
