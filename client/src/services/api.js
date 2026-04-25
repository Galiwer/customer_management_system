export const API_BASE_URL = 'http://localhost:8080/api';

export function fetchCustomers() {
  return fetch(`${API_BASE_URL}/customers`)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      return resp.json();
    });
}

export function createCustomer(data) {
  return fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(resp => {
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    return resp.json();
  });
}

export function updateCustomer(id, data) {
  return fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(resp => {
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    return resp.json();
  });
}

export function deleteCustomer(id) {
  return fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'DELETE'
  }).then(resp => {
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
  });
}

export function uploadExcel(file) {
  const form = new FormData();
  form.append('file', file);
  return fetch(`${API_BASE_URL}/customers/upload`, {
    method: 'POST',
    body: form
  }).then(resp => {
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    return resp.text();
  });
}
