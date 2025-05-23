document.addEventListener('DOMContentLoaded', function() {
    fetchSeasons();
});

async function fetchSeasons() {
    try {
        // Try both absolute and relative paths
        let response = await fetch('/seasons-data.json');
        if (!response.ok) {
            response = await fetch('../seasons-data.json');
            if (!response.ok) {
                throw new Error('Failed to fetch seasons data');
            }
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading seasons data:', error);
        document.getElementById('seasons-grid').innerHTML = 
            '<div class="error">Could not load seasons. Please try again later.</div>';
        return { seasons: [] };
    }
}

async function displaySeasons() {
    try {
        const data = await fetchSeasons();
        const seasons = data.seasons || [];
        
        const grid = document.getElementById('seasons-grid');
        grid.innerHTML = '';
        
        // Sort seasons in descending order (newest first)
        const sortedSeasons = [...seasons].sort((a, b) => b.number - a.number);
        
        // Determine if we're in a GitHub Pages subpath deployment
        const basePath = document.location.pathname.includes('season-programming') ? 
                        '/season-programming' : '';
        
        sortedSeasons.forEach(season => {
            const card = document.createElement('div');
            card.className = 'season-card';
            
            card.innerHTML = `
                <a href="${basePath}/seasons/season${season.number}/">
                    <div class="card-image">
                        <img src="${basePath}/seasons/season${season.number}/images/Poster.jpg" 
                             alt="Season ${season.number} Poster" 
                             onerror="this.onerror=null; this.src='placeholder.jpg'">
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
    } catch (error) {
        console.error('Error displaying seasons:', error);
    }
}

// Start displaying seasons
displaySeasons();
