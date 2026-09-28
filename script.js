const roulette = document.getElementById("roulette");
const resultDiv = document.getElementById("result");
let spins = 0;
let numbers = Array.from({ length: 15 }, (_, i) => i + 1);
let clickSound = new Audio("https://actions.google.com/sounds/v1/alarms/click_clock.ogg");

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

    // Giro natural con desaceleración
    const rotation = 360 * 6 + (result - 1) * (360 / numbers.length);
    roulette.style.transform = `rotate(${rotation}deg)`;

    // Sonido de clic mientras gira
    let clicks = 0;
    const clickInterval = setInterval(() => {
        clickSound.play();
        clicks++;
        if (clicks > 40) clearInterval(clickInterval);
    }, 100);

    setTimeout(() => {
        resultDiv.textContent = `Resultado: ${result}`;
    }, 5000);
}
