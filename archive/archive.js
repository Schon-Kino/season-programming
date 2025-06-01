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
        
        // Log what we're about to display
        console.log('Displaying seasons:', sortedSeasons);
        
        sortedSeasons.forEach(season => {
            const card = document.createElement('div');
            card.className = 'season-card';
            
            // Generate a unique cache busting string
            const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 9);
            
            // Log the image URL we're creating
            const imagePath = `seasons/season${season.number}/images/Poster.jpg?v=${uniqueId}`;
            console.log(`Season ${season.number} image path: ${imagePath}`);
            
            card.innerHTML = `
                <a href="seasons/season${season.number}/">
                    <div class="card-image">
                        <img 
                            src="${imagePath}" 
                            alt="Season ${season.number} Poster" 
                            onerror="this.onerror=null; console.error('Failed to load image for season ${season.number}'); this.src='../images/placeholder.jpg'"
                        >
                    </div>
                    <div class="card-content">
                        <div class="season-number">Season ${season.number}</div>
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
