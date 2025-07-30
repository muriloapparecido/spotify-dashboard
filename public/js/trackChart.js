export function renderComparisonChart( shortTermTracks, midTermTracks, longTermTracks) {
    document.getElementById("chartLoader").style.display = "flex"; 
    document.getElementById("chartContainer").style.display = "none"; 

    // Simulate async loading
    setTimeout(() => {
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
                    tooltip: {  
                        callbacks: {
                            // Customizes the label shown on hover
                            label: function(context) {
                                const index = context.dataIndex;
                
                                const songLists = [
                                    overlap,            // Core Rotation
                                    uniqueToShort,      // New Additions
                                    uniqueToMedium,     // Faded Stars
                                    uniqueToLong        // Retired Favorites
                                ];
                
                                const categorySongs = songLists[index];
                
                                if (categorySongs.length === 0) {
                                    return "No songs";
                                }
                
                                // Get first 8 songs and format them as bullet points
                                const formatted = categorySongs.slice(0, 8).map((song) => `• ${song}`);
                                // If more than 10 songs, let the user know how many are hidden
                                const extra = categorySongs.length > 8
                                    ? [`...and ${categorySongs.length - 8} more`] 
                                    : [];
                
                                // Return an array: the first line shows the count, the rest are song names
                                return [
                                    `${context.label}: ${categorySongs.length} tracks`, 
                                    ...formatted, 
                                    ...extra
                                ];
                            }
                        }
                    }, 
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

        //Hide loader, show chart
        //document.getElementById("chartLoader").style.display = "none"; 
        //document.getElementById("chartContainer").style.display = "flex"
    }, 300); 
}