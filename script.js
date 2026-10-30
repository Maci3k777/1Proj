const playerName = "Alex";
const age = 16;

console.log(`${playerName} is ${age} years old.`);

const darkModeButton = document.querySelector("#dark");

darkModeButton.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    darkModeButton.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
    darkModeButton.setAttribute("aria-pressed", String(isDarkMode));
});

const favoriteDriverSelect = document.querySelector("#favorite-driver");
const favoriteStatsCard = document.querySelector("#favorite-stats");

if (favoriteDriverSelect && favoriteStatsCard) {
    const favoriteDrivers = new Map();
    const podiumFinishes = new Map();

    document.querySelectorAll("#standings .podium").forEach((podium) => {
        const driverName = podium.querySelector("h2").textContent.trim();
        const finish = podium.querySelector("p").textContent.trim();
        podiumFinishes.set(driverName, finish);
    });

    let previousPoints = null;
    let teamPosition = 0;

    document.querySelectorAll("#teams li").forEach((teamCard, index) => {
        const teamName = teamCard.querySelector("strong").textContent.trim();
        const drivers = teamCard.querySelector(":scope > span:first-of-type").textContent.trim().split(" and ");
        const teamPoints = teamCard.querySelector(".team-points").textContent.trim();
        const pointsValue = Number(teamPoints.replace(/[^\d]/g, ""));

        if (pointsValue !== previousPoints) {
            teamPosition = index + 1;
            previousPoints = pointsValue;
        }

        for (const driverName of drivers) {
            favoriteDrivers.set(driverName, {
                teamName,
                teamPosition,
                teamPoints,
                podiumFinish: podiumFinishes.get(driverName) || "Not featured in the podium above"
            });

            const option = document.createElement("option");
            option.value = driverName;
            option.textContent = driverName;
            favoriteDriverSelect.append(option);
        }
    });

    favoriteDriverSelect.addEventListener("change", () => {
        const driverName = favoriteDriverSelect.value;
        const stats = favoriteDrivers.get(driverName);

        if (!stats) {
            favoriteStatsCard.hidden = true;
            return;
        }

        const ordinalSuffix = stats.teamPosition === 1 ? "st" :
            stats.teamPosition === 2 ? "nd" :
            stats.teamPosition === 3 ? "rd" : "th";

        document.querySelector("#favorite-name").textContent = driverName;
        document.querySelector("#favorite-team").textContent = stats.teamName;
        document.querySelector("#favorite-position").textContent = `${stats.teamPosition}${ordinalSuffix}`;
        document.querySelector("#favorite-points").textContent = stats.teamPoints;
        document.querySelector("#favorite-podium").textContent = stats.podiumFinish;
        favoriteStatsCard.hidden = false;
    });
}

const title = document.querySelector("#title");
const message = document.querySelector("#message");

if (title && message) {
    title.textContent = "Welcome to Faro!";
    message.textContent = "JavaScript changed this.";
}

const box = document.querySelector("#box");
const button = document.querySelector("#btn");

function changeColor() {
    box.classList.toggle("active");
}

if (box && button) {
    button.addEventListener("click", changeColor);
}

const players = document.querySelectorAll(".player");
const button2 = document.querySelector("#show");

function highlightAll() {
    for (const player of players) {
        player.classList.add("star");
    }
}

if (button2) {
    button2.addEventListener("click", highlightAll);
}

const nameInput = document.querySelector("#imie");
const greetButton = document.querySelector("#greet-btn");
const output = document.querySelector("#output");

function greet() {
    const name = nameInput.value;
    output.textContent = `Hello, ${name}!`;
}

if (nameInput && greetButton && output) {
    greetButton.addEventListener("click", greet);
}
