const API_URL = 'http://localhost:8081/api/campaigns';
const table = document.getElementById('campaignTable');
const searchInput = document.getElementById('search');

document.getElementById('addBtn').addEventListener('click', addCampaign);
searchInput.addEventListener('input', loadCampaigns);

// ✅ Add a new campaign
async function addCampaign() {
  const title = document.getElementById('title').value.trim();
  const client = document.getElementById('client').value.trim();
  const startDate = document.getElementById('startDate').value;

  if (!title || !client || !startDate) {
    return alert('⚠️ All fields are required');
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, client, startDate, status: 'Active' })
    });

    if (res.ok) {
      alert('✅ Campaign added successfully');
      document.getElementById('title').value = '';
      document.getElementById('client').value = '';
      document.getElementById('startDate').value = '';
      loadCampaigns();
    } else {
      alert('❌ Failed to add campaign');
    }
  } catch (error) {
    console.error('Error adding campaign:', error);
    alert('❌ Error adding campaign');
  }
}

// ✅ Load all campaigns and update the counts
async function loadCampaigns() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const filter = searchInput.value.toLowerCase();
    table.innerHTML = '';

    let activeCount = 0, pausedCount = 0, completedCount = 0;

    data
      .filter(c => c.title.toLowerCase().includes(filter) || c.client.toLowerCase().includes(filter))
      .forEach(campaign => {
        if (campaign.status === 'Active') activeCount++;
        else if (campaign.status === 'Paused') pausedCount++;
        else if (campaign.status === 'Completed') completedCount++;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${campaign.title}</td>
          <td>${campaign.client}</td>
          <td>${new Date(campaign.startDate).toLocaleDateString()}</td>
          <td>
            <select onchange="updateStatus('${campaign._id}', this.value)">
              <option value="Active" ${campaign.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Paused" ${campaign.status === 'Paused' ? 'selected' : ''}>Paused</option>
              <option value="Completed" ${campaign.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </td>
          <td><button onclick="deleteCampaign('${campaign._id}')">Delete</button></td>
        `;
        table.appendChild(row);
      });

    // ✅ Update count boxes dynamically
    document.getElementById('activeCount').innerText = activeCount;
    document.getElementById('pausedCount').innerText = pausedCount;
    document.getElementById('completedCount').innerText = completedCount;
  } catch (error) {
    console.error('Error loading campaigns:', error);
    alert('❌ Failed to load campaigns');
  }
}

// ✅ Update campaign status
async function updateStatus(id, newStatus) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) throw new Error('Failed');

    alert('✅ Status updated successfully');
    loadCampaigns(); // ✅ reload list + update counts dynamically
  } catch (error) {
    console.error('Error updating status:', error);
    alert('❌ Failed to update status');
  }
}

// ✅ Delete a campaign
async function deleteCampaign(id) {
  if (confirm('🗑️ Delete this campaign?')) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) loadCampaigns();
      else alert('❌ Failed to delete');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('❌ Error deleting campaign');
    }
  }
}

// ✅ Load campaigns on page load
loadCampaigns();
