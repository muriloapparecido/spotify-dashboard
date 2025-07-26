export function renderComparisonChart( shortTermTracks, longTermTracks) {
    const overlap = shortTermTracks.filter( name => longTermTracks.includes(name)); 
    const uniqueToShort = shortTermTracks.filter( name => !longTermTracks.includes(name)); 
    const uniqueToLong = longTermTracks.filter( name => !shortTermTracks.includes(name))

    const ctx = document.getElementById("comparisonChart").getContext("2d");

    // Destroy previous chart if it exists
    if (window.trackComparisonChart) {
        window.trackComparisonChart.destroy();
    }

    window.trackComparisonChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Overlap", "Short-Term Only", "Long-Term Only"],
            datasets: [{
                label: "Track Counts",
                data: [overlap.length, uniqueToShort.length, uniqueToLong.length],
                backgroundColor: ["#1db954", "#f39c12", "#e74c3c"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Track Comparison: Short-Term vs Long-Term"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff', 
                        precision: 0
                    }
                }
            }
        }
    }); 
}