import '../styles/components/table.css';

export function renderTable(data = [], options = {}) {
  const { className = '', columns, headers = {} } = options;

  if (!Array.isArray(data) || data.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = `simple-table ${className}`;
    placeholder.textContent = 'No data available.';
    return placeholder;
  }

  const tableCols = columns || Object.keys(data[0]);

  const table = document.createElement('table');
  table.className = `simple-table ${className}`;

  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  tableCols.forEach(col => {
    const th = document.createElement('th');
   
    th.textContent = headers[col] || col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  
  const tbody = document.createElement('tbody');
  data.forEach(row => {
    const tr = document.createElement('tr');
    tableCols.forEach(col => {
      const td = document.createElement('td');
      
      const val = row[col];
      
      if (options.formatters && options.formatters[col]) {
        
        td.innerHTML = options.formatters[col](val, row);
      } else if (typeof val === 'object' && val !== null) {
       
        td.textContent = JSON.stringify(val);
      } else {
        td.textContent = val !== undefined ? val : '';
      }
      
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  
  const wrapper = document.createElement('div');
  wrapper.className = 'table-scroll-wrapper';
  wrapper.appendChild(table);

  return wrapper;
}
