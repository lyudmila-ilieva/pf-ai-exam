const revenueInput = document.getElementById('revenue');
const aovInput = document.getElementById('aov');
const leadRateInput = document.getElementById('leadRate');
const prospectRateInput = document.getElementById('prospectRate');

const leadRateLabel = document.getElementById('lbl-leadRate');
const prospectRateLabel = document.getElementById('lbl-prospectRate');

const prospectsValue = document.getElementById('val-prospects');
const leadsValue = document.getElementById('val-leads');
const customersValue = document.getElementById('val-customers');
const prospectsFill = document.getElementById('fill-prospects');
const leadsFill = document.getElementById('fill-leads');
const customersFill = document.getElementById('fill-customers');
const percentLeads = document.getElementById('perc-leads');
const percentCustomers = document.getElementById('perc-customers');
const percentProspects = document.getElementById('perc-prospects');

const barsContainer = document.getElementById('barsContainer');
const xAxis = document.getElementById('xAxis');
const gridLines = document.getElementById('gridLines');
const chartArea = document.getElementById('chartArea');
const tooltip = document.getElementById('tooltip');

const months = [1, 2, 3, 4, 5, 6];

function formatPercent(value) {
    return `${value.toFixed(2)}%`;
}

function calculateMetrics() {
    const revenue = parseFloat(revenueInput.value) || 0;
    const aov = parseFloat(aovInput.value) || 1;
    const leadRate = parseFloat(leadRateInput.value) || 1;
    const prospectRate = parseFloat(prospectRateInput.value) || 1;

    // Формула 01
    const customers = Math.max(0, Math.round(revenue / aov));
    // Формула 02
    const leads = Math.max(0, Math.round(customers * 100 / leadRate));
    // Формула 03
    const prospects = Math.max(0, Math.round(leads * 100 / prospectRate));

    leadRateLabel.textContent = formatPercent(leadRate);
    prospectRateLabel.textContent = formatPercent(prospectRate);

    prospectsValue.textContent = prospects;
    leadsValue.textContent = leads;
    customersValue.textContent = customers;

    const leadsPercent = prospects > 0 ? Math.round((leads / prospects) * 100) : 0;
    const customersPercent = prospects > 0 ? Math.round((customers / prospects) * 100) : 0;
    percentLeads.textContent = `${leadsPercent}%`;
    percentCustomers.textContent = `${customersPercent}%`;
    percentProspects.textContent = `100%`;

    prospectsFill.style.width = '100%';
    leadsFill.style.width = `${leadsPercent}%`;
    customersFill.style.width = `${customersPercent}%`;

    renderChart(prospects, leads, customers);
}

function renderChart(prospects, leads, customers) {
    barsContainer.innerHTML = '';
    xAxis.innerHTML = '';
    gridLines.innerHTML = '';

    // Always use 0,20,40,60,80,100,120 for x-axis
    const xMarkers = [0, 20, 40, 60, 80, 100, 120];
    const total = 120;
    for (let i = 0; i < xMarkers.length; i++) {
        const value = xMarkers[i];
        const marker = document.createElement('span');
        marker.textContent = `${value} people`;
        xAxis.appendChild(marker);
        if (i < xMarkers.length - 1) {
            const gridLine = document.createElement('div');
            gridLine.className = 'grid-line';
            gridLines.appendChild(gridLine);
        }
    }

    months.forEach((month) => {
        const monthProspects = Math.round(prospects * (month / 6));
        const monthLeads = Math.round(leads * (month / 6));
        const monthCustomers = Math.round(customers * (month / 6));

        const prospectWidth = total ? Math.min((monthProspects / total) * 100, 100) : 0;
        const leadWidth = monthProspects ? Math.min((monthLeads / monthProspects) * 100, 100) : 0;
        const customerWidth = monthLeads ? Math.min((monthCustomers / monthLeads) * 100, 100) : 0;

        const row = document.createElement('div');
        row.className = 'bar-row';
        row.dataset.month = month;

        const track = document.createElement('div');
        track.className = 'bar-track';

        const prospectSegment = document.createElement('div');
        prospectSegment.className = 'bar-segment bar-prospects';
        prospectSegment.style.width = `${prospectWidth}%`;

        const leadSegment = document.createElement('div');
        leadSegment.className = 'bar-segment bar-leads';
        leadSegment.style.width = `${leadWidth}%`;

        const customerSegment = document.createElement('div');
        customerSegment.className = 'bar-segment bar-customers';
        customerSegment.style.width = `${customerWidth}%`;

        leadSegment.appendChild(customerSegment);
        prospectSegment.appendChild(leadSegment);
        track.appendChild(prospectSegment);
        row.appendChild(track);

        row.addEventListener('mouseenter', (e) => {
            tooltip.innerHTML = `Month #${month}<br>Prospects: ${monthProspects}<br>Leads: ${monthLeads}<br>Customers: ${monthCustomers}`;
            tooltip.style.display = 'block';
        });
        row.addEventListener('mousemove', (e) => {
            const rect = chartArea.getBoundingClientRect();
            tooltip.style.left = (e.clientX - rect.left + 20) + 'px';
            tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
        });
        row.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        barsContainer.appendChild(row);
    });
}

[revenueInput, aovInput, leadRateInput, prospectRateInput].forEach((input) => {
    input.addEventListener('input', calculateMetrics);
});
window.addEventListener('DOMContentLoaded', calculateMetrics);
