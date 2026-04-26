import React from 'react';
import '../styles/components/table.css';

function formatMobiles(val) {
  if (!val || !Array.isArray(val) || val.length === 0) return '-';
  return val.map(m => typeof m === 'string' ? m : (m.mobile || '')).filter(Boolean).join(', ');
}

function formatAddresses(val) {
  if (!val || !Array.isArray(val) || val.length === 0) return '-';
  return val.map(a => [a.line1, a.line2].filter(Boolean).join(', ')).filter(Boolean).join(' | ');
}

function formatFamily(val) {
  if (!val || !Array.isArray(val) || val.length === 0) return '-';
  return val.map(f => f.name).join(', ');
}

export default function CustomerTable({ customers, onEdit, onDelete }) {
  if (!customers || customers.length === 0) {
    return <div className="simple-table">No customers found.</div>;
  }

  return (
    <div className="table-scroll-wrapper">
      <table className="simple-table my-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Date of Birth</th>
            <th>NIC Number</th>
            <th>Contact Numbers</th>
            <th>Addresses</th>
            <th>Family Members</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{Array.isArray(customer.dob) ? customer.dob.join('-') : customer.dob}</td>
              <td>{customer.nic}</td>
              <td>{formatMobiles(customer.mobiles)}</td>
              <td>{formatAddresses(customer.addresses)}</td>
              <td>{formatFamily(customer.familyMembers)}</td>
              <td>
                <button className="btn-edit" onClick={() => onEdit(customer)}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
