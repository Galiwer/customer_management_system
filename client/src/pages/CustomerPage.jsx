import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CustomerTable from '../components/CustomerTable.jsx';
import CustomerForm from '../components/CustomerForm.jsx';
import UploadModal from '../components/UploadModal.jsx';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api.js';
import '../styles/pages/customerpage.css';

export default function CustomerPage() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formCustomer, setFormCustomer] = useState(null);  // null = form closed
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  function loadCustomers() {
    setLoading(true);
    setError('');
    fetchCustomers()
      .then(data => {
        setAllCustomers(data);
        setFiltered(data);
      })
      .catch(() => setError('Unable to load customers.'))
      .finally(() => setLoading(false));
  }

  function handleSearch(term) {
    const lower = term.toLowerCase();
    setFiltered(allCustomers.filter(c =>
      c.name.toLowerCase().includes(lower) || c.nic.toLowerCase().includes(lower)
    ));
  }

  function handleEdit(customer) {
    setFormCustomer(customer);
  }

  function handleAddNew() {
    setFormCustomer({ name: '', dob: '', nic: '', mobiles: [], addresses: [], familyMembers: [] });
  }

  function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    deleteCustomer(id)
      .then(loadCustomers)
      .catch(() => alert('Failed to delete customer.'));
  }

  function handleFormSubmit(payload) {
    const request = formCustomer?.id
      ? updateCustomer(formCustomer.id, payload)
      : createCustomer(payload);

    request
      .then(() => {
        setFormCustomer(null);
        loadCustomers();
      })
      .catch(() => alert('Failed to save customer. NIC might already exist.'));
  }

  function handleUploadSuccess() {
    alert('File uploaded successfully!');
    setShowUpload(false);
    loadCustomers();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />

      <main id="customer-page" className="responsive-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
          <SearchBar onSearch={handleSearch} />

          <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setShowUpload(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Bulk Upload Excel
            </button>
            <button className="btn-primary" onClick={handleAddNew}>+ Add New Customer</button>
          </div>
        </div>

        <div id="table-container" className="table-container-flex">
          {loading && <p>Loading customers...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            <CustomerTable
              customers={filtered}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      <Footer />

      {formCustomer !== null && (
        <CustomerForm
          customer={formCustomer}
          allCustomers={allCustomers}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormCustomer(null)}
        />
      )}

      {showUpload && (
        <UploadModal
          onSuccess={handleUploadSuccess}
          onCancel={() => setShowUpload(false)}
        />
      )}
    </div>
  );
}
