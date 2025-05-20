document.addEventListener('DOMContentLoaded', function() {
    fetchSeasons();
});

async function fetchSeasons() {
    try {
        const response = await fetch('../seasons-data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch seasons data');
        }

        const data = await response.json();
        displaySeasons(data.seasons);
    } catch (error) {
        console.error('Error loading seasons data:', error);
        document.getElementById('seasons-grid').innerHTML = 
            '<div class="error">Could not load seasons. Please try again later.</div>';
    }
}

function displaySeasons(seasons) {
    const grid = document.getElementById('seasons-grid');
    
    // Clear loading message
    grid.innerHTML = '';
    
    // Sort seasons in descending order (newest first)
    const sortedSeasons = [...seasons].sort((a, b) => b.number - a.number);
    
    sortedSeasons.forEach(season => {
        const card = document.createElement('div');
        card.className = 'season-card';
        
        const posterPath = season.poster || 'default-poster.jpg';
        
        card.innerHTML = `
            <a href="../seasons/season${season.number}/index.html">
                <div class="card-image">
                    <img src="../seasons/season${season.number}/images/Poster.jpg" 
                         alt="Season ${season.number} Poster" 
                         onerror="this.src='placeholder.jpg'">
                </div>
                <div class="card-content">
                    <div class="season-number">Season ${season.number}</div>
                    <div class="season-theme">${season.theme}</div>
                </div>
            </a>
        `;
        
        grid.appendChild(card);
    });
    
    // If no seasons found
    if (sortedSeasons.length === 0) {
        grid.innerHTML = '<div class="loading">No seasons found.</div>';
    }
}
