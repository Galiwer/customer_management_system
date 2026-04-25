
import { renderTable } from "../components/table.js";
import { fetchCustomers } from "../services/api.js";

function initCustomerPage() {

  const root = document.createElement("div");
  root.id = "customer-page";

  const container = document.createElement("div");
  container.id = "table-container";
  root.appendChild(container);

  document.body.appendChild(root);

  fetchCustomers()
    .then((data) => {
      
      const tableEl = renderTable(data, { 
        className: "my-table",
        columns: ['id', 'name', 'dob', 'nic', 'mobiles', 'addresses'], 
        headers: {
          id: 'ID',
          name: 'Customer Name',
          dob: 'Date of Birth',
          nic: 'NIC Number',
          mobiles: 'Contact Numbers',
          addresses: 'Addresses'
        },
        formatters: {
          
          mobiles: (val) => {
            if (!val || val.length === 0) return '-';
            return val.map(m => m.mobile).join('<br/>');
          },
          
          addresses: (val) => {
            if (!val || val.length === 0) return '-';
            return val.map(a => {
             
              const parts = [a.line1, a.line2, a.cityName, a.countryName].filter(Boolean);
              return parts.join(', ');
            }).join('<br/><br/>');
          }
        }
      });
      container.appendChild(tableEl);
    })
    .catch((err) => {
      console.error("Failed to load customers", err);
      container.textContent = "Unable to load customers.";
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCustomerPage);
} else {
  initCustomerPage();
}
