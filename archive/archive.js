document.addEventListener('DOMContentLoaded', function() {
    fetchSeasons();
});

async function fetchSeasons() {
    try {
        const response = await fetch('/seasons-data.json');
        if (!response.ok) {
            // Try with relative path as fallback
            const fallbackResponse = await fetch('../seasons-data.json');
            if (!fallbackResponse.ok) {
                throw new Error('Failed to fetch seasons data');
            }
            return await fallbackResponse.json();
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
        
        // Clear loading message
        grid.innerHTML = '';
        
        // Sort seasons in descending order (newest first)
        const sortedSeasons = [...seasons].sort((a, b) => b.number - a.number);
        
        sortedSeasons.forEach(season => {
            const card = document.createElement('div');
            card.className = 'season-card';
            
            // Fix paths for GitHub Pages
            const basePath = '/seasons/';
            const relativePath = '../seasons/';
            
            card.innerHTML = `
                <a href="${basePath}season${season.number}/index.html" 
                   onclick="tryNavigate(event, '${basePath}season${season.number}/index.html', '${relativePath}season${season.number}/index.html')">
                    <div class="card-image">
                        <img src="${basePath}season${season.number}/images/Poster.jpg" 
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

// Helper function for navigating with fallback paths
function tryNavigate(event, primaryPath, fallbackPath) {
    event.preventDefault();
    
    // Try the primary path first
    fetch(primaryPath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                window.location.href = primaryPath;
            } else {
                window.location.href = fallbackPath;
            }
        })
        .catch(() => {
            window.location.href = fallbackPath;
        });
}

// Start displaying seasons
displaySeasons();
