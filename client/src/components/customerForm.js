import '../styles/components/form.css';

export function renderCustomerForm(customer, onSubmit, onCancel, allCustomers = []) {
  
  const overlay = document.createElement('div');
  overlay.className = 'form-overlay';

  let mobiles = customer.mobiles ? [...customer.mobiles] : [];
  let addresses = customer.addresses ? [...customer.addresses] : [];
  let familyMemberIds = customer.familyMembers ? customer.familyMembers.map(f => f.id) : [];
  let familySearchTerm = '';

  const container = document.createElement('div');
  container.className = 'customer-form-container';
  overlay.appendChild(container);

  function render() {
    container.innerHTML = `
      <div class="form-header">
        <h3>${customer.id ? 'Edit Customer' : 'Create New Customer'}</h3>
        <button class="btn-close">&times;</button>
      </div>
      
      <div class="form-body">
        <div class="form-grid">
          <div class="form-group">
            <label>Full Name <span class="required">*</span></label>
            <input type="text" id="frm-name" value="${customer.name || ''}" placeholder="e.g. John Doe" />
          </div>
          <div class="form-group">
            <label>Date of Birth <span class="required">*</span></label>
            <input type="date" id="frm-dob" value="${formatDob(customer.dob)}" />
          </div>
          <div class="form-group">
            <label>NIC Number <span class="required">*</span></label>
            <input type="text" id="frm-nic" value="${customer.nic || ''}" placeholder="e.g. 951234567V" />
          </div>
        </div>

        <div class="section-title">
          <span>Contact Numbers</span>
          <button type="button" id="btn-add-mobile" class="btn-small">+ Add Mobile</button>
        </div>
        <div id="mobiles-list"></div>

        <div class="section-title">
          <span>Addresses</span>
          <button type="button" id="btn-add-address" class="btn-small">+ Add Address</button>
        </div>
        <div id="addresses-list"></div>

        <div class="section-title">
          <span>Family Members</span>
        </div>
        <div class="family-selection-area">
          <div class="family-search-input-wrapper">
            <input type="text" id="family-search" placeholder="Search by name or NIC..." value="${familySearchTerm}" />
          </div>
          <div class="family-table-container">
            <table class="family-table">
              <thead>
                <tr>
                  <th width="40"></th>
                  <th>Name</th>
                  <th>NIC</th>
                </tr>
              </thead>
              <tbody id="family-table-body"></tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="form-footer">
        <button type="button" id="frm-cancel" class="btn-large btn-ghost">Cancel</button>
        <button type="button" id="frm-save" class="btn-large btn-primary">${customer.id ? 'Save Changes' : 'Create Customer'}</button>
      </div>
    `;

    renderMobiles();
    renderAddresses();
    renderFamilyRows();
    attachEvents();
  }

  function formatDob(dob) {
    if (!dob) return '';
    if (Array.isArray(dob)) {
      const [y, m, d] = dob;
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    return dob;
  }

  function renderMobiles() {
    const list = container.querySelector('#mobiles-list');
    list.innerHTML = mobiles.map((m, i) => `
      <div class="form-row">
        <input type="text" class="mobile-input" data-index="${i}" value="${typeof m === 'string' ? m : (m.mobile || '')}" placeholder="07xxxxxxxx" />
        <button type="button" class="btn-remove-circle remove-mobile" data-index="${i}">&times;</button>
      </div>
    `).join('');
    if (mobiles.length === 0) list.innerHTML = '<p class="info-text">No mobile numbers added.</p>';
  }

  function renderAddresses() {
    const list = container.querySelector('#addresses-list');
    list.innerHTML = addresses.map((a, i) => `
      <div class="address-card">
        <button type="button" class="btn-remove-circle remove-address" data-index="${i}">&times;</button>
        <div class="address-grid">
          <div class="form-group" style="grid-column: span 2;">
            <label>Line 1</label>
            <input type="text" class="addr-line1" value="${a.line1 || ''}" placeholder="Street Address" />
          </div>
          <div class="form-group">
            <label>Line 2</label>
            <input type="text" class="addr-line2" value="${a.line2 || ''}" placeholder="Apt, Suite, etc." />
          </div>
          <div class="form-group">
            <label>City</label>
            <input type="text" class="addr-city" value="${a.cityName || ''}" placeholder="City" />
          </div>
          <div class="form-group">
            <label>Country</label>
            <input type="text" class="addr-country" value="${a.countryName || ''}" placeholder="Country" />
          </div>
        </div>
      </div>
    `).join('');
    if (addresses.length === 0) list.innerHTML = '<p class="info-text">No addresses added.</p>';
  }

  function renderFamilyRows() {
    const tbody = container.querySelector('#family-table-body');
    const filtered = allCustomers.filter(c => 
      c.id !== customer.id && 
      (c.name.toLowerCase().includes(familySearchTerm.toLowerCase()) || 
       c.nic.toLowerCase().includes(familySearchTerm.toLowerCase()))
    );

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><input type="checkbox" class="family-checkbox" value="${c.id}" ${familyMemberIds.includes(c.id) ? 'checked' : ''} /></td>
        <td>${c.name}</td>
        <td>${c.nic}</td>
      </tr>
    `).join('');

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 24px; color: #94a3b8;">No customers found</td></tr>';
    }
  }

  function syncState() {
    const mobInps = container.querySelectorAll('.mobile-input');
    mobiles = Array.from(mobInps).map(inp => inp.value);

    const addrCards = container.querySelectorAll('.address-card');
    addresses = Array.from(addrCards).map(card => ({
      line1: card.querySelector('.addr-line1').value,
      line2: card.querySelector('.addr-line2').value,
      cityName: card.querySelector('.addr-city').value,
      countryName: card.querySelector('.addr-country').value
    }));

    const checks = container.querySelectorAll('.family-checkbox');
    checks.forEach(chk => {
      const id = parseInt(chk.value, 10);
      if (chk.checked) {
        if (!familyMemberIds.includes(id)) familyMemberIds.push(id);
      } else {
        familyMemberIds = familyMemberIds.filter(fid => fid !== id);
      }
    });
  }

  function attachEvents() {
    
    container.querySelector('.btn-close').onclick = onCancel;
    container.querySelector('#frm-cancel').onclick = onCancel;
    container.querySelector('#frm-save').onclick = () => {
      syncState();
      const payload = {
        name: container.querySelector('#frm-name').value.trim(),
        dob: container.querySelector('#frm-dob').value,
        nic: container.querySelector('#frm-nic').value.trim(),
        mobiles: mobiles.filter(m => m.trim() !== ''),
        addresses: addresses.filter(a => a.line1.trim() !== ''),
        familyMemberIds: familyMemberIds
      };

      if (!payload.name || !payload.dob || !payload.nic) {
        alert("Please fill all mandatory fields (*)");
        return;
      }
      onSubmit(payload);
    };

    
    container.onclick = (e) => {
      const target = e.target;
      
     
      if (target.id === 'btn-add-mobile') {
        syncState();
        mobiles.push('');
        render();
      }
      
      else if (target.id === 'btn-add-address') {
        syncState();
        addresses.push({});
        render();
      }
      
      
      const removeMobBtn = target.closest('.remove-mobile');
      if (removeMobBtn) {
        syncState();
        const index = parseInt(removeMobBtn.getAttribute('data-index'), 10);
        mobiles.splice(index, 1);
        render();
      }
      
      
      const removeAddrBtn = target.closest('.remove-address');
      if (removeAddrBtn) {
        syncState();
        const index = parseInt(removeAddrBtn.getAttribute('data-index'), 10);
        addresses.splice(index, 1);
        render();
      }
    };

 
    const familySearch = container.querySelector('#family-search');
    if (familySearch) {
      familySearch.oninput = (e) => {
        syncState();
        familySearchTerm = e.target.value;
        renderFamilyRows();
      };
    }

    
    const searchInp = container.querySelector('#family-search');
    if (searchInp && document.activeElement && document.activeElement.id === 'family-search') {
      searchInp.focus();
      searchInp.setSelectionRange(familySearchTerm.length, familySearchTerm.length);
    }
  }

  render();
  return overlay;
}
