
// Data for participants
let participants = [];

// Function to update the leaderboard
function updateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    participants.sort((a, b) => b.value - a.value); // Sort by portfolio value

    participants.forEach(participant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.name}</td>
            <td>${participant.value.toFixed(2)}</td>
        `;
        leaderboardBody.appendChild(row);
    });

    // Save leaderboard to localStorage
    localStorage.setItem('leaderboard', JSON.stringify(participants));
}

// Handle form submission
document.getElementById('tradeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const value = parseFloat(document.getElementById('value').value);

    // Check if the participant already exists
    const existingParticipant = participants.find(p => p.name === name);
    if (existingParticipant) {
        existingParticipant.value = value; // Update value
    } else {
        participants.push({ name, value }); // Add new participant
    }

    updateLeaderboard();
    this.reset();
});

// Load leaderboard from localStorage
window.onload = function () {
    const savedParticipants = localStorage.getItem('leaderboard');
    if (savedParticipants) {
        participants = JSON.parse(savedParticipants);
        updateLeaderboard();
    }
};

// Set competition end time (e.g., 24 hours from now)
const competitionEndTime = new Date().getTime() + 24 * 60 * 60 * 1000;

function updateTimer() {
    const now = new Date().getTime();
    const timeLeft = competitionEndTime - now;

    if (timeLeft > 0) {
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("timer").innerText = `${hours}h ${minutes}m ${seconds}s`;
    } else {
        document.getElementById("timer").innerText = "Competition Over!";
    }
}

// Update the timer every second
setInterval(updateTimer, 1000);

// Example of fetching stock prices
async function fetchStockPrices() {
    const apiKey = 'YOUR_API_KEY'; // Replace with your API key
    const symbol = 'AAPL'; // Example stock symbol
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const price = data['Global Quote']['05. price'];

        document.getElementById('stockPrices').innerHTML = `
            <li>${symbol}: $${parseFloat(price).toFixed(2)}</li>
        `;
    } catch (error) {
        console.error('Error fetching stock prices:', error);
    }
}

// Fetch prices every minute
setInterval(fetchStockPrices, 60000);
fetchStockPrices();
