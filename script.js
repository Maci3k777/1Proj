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

const teamPointsChart = document.querySelector("#team-points-chart");
const chartGrid = document.querySelector("#chart-grid");
const chartLines = document.querySelector("#chart-lines");
const chartLegend = document.querySelector("#chart-legend");

if (teamPointsChart && chartGrid && chartLines && chartLegend) {
    const raceLabels = ["Race 1", "Race 2", "Race 3", "Race 4", "Race 5", "Race 6"];
    const chartData = [
        { team: "Mercedes", points: [90, 188, 275, 367, 480, 607] },
        { team: "Ferrari", points: [72, 145, 220, 292, 375, 474] },
        { team: "Red Bull", points: [52, 120, 190, 255, 310, 355] },
        { team: "McLaren", points: [70, 140, 210, 270, 330, 355] },
        { team: "Racing Bulls", points: [20, 39, 50, 62, 80, 102] },
        { team: "Alpine", points: [12, 25, 33, 45, 57, 69] },
        { team: "Haas", points: [4, 8, 15, 20, 25, 30] },
        { team: "Audi", points: [3, 6, 11, 15, 19, 23] },
        { team: "Williams", points: [2, 3, 5, 7, 9, 12] },
        { team: "Aston Martin", points: [1, 2, 3, 4, 5, 7] },
        { team: "Cadillac", points: [0, 0, 0, 0, 0, 0] }
    ];
    const svgNamespace = "http://www.w3.org/2000/svg";
    const chart = { left: 62, right: 940, top: 24, bottom: 330, maxPoints: 700 };

    function createSvgElement(name, attributes, text) {
        const element = document.createElementNS(svgNamespace, name);

        for (const [attribute, value] of Object.entries(attributes)) {
            element.setAttribute(attribute, String(value));
        }

        if (text) {
            element.textContent = text;
        }

        return element;
    }

    function xPosition(index) {
        return chart.left + index * (chart.right - chart.left) / (raceLabels.length - 1);
    }

    function yPosition(points) {
        return chart.bottom - points * (chart.bottom - chart.top) / chart.maxPoints;
    }

    for (let points = 0; points <= chart.maxPoints; points += 100) {
        const y = yPosition(points);
        chartGrid.append(
            createSvgElement("line", {
                x1: chart.left,
                x2: chart.right,
                y1: y,
                y2: y,
                class: "chart-grid-line"
            }),
            createSvgElement("text", {
                x: chart.left - 12,
                y: y + 4,
                "text-anchor": "end",
                class: "chart-axis-label"
            }, String(points))
        );
    }

    raceLabels.forEach((label, index) => {
        chartGrid.append(createSvgElement("text", {
            x: xPosition(index),
            y: chart.bottom + 28,
            "text-anchor": "middle",
            class: "chart-axis-label"
        }, label));
    });

    for (const { team, points } of chartData) {
        const teamCard = [...document.querySelectorAll("#teams li")].find((card) =>
            card.querySelector("strong").textContent.trim() === team
        );

        if (!teamCard) {
            throw new Error(`Could not find standings card for ${team}`);
        }

        const color = getComputedStyle(teamCard).getPropertyValue("--team-accent").trim();
        const path = points.map((value, index) =>
            `${index === 0 ? "M" : "L"} ${xPosition(index)} ${yPosition(value)}`
        ).join(" ");

        chartLines.append(
            createSvgElement("path", {
                d: path,
                fill: "none",
                stroke: color,
                "stroke-width": "3",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
            }),
            ...points.map((value, index) => createSvgElement("circle", {
                cx: xPosition(index),
                cy: yPosition(value),
                r: "4",
                fill: color
            }))
        );

        const legendItem = document.createElement("li");
        const swatch = document.createElement("span");
        swatch.className = "chart-swatch";
        swatch.style.backgroundColor = color;
        swatch.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.textContent = team;
        legendItem.append(swatch, label);
        chartLegend.append(legendItem);
    }
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
