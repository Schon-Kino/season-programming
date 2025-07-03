document.addEventListener('DOMContentLoaded', function() {
    displaySeasons();
});

async function fetchSeasons() {
    try {
        // Try to fetch seasons-data.json from the current directory first
        let response = await fetch('seasons-data.json');
        if (!response.ok) {
            // If not found, try parent directory
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
        
        sortedSeasons.forEach(season => {
            const card = document.createElement('div');
            card.className = 'season-card';
            
            const seasonNum = season.number;
            const timestamp = Date.now();
            
            card.innerHTML = `
                <a href="../seasons/season${seasonNum}/">
                    <div class="card-image">
                        <img 
                            src="../seasons/season${seasonNum}/images/poster-season${seasonNum}.png?t=${timestamp}" 
                            alt="Season ${seasonNum} Poster" 
                            onerror="this.onerror=null; this.src='../seasons/season${seasonNum}/images/poster-season${seasonNum}.jpg?t=${timestamp}'; this.onerror=function(){this.src='../images/placeholder.jpg';}"
                        >
                    </div>
                    <div class="card-content">
                        <div class="season-number">Season ${seasonNum}</div>
                        <div class="season-theme">${season.theme || ''}</div>
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
        document.getElementById('seasons-grid').innerHTML = 
            `<div class="error">Error loading seasons: ${error.message}</div>`;
    }
}
}
