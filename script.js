const roulette = document.getElementById("roulette");
const resultDiv = document.getElementById("result");
let spins = 0;
let numbers = Array.from({ length: 15 }, (_, i) => i + 1);

// Secuencia especial lineal
let specialSequence = [3, 7, 8];
let specialIndex = 0;

// Sonido de clic
let clickSound = new Audio("https://actions.google.com/sounds/v1/alarms/click_clock.ogg");

// Crear sectores con números visibles
function createRoulette() {
    const angleStep = 360 / numbers.length;
    numbers.forEach((num, i) => {
        const sector = document.createElement("div");
        sector.className = "sector";
        sector.style.transform = `rotate(${i * angleStep}deg) skewY(${90 - angleStep}deg)`;
        sector.style.background = i % 2 === 0 ? "#0078D7" : "#00BCD4";
        sector.textContent = num;
        roulette.appendChild(sector);
    });
}
createRoulette();

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

    // Giro completo con varias vueltas (10 vueltas)
    const rotation = 360 * 10 + (result - 1) * (360 / numbers.length);
    roulette.style.transition = "transform 6s cubic-bezier(0.1, 0.9, 0.3, 1)";
    roulette.style.transform = `rotate(${rotation}deg)`;

    // Sonido sincronizado con el giro
    let clicks = 0;
    const totalClicks = 60; // cantidad de clics durante el giro
    const clickInterval = setInterval(() => {
        clickSound.play();
        clicks++;
        if (clicks >= totalClicks) clearInterval(clickInterval);
    }, 100);

    setTimeout(() => {
        resultDiv.textContent = `Resultado: ${result}`;
    }, 6000);
}
