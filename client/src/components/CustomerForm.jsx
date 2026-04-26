import React, { useState, useEffect } from 'react';
import '../styles/components/form.css';

function formatDob(dob) {
  if (!dob) return '';
  if (Array.isArray(dob)) {
    const [y, m, d] = dob;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return dob;
}

const emptyAddress = () => ({ line1: '', line2: '', cityName: '', countryName: '' });

export default function CustomerForm({ customer, allCustomers, onSubmit, onCancel }) {
  const isEdit = Boolean(customer?.id);

  const [name, setName] = useState(customer?.name || '');
  const [dob, setDob] = useState(formatDob(customer?.dob));
  const [nic, setNic] = useState(customer?.nic || '');
  const [mobiles, setMobiles] = useState(
    customer?.mobiles ? customer.mobiles.map(m => typeof m === 'string' ? m : m.mobile) : []
  );
  const [addresses, setAddresses] = useState(
    customer?.addresses ? customer.addresses.map(a => ({
      line1: a.line1 || '',
      line2: a.line2 || '',
      cityName: a.cityName || '',
      countryName: a.countryName || ''
    })) : []
  );
  const [familyMemberIds, setFamilyMemberIds] = useState(
    customer?.familyMembers ? customer.familyMembers.map(f => f.id) : []
  );
  const [familySearch, setFamilySearch] = useState('');

  const otherCustomers = allCustomers.filter(c => c.id !== customer?.id);
  const filteredFamily = otherCustomers.filter(c =>
    c.name.toLowerCase().includes(familySearch.toLowerCase()) ||
    c.nic.toLowerCase().includes(familySearch.toLowerCase())
  );

  function addMobile() {
    setMobiles(prev => [...prev, '']);
  }

  function updateMobile(index, value) {
    setMobiles(prev => prev.map((m, i) => i === index ? value : m));
  }

  function removeMobile(index) {
    setMobiles(prev => prev.filter((_, i) => i !== index));
  }

  function addAddress() {
    setAddresses(prev => [...prev, emptyAddress()]);
  }

  function updateAddress(index, field, value) {
    setAddresses(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a));
  }

  function removeAddress(index) {
    setAddresses(prev => prev.filter((_, i) => i !== index));
  }

  function toggleFamily(id) {
    setFamilyMemberIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  }

  function handleSubmit() {
    if (!name.trim() || !dob || !nic.trim()) {
      alert('Please fill all mandatory fields (*)');
      return;
    }
    onSubmit({
      name: name.trim(),
      dob,
      nic: nic.trim(),
      mobiles: mobiles.filter(m => m.trim() !== ''),
      addresses: addresses.filter(a => a.line1.trim() !== ''),
      familyMemberIds
    });
  }

  return (
    <div className="form-overlay">
      <div className="customer-form-container">
        <div className="form-header">
          <h3>{isEdit ? 'Edit Customer' : 'Create New Customer'}</h3>
          <button className="btn-close" onClick={onCancel}>&times;</button>
        </div>

        <div className="form-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" />
            </div>
            <div className="form-group">
              <label>Date of Birth <span className="required">*</span></label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
            </div>
            <div className="form-group">
              <label>NIC Number <span className="required">*</span></label>
              <input type="text" value={nic} onChange={e => setNic(e.target.value)} placeholder="e.g. 951234567V" />
            </div>
          </div>

          <div className="section-title">
            <span>Contact Numbers</span>
            <button type="button" className="btn-small" onClick={addMobile}>+ Add Mobile</button>
          </div>
          <div>
            {mobiles.length === 0
              ? <p className="info-text">No mobile numbers added.</p>
              : mobiles.map((m, i) => (
                <div className="form-row" key={i}>
                  <input
                    type="text"
                    className="mobile-input"
                    value={m}
                    onChange={e => updateMobile(i, e.target.value)}
                    placeholder="07xxxxxxxx"
                  />
                  <button type="button" className="btn-remove-circle" onClick={() => removeMobile(i)}>&times;</button>
                </div>
              ))
            }
          </div>

          <div className="section-title">
            <span>Addresses</span>
            <button type="button" className="btn-small" onClick={addAddress}>+ Add Address</button>
          </div>
          <div>
            {addresses.length === 0
              ? <p className="info-text">No addresses added.</p>
              : addresses.map((a, i) => (
                <div className="address-card" key={i}>
                  <button type="button" className="btn-remove-circle" onClick={() => removeAddress(i)}>&times;</button>
                  <div className="address-grid">
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Line 1</label>
                      <input type="text" value={a.line1} onChange={e => updateAddress(i, 'line1', e.target.value)} placeholder="Street Address" />
                    </div>
                    <div className="form-group">
                      <label>Line 2</label>
                      <input type="text" value={a.line2} onChange={e => updateAddress(i, 'line2', e.target.value)} placeholder="Apt, Suite, etc." />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" value={a.cityName} onChange={e => updateAddress(i, 'cityName', e.target.value)} placeholder="City" />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input type="text" value={a.countryName} onChange={e => updateAddress(i, 'countryName', e.target.value)} placeholder="Country" />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

          <div className="section-title">
            <span>Family Members</span>
          </div>
          <div className="family-selection-area">
            <div className="family-search-input-wrapper">
              <input
                type="text"
                placeholder="Search by name or NIC..."
                value={familySearch}
                onChange={e => setFamilySearch(e.target.value)}
              />
            </div>
            <div className="family-table-container">
              <table className="family-table">
                <thead>
                  <tr>
                    <th width="40"></th>
                    <th>Name</th>
                    <th>NIC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFamily.length === 0
                    ? <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No customers found</td></tr>
                    : filteredFamily.map(c => (
                      <tr key={c.id}>
                        <td>
                          <input
                            type="checkbox"
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            checked={familyMemberIds.includes(c.id)}
                            onChange={() => toggleFamily(c.id)}
                          />
                        </td>
                        <td>{c.name}</td>
                        <td>{c.nic}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="button" className="btn-large btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn-large btn-primary" onClick={handleSubmit}>
            {isEdit ? 'Save Changes' : 'Create Customer'}
          </button>
        </div>
      </div>
    </div>
  );
}
