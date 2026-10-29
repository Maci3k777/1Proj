const playerName = "Alex";
const age = 16;

console.log(`${playerName} is ${age} years old.`);


const title = document.querySelector("#title");
const message = document.querySelector("#message");

title.textContent = "Welcome to Faro!";
message.textContent = "JavaScript changed this.";

const box = document.querySelector("#box");
const button = document.querySelector("#btn");

function changeColor() {
    box.classList.toggle("active");
}

button.addEventListener("click", changeColor);

const players = document.querySelectorAll(".player");
const button2 = document.querySelector("#show");

function highlightAll() {
    for (const player of players) {
        player.classList.add("star");
    }
}

button2.addEventListener("click", highlightAll);

const nameInput = document.querySelector("#imie");
const greetButton = document.querySelector("#greet-btn");
const output = document.querySelector("#output");

function greet() {
    const name = nameInput.value;
    output.textContent = `Hello, ${name}!`;
}

greetButton.addEventListener("click", greet);
