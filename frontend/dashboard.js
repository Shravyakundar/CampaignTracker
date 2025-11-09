console.log(" Dashboard JS loaded");
const API_URL = 'http://localhost:8081/api/campaigns';
const form = document.getElementById('campaignForm');
const list = document.getElementById('campaignList');
const filterStatus = document.getElementById('filterStatus');
let chart;

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    title: title.value,
    client: client.value,
    startDate: startDate.value,
    status: 'Active'
  };

  await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });

  form.reset();
  fetchCampaigns();
});

async function fetchCampaigns() {
  const res = await fetch(API_URL);
  let campaigns = await res.json();

  const status = filterStatus.value;
  if (status !== 'All') campaigns = campaigns.filter(c => c.status === status);
  localStorage.setItem('lastFilter', status);

  updateChart(campaigns);
  list.innerHTML = '';

  campaigns.forEach(c => {
    list.innerHTML += `
      <tr>
        <td>${c.title}</td>
        <td>${c.client}</td>
        <td>${c.startDate}</td>
        <td>${c.status}</td>
        <td>
          <button onclick="updateStatus('${c._id}', 'Active')">▶</button>
          <button onclick="updateStatus('${c._id}', 'Paused')">⏸</button>
          <button onclick="updateStatus('${c._id}', 'Completed')">✅</button>
          <button onclick="deleteCampaign('${c._id}')">🗑</button>
        </td>
      </tr>`;
  });
}

function updateChart(campaigns) {
  const counts = { Active: 0, Paused: 0, Completed: 0 };
  campaigns.forEach(c => counts[c.status]++);
  const data = [counts.Active, counts.Paused, counts.Completed];
  const ctx = document.getElementById('statusChart').getContext('2d');

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Active', 'Paused', 'Completed'],
      datasets: [{ data, backgroundColor: ['#27ae60', '#f1c40f', '#e74c3c'] }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
}

async function updateStatus(id, status) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ status })
  });
  fetchCampaigns();
}

async function deleteCampaign(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchCampaigns();
}

filterStatus.addEventListener('change', fetchCampaigns);
filterStatus.value = localStorage.getItem('lastFilter') || 'All';
fetchCampaigns();
