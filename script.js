const roulette = document.getElementById("roulette");
const resultDiv = document.getElementById("result");
let spins = 0;
let numbers = Array.from({ length: 15 }, (_, i) => i + 1);

// Secuencia especial lineal
let specialSequence = [3, 7, 8];
let specialIndex = 0;

// Sonido de clic
let clickSound = new Audio("https://actions.google.com/sounds/v1/alarms/click_clock.ogg");

// Crear etiquetas de números alrededor
function createLabels() {
    const angleStep = 360 / numbers.length;
    numbers.forEach((num, i) => {
        const label = document.createElement("div");
        label.className = "number-label";
        label.style.transform = `rotate(${i * angleStep}deg) translateY(-130px)`;
        label.textContent = num;
        roulette.appendChild(label);
    });
}
createLabels();

function spinRoulette() {
    spins++;
    let result;

    // Cada 3 giros: secuencia 3 → 7 → 8
    if (spins % 3 === 0) {
        result = specialSequence[specialIndex];
        specialIndex = (specialIndex + 1) % specialSequence.length;
    } else {
        result = numbers[Math.floor(Math.random() * numbers.length)];
    }

    // Giro completo con varias vueltas
    const rotation = 360 * 10 + (result - 1) * (360 / numbers.length);
    roulette.style.transform = `rotate(${rotation}deg)`;

    // Sonido sincronizado
    let clicks = 0;
    const totalClicks = 60;
    const clickInterval = setInterval(() => {
        clickSound.play();
        clicks++;
        if (clicks >= totalClicks) clearInterval(clickInterval);
    }, 100);

    setTimeout(() => {
        resultDiv.textContent = `Resultado: ${result}`;
    }, 6000);
}
