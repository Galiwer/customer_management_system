import React, { useState, useRef } from 'react';
import '../styles/components/form.css';
import { uploadExcel } from '../services/api.js';

export default function UploadModal({ onSuccess, onCancel }) {
  const [status, setStatus] = useState('');
  const [statusColor, setStatusColor] = useState('#3b82f6');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  function handleFile(file) {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setStatusColor('#ef4444');
      setStatus('Invalid file type. Please upload an Excel or CSV file.');
      return;
    }

    setStatusColor('#3b82f6');
    setStatus(`Uploading "${file.name}"... Please wait.`);
    setIsUploading(true);

    uploadExcel(file)
      .then(() => {
        onSuccess();
      })
      .catch(() => {
        setStatusColor('#ef4444');
        setStatus('Failed to upload. Check file format and contents.');
        setIsUploading(false);
      });
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function onFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }

  return (
    <div className="form-overlay">
      <div className="customer-form-container" style={{ maxWidth: '500px' }}>
        <div className="form-header">
          <h3>Bulk Customer Upload</h3>
          <button className="btn-close" onClick={onCancel}>&times;</button>
        </div>

        <div className="form-body" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <p style={{ marginBottom: '20px', color: '#64748b', fontSize: '15px' }}>
            Upload an Excel (.xlsx, .xls) or CSV (.csv) file containing customer data.
          </p>

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            style={{
              border: `2px dashed ${isDragging ? '#3b82f6' : '#cbd5e0'}`,
              borderRadius: '12px',
              padding: '50px 20px',
              background: isDragging ? '#eff6ff' : '#f8fafc',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Drag &amp; Drop your Excel/CSV file here
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>or click to browse from computer</div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            onChange={onFileChange}
          />

          {status && (
            <div style={{ marginTop: '20px', fontWeight: 600, color: statusColor }}>
              {status}
            </div>
          )}
        </div>

        <div className="form-footer">
          <button type="button" className="btn-large btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
