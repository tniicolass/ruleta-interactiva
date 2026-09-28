const roulette = document.getElementById("roulette");
const resultDiv = document.getElementById("result");
let spins = 0;
let numbers = Array.from({ length: 15 }, (_, i) => i + 1);

// Crear sectores de la ruleta
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

    // Secuencia especial cada 3 giros
    if (spins % 3 === 0) {
        const sequence = [3, 7, 8];
        result = sequence[Math.floor(Math.random() * sequence.length)];
    } else {
        result = numbers[Math.floor(Math.random() * numbers.length)];
    }

    // Animación de giro natural
    const rotation = 360 * 5 + (result - 1) * (360 / numbers.length);
    roulette.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        resultDiv.textContent = `Resultado: ${result}`;
    }, 4000);
}
