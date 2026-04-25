import { renderTable } from "../components/table.js";
import { renderCustomerForm } from "../components/customerForm.js";
import { fetchCustomers, deleteCustomer, updateCustomer, createCustomer } from "../services/api.js";
import "../styles/pages/customerpage.css";
import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { renderSearchBar } from "../components/searchBar.js";

let customersData = [];

function renderToContainer(container, data) {
  const tableEl = renderTable(data, { 
    className: "my-table",
    columns: ['id', 'name', 'dob', 'nic', 'mobiles', 'addresses', 'familyMembers', 'actions'], 
    headers: {
      id: 'ID',
      name: 'Customer Name',
      dob: 'Date of Birth',
      nic: 'NIC Number',
      mobiles: 'Contact Numbers',
      addresses: 'Addresses',
      familyMembers: 'Family Members',
      actions: 'Actions'
    },
    formatters: {
      mobiles: (val) => {
        if (!val || !Array.isArray(val) || val.length === 0) return '-';
        return val.map(m => {
          return typeof m === 'string' ? m : (m.mobile || '');
        }).filter(Boolean).join('<br/>');
      },
      addresses: (val) => {
        if (!val || !Array.isArray(val) || val.length === 0) return '-';
        return val.map(a => {
          const parts = [a.line1, a.line2].filter(Boolean);
          return parts.join(', ');
        }).filter(Boolean).join('<br/><br/>');
      },
      familyMembers: (val) => {
        if (!val || !Array.isArray(val) || val.length === 0) return '-';
        return val.map(f => f.name).join(', ');
      },
      actions: (val, row) => {
        return `
          <button class="btn-edit" data-id="${row.id}">Edit</button>
          <button class="btn-delete" data-id="${row.id}">Delete</button>
        `;
      }
    }
  });
  container.innerHTML = '';
  container.appendChild(tableEl);
}

function loadTableData(container) {
  container.innerHTML = "<p>Loading customers...</p>";
  fetchCustomers()
    .then((data) => {
      customersData = data;
      renderToContainer(container, data);
    })
    .catch((err) => {
      console.error("Failed to load customers", err);
      container.innerHTML = "<p style='color:red;'>Unable to load customers.</p>";
    });
}

function showForm(customer = {}) {
  const formOverlay = renderCustomerForm(
    customer,
    (payload) => {
      const request = customer.id 
        ? updateCustomer(customer.id, payload)
        : createCustomer(payload);

      request
        .then(() => {
          formOverlay.remove();
          loadTableData(document.getElementById('table-container'));
        })
        .catch(err => {
          alert("Failed to save customer. NIC might be duplicate.");
        });
    },
    () => {
      formOverlay.remove();
    },
    customersData
  );
  document.body.appendChild(formOverlay);
}

function initCustomerPage() {
  // Setup body layout for sticky footer and fixed height
  document.body.innerHTML = '';
  document.body.style.margin = '0';
  document.body.style.display = 'flex';
  document.body.style.flexDirection = 'column';
  document.body.style.height = '100vh'; // Lock to viewport
  document.body.style.overflow = 'hidden'; // No page scroll — internal only
  
  // Render Header
  document.body.appendChild(renderHeader());

  const root = document.createElement("main");
  root.id = "customer-page";
  root.style.flex = '1';
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.minWidth = '0'; // Flexbox fix
  
  // Use CSS class for padding instead of inline for responsiveness
  root.className = 'responsive-main';

  const header = document.createElement("div");
  header.className = "header";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "15px";
  header.style.flexShrink = '0';
  
  const container = document.createElement("div");
  container.id = "table-container";
  container.className = "table-container-flex";

  // Use SearchBar component
  const searchBar = renderSearchBar(
    (term) => {
      const lowerTerm = term.toLowerCase();
      const filtered = customersData.filter(c => 
        c.name.toLowerCase().includes(lowerTerm) || 
        c.nic.toLowerCase().includes(lowerTerm)
      );
      renderToContainer(container, filtered);
    },
    () => {
      console.log("Filter clicked");
    }
  );
  header.appendChild(searchBar);

  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Add New Customer";
  addBtn.className = "btn-primary";
  
  header.appendChild(addBtn);
  root.appendChild(header);

  root.appendChild(container);
  document.body.appendChild(root);

  // Render Footer
  document.body.appendChild(renderFooter());

  addBtn.addEventListener("click", () => {
    showForm({ name: '', dob: '', nic: '', mobiles: [], addresses: [] });
  });

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const id = e.target.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this customer?')) {
        deleteCustomer(id)
          .then(() => loadTableData(container))
          .catch(err => alert("Failed to delete customer"));
      }
    } else if (e.target.classList.contains('btn-edit')) {
      const id = e.target.getAttribute('data-id');
      const customer = customersData.find(c => c.id == id);
      if (customer) {
        showForm(customer);
      }
    }
  });

  loadTableData(container);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCustomerPage);
} else {
  initCustomerPage();
}
