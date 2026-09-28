let spins = 0;

function spinRoulette() {
    const roulette = document.getElementById("roulette");
    const numberDiv = document.getElementById("number");

    spins++;
    let result;

    // Secuencia especial cada 3 giros, pero lineal
    if (spins % 4 === 0) {
        const sequence = [3, 7, 8];
        result = sequence[Math.floor(Math.random() * sequence.length)];
    } else {
        result = Math.floor(Math.random() * 10) + 1;
    }

    // Animación de giro
    const rotation = 360 * 5 + Math.random() * 360;
    roulette.style.transform = `rotate(${rotation}deg)`;

    // Mostrar número después del giro
    setTimeout(() => {
        numberDiv.textContent = result;
    }, 2800);
}
