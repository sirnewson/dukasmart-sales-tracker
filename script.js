// DukaSales Tracker JavaScript
// Keeps track of sales, updates summary metrics and chart in real time.

// Array to hold all sale records
const sales = [];

// Chart instance variable
let salesChart;

/**
 * Update summary metrics based on current sales data.
 */
function updateMetrics() {
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.quantity * sale.price, 0);
  const averageSale = totalSales === 0 ? 0 : totalRevenue / totalSales;

  document.getElementById('total-sales').textContent = totalSales;
  document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);
  document.getElementById('average-sale').textContent = averageSale.toFixed(2);
}

/**
 * Render the sales table with current data.
 */
function renderTable() {
  const tbody = document.getElementById('sales-table-body');
  tbody.innerHTML = '';
  sales.forEach((sale) => {
    const tr = document.createElement('tr');
    const total = sale.quantity * sale.price;
    tr.innerHTML = `
      <td>${sale.product}</td>
      <td>${sale.quantity}</td>
      <td>${sale.price.toFixed(2)}</td>
      <td>${total.toFixed(2)}</td>
      <td>${sale.date}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Prepare and render the sales chart using Chart.js.
 * Aggregates revenue per product and updates chart datasets.
 */
function renderChart() {
  // Aggregate revenue by product
  const revenueByProduct = {};
  sales.forEach((sale) => {
    const revenue = sale.quantity * sale.price;
    if (revenueByProduct[sale.product]) {
      revenueByProduct[sale.product] += revenue;
    } else {
      revenueByProduct[sale.product] = revenue;
    }
  });
  const labels = Object.keys(revenueByProduct);
  const data = Object.values(revenueByProduct).map((val) => parseFloat(val.toFixed(2)));

  const ctx = document.getElementById('salesChart').getContext('2d');

  // Destroy previous chart instance if exists to avoid duplicates
  if (salesChart) {
    salesChart.destroy();
  }

  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Revenue per Product (KES)',
          data,
          backgroundColor: '#0070f3',
          borderColor: '#005ac1',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#e0eaff',
          },
          grid: {
            color: 'rgba(255,255,255,0.1)',
          },
        },
        x: {
          ticks: {
            color: '#e0eaff',
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#e0eaff',
          },
        },
      },
    },
  });
}

/**
 * Handle form submission: add a new sale and refresh UI elements.
 * @param {Event} e The form submit event
 */
function handleFormSubmit(e) {
  e.preventDefault();
  const product = document.getElementById('product-name').value.trim();
  const quantity = parseInt(document.getElementById('quantity').value, 10);
  const price = parseFloat(document.getElementById('unit-price').value);
  const date = document.getElementById('sale-date').value;
  if (!product || !quantity || !price || !date) {
    alert('Please fill out all fields.');
    return;
  }
  sales.push({ product, quantity, price, date });
  // Reset form
  e.target.reset();
  updateMetrics();
  renderTable();
  renderChart();
}

// Initialize event listeners once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('sale-form').addEventListener('submit', handleFormSubmit);
  // Initialize empty chart on load
  renderChart();
});
