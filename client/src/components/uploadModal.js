import '../styles/components/form.css';
import { uploadExcel } from '../services/api.js';

export function renderUploadModal(onSuccess, onCancel) {
  const overlay = document.createElement('div');
  overlay.className = 'form-overlay';

  const container = document.createElement('div');
  container.className = 'customer-form-container';
  container.style.maxWidth = '500px';
  overlay.appendChild(container);

  container.innerHTML = `
    <div class="form-header">
      <h3>Bulk Customer Upload</h3>
      <button class="btn-close">&times;</button>
    </div>
    
    <div class="form-body" style="padding: 40px 32px; text-align: center;">
      <p style="margin-bottom: 20px; color: #64748b; font-size: 15px;">Upload an Excel (.xlsx, .xls) or CSV (.csv) file containing customer data. Ensure the columns match the required format.</p>
      
      <div id="drop-zone" style="border: 2px dashed #cbd5e0; border-radius: 12px; padding: 50px 20px; background: #f8fafc; cursor: pointer; transition: all 0.2s;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <div style="font-size: 16px; font-weight: 700; color: #334155; margin-bottom: 8px;">Drag & Drop your Excel/CSV file here</div>
        <div style="font-size: 14px; color: #64748b;">or click to browse from computer</div>
      </div>
      
      <input type="file" id="hidden-file-input" accept=".xlsx, .xls, .csv" style="display: none;" />
      
      <div id="upload-status" style="margin-top: 20px; font-weight: 600; display: none;"></div>
    </div>

    <div class="form-footer">
      <button type="button" id="btn-cancel-upload" class="btn-large btn-ghost">Cancel</button>
    </div>
  `;

  const dropZone = container.querySelector('#drop-zone');
  const fileInput = container.querySelector('#hidden-file-input');
  const statusDiv = container.querySelector('#upload-status');
  const btnClose = container.querySelector('.btn-close');
  const btnCancel = container.querySelector('#btn-cancel-upload');

  btnClose.onclick = onCancel;
  btnCancel.onclick = onCancel;

  // Open file browser on click
  dropZone.onclick = () => fileInput.click();

  // Handle Drag & Drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#3b82f6';
    dropZone.style.background = '#eff6ff';
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#cbd5e0';
    dropZone.style.background = '#f8fafc';
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#cbd5e0';
    dropZone.style.background = '#f8fafc';
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

 
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      statusDiv.style.display = 'block';
      statusDiv.style.color = '#ef4444';
      statusDiv.textContent = 'Invalid file type. Please upload an Excel or CSV file.';
      return;
    }

    statusDiv.style.display = 'block';
    statusDiv.style.color = '#3b82f6';
    statusDiv.textContent = `Uploading "${file.name}"... Please wait.`;
    dropZone.style.pointerEvents = 'none';
    dropZone.style.opacity = '0.5';

    uploadExcel(file)
      .then(() => {
        onSuccess();
      })
      .catch((err) => {
        console.error(err);
        statusDiv.style.color = '#ef4444';
        statusDiv.textContent = 'Failed to upload Excel file. Check format and contents.';
        dropZone.style.pointerEvents = 'auto';
        dropZone.style.opacity = '1';
      });
  }

  return overlay;
}
