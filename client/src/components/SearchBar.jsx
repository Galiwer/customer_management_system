import React from 'react';

export default function SearchBar({ onSearch }) {
  return (
    <div className="search-container" style={{ display: 'flex', gap: '10px', flex: 1 }}>
      <input
        type="text"
        placeholder="Search by Name or NIC..."
        className="search-input"
        style={{ padding: '14px 18px', borderRadius: '10px', border: '1px solid #cbd5e0', width: '350px', fontSize: '16px', backgroundColor: '#f8fafc', color: '#1e293b' }}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
