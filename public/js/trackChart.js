export function renderComparisonChart( shortTermTracks, midTermTracks, longTermTracks) {
    const overlap = shortTermTracks.filter( name => longTermTracks.includes(name) || midTermTracks.includes(name));  
    const uniqueToShort = shortTermTracks.filter( name => !midTermTracks.includes(name) && !longTermTracks.includes(name)); 
    const uniqueToMedium = midTermTracks.filter (name => !shortTermTracks.includes(name) && !longTermTracks.includes(name))
    const uniqueToLong = longTermTracks.filter( name => !shortTermTracks.includes(name) && !midTermTracks.includes(name))

    const ctx = document.getElementById("comparisonChart").getContext("2d");

    // Destroy previous chart if it exists
    if (window.trackComparisonChart) {
        window.trackComparisonChart.destroy();
    }

    window.trackComparisonChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Core Rotation", "New Additions", "Faded Stars" , "Retired Favorites"],
            datasets: [{
                label: "Track Counts",
                data: [overlap.length, uniqueToShort.length, uniqueToMedium.length , uniqueToLong.length],
                backgroundColor: ["#158443", "#1abc9c", "#f4d03f", "#e74c3c"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Track Comparison"
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