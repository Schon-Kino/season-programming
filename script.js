document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.querySelector('.grid-container');
    const horizontalLinesContainer = document.querySelector('.horizontal-lines');
    const movieTextsContainer = document.querySelector('.movie-texts');
    const rows = 12;
    const columns = 12;
    
    // Define start and end colors for gradient
    const startColor = [255, 186, 203]; // Light pink
    const endColor = [255, 36, 106];    // Dark pink
    
    // Define opposite gradient colors for text (contrasting with the grid gradient)
    const textStartColor = [0, 0, 0];
    const textEndColor = [0, 0, 0];  
    
    // Store colors for each row to reference later
    const rowColors = [];
    const textColors = [];
    
    // Define movies data with S-pattern positioning first
    const movies = [
        {
            title: "The Fire Within",
            director: "Werner Herzog",
            date: "30/4",
            year: "2022",
            position: [1, 8],  // [row, column] coordinates in the grid
            width: 3,          // Width in grid cells
            height: 3          // Height in grid cells
        },
        {
            title: "Where is the Friend's House?",
            director: "Abbas Kiarostami",
            date: "7/5",
            year: "1987",
            position: [5, 1],
            width: 5,
            height: 2
        },
        {
            title: "Short & Sweet",
            director: "Various Directors",
            date: "14/5",
            year: "",
            position: [5, 7],
            width: 3,
            height: 4
        },
        {
            title: "Happy-Go-Lucky",
            director: "Mike Leigh",
            date: "21/5",
            year: "2008",
            position: [8, 2],
            width: 3,
            height: 3
        },
        {
            title: "Daisies",
            director: "Vera Chytilová",
            date: "28/5",
            year: "1966",
            position: [10, 6],
            width: 4,
            height: 2
        }
    ];
    
    // Function to check if a cell should be skipped (will be replaced by a movie)
    function shouldSkipCell(row, col) {
        for (const movie of movies) {
            const [movieRow, movieCol] = movie.position;
            const width = movie.width || 1;
            const height = movie.height || 1;
            
            if (row >= movieRow && row < movieRow + height && 
                col >= movieCol && col < movieCol + width) {
                return true;
            }
        }
        return false;
    }
    
    // Create grid cells with gradient color
    for (let row = 0; row < rows; row++) {
        // Calculate gradient color for this row
        const ratio = row / (rows - 1);
        
        // Calculate background color
        const r = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]));
        const g = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]));
        const b = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]));
        const cellColor = `rgb(${r}, ${g}, ${b})`;
        
        // Calculate opposite text color
        const textR = Math.round(textStartColor[0] + ratio * (textEndColor[0] - textStartColor[0]));
        const textG = Math.round(textStartColor[1] + ratio * (textEndColor[1] - textStartColor[1]));
        const textB = Math.round(textStartColor[2] + ratio * (textEndColor[2] - textStartColor[2]));
        const textColor = `rgb(${textR}, ${textG}, ${textB})`;
        
        // Store colors for later use
        rowColors.push(cellColor);
        textColors.push(textColor);
        
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.backgroundColor = cellColor;
            
            // Check if a movie will be placed here, if so, add a data attribute
            const isMovieCell = shouldSkipCell(row, col);
            if (isMovieCell) {
                cell.dataset.movieCell = 'true';
                cell.style.opacity = '0'; // Hide this cell as movie text will replace it
            }
            
            gridContainer.appendChild(cell);
        }
    }
    
    // Create horizontal lines that are separate from the grid
    for (let i = 0; i <= rows; i++) {
        const line = document.createElement('div');
        line.className = 'horizontal-line';
        
        // Position the line
        const position = (i / rows) * 100;
        line.style.top = `${position}%`;
        
        horizontalLinesContainer.appendChild(line);
    }
    
    // Place movie texts in S-pattern, perfectly aligned to grid
    movies.forEach((movie) => {
        const [row, col] = movie.position;
        
        const movieText = document.createElement('div');
        movieText.className = 'movie-text';
        
        // Add HTML content with date prominent for the grid display and colored title
        movieText.innerHTML = `
            <strong style="color: ${textColors[row]}">${movie.date} ${movie.title}</strong><br>
            <span class="movie-date-small">${movie.director} ${movie.year}</span>
        `;
        
        // Use the same gap size as defined in CSS
        const gapSize = 2;
        
        // Calculate cell size (percentage)
        const cellWidth = 100 / columns;
        const cellHeight = 100 / rows;
        
        // Calculate position (percentage)
        const top = (row * cellHeight);
        const left = (col * cellWidth);
        
        // Calculate size (percentage)
        const width = movie.width * cellWidth - gapSize;
        const height = movie.height * cellHeight - gapSize;
        
        // Get the background color from the corresponding row
        const bgColor = rowColors[row];
        
        movieText.style.top = `${top}%`;
        movieText.style.left = `${left}%`;
        movieText.style.width = `${width}%`;
        movieText.style.height = `${height}%`;
        movieText.style.backgroundColor = bgColor;
        
        // This ensures the movie rectangle is positioned within the grid
        movieText.style.margin = `${gapSize/2}px`;
        
        movieTextsContainer.appendChild(movieText);
    });

    // Add this function to the end of your DOMContentLoaded event handler
    function adjustTextSizes() {
        const container = document.querySelector('.container');
        const containerWidth = container.offsetWidth;
        
        // Increase these multipliers to make text bigger
        const movieTextSize = containerWidth * 0.032;  // Increase this value to make text larger
        const dateTextSize = containerWidth * 0.020;   // Increase this value to make text larger
        const titleSize = containerWidth * 0.16;       // For the schön.kino title
        
        // Apply to all movie texts
        const movieTexts = document.querySelectorAll('.movie-text strong');
        const dateTexts = document.querySelectorAll('.movie-date-small');
        const titleTexts = document.querySelectorAll('.text-overlay h1');
        
        movieTexts.forEach(text => {
            text.style.fontSize = `${movieTextSize}px`;
        });
        
        dateTexts.forEach(text => {
            text.style.fontSize = `${dateTextSize}px`;
        });
        
        titleTexts.forEach(title => {
            title.style.fontSize = `${titleSize}px`;
        });
    }

    // Add these event listeners
    window.addEventListener('load', adjustTextSizes);
    window.addEventListener('resize', adjustTextSizes);
});