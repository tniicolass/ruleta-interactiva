const roulette = document.getElementById("roulette");
const labels = document.getElementById("wheel-labels");
const result = document.getElementById("result");
const resultLabel = document.getElementById("result-label");
const spinCount = document.getElementById("spin-count");
const spinButton = document.getElementById("spin-button");

const numbers = Array.from({ length: 15 }, (_, index) => index + 1);
const specialSequence = [3, 7, 8];
const remainingNumbers = numbers.filter((number) => !specialSequence.includes(number));
const segmentAngle = 360 / numbers.length;
const spinDuration = 8500;
const fullTurns = 12;

let completedSpins = 0;
let rotation = 0;
let audioContext;
let clickFrame;

function createLabels() {
    const wheelSize = roulette.clientWidth;
    const radius = wheelSize * 0.37;

    numbers.forEach((number, index) => {
        const angle = (index * segmentAngle + segmentAngle / 2 - 90) * Math.PI / 180;
        const label = document.createElement("span");
        label.className = "number-label";
        label.textContent = number;
        label.style.left = `${wheelSize / 2 + Math.cos(angle) * radius}px`;
        label.style.top = `${wheelSize / 2 + Math.sin(angle) * radius}px`;
        labels.appendChild(label);
    });
}

function playClick() {
    if (!audioContext || audioContext.state !== "running") return;

    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.025);
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.045, now + 0.003);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.045);
}

function readWheelAngle() {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(roulette).transform);
    return (Math.atan2(matrix.b, matrix.a) * 180 / Math.PI + 360) % 360;
}

function playClicksUntilStop(startAngle) {
    let previousAngle = readWheelAngle();
    let travelled = 0;
    let nextTick = (Math.floor(startAngle / segmentAngle) + 1) * segmentAngle;

    function tick() {
        const currentAngle = readWheelAngle();
        travelled += (currentAngle - previousAngle + 360) % 360;
        previousAngle = currentAngle;

        while (nextTick - startAngle <= travelled) {
            playClick();
            nextTick += segmentAngle;
        }

        if (travelled < rotation - startAngle) {
            clickFrame = requestAnimationFrame(tick);
        }
    }

    clickFrame = requestAnimationFrame(tick);
}

function chooseWinner() {
    if (completedSpins < specialSequence.length) {
        return specialSequence[completedSpins];
    }
    return remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];
}

function spinRoulette() {
    if (spinButton.disabled) return;

    spinButton.disabled = true;
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    audioContext.resume();

    const winner = chooseWinner();
    const winnerIndex = winner - 1;
    const centerAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    const targetAngle = (360 - centerAngle + 360) % 360;
    const currentAngle = ((rotation % 360) + 360) % 360;
    const alignment = (targetAngle - currentAngle + 360) % 360;
    const startAngle = rotation;

    rotation += fullTurns * 360 + alignment;
    roulette.style.transition = `transform ${spinDuration}ms cubic-bezier(0.12, 0.78, 0.16, 1)`;
    roulette.style.transform = `rotate(${rotation}deg)`;
    roulette.setAttribute("aria-label", "Ruleta girando");
    resultLabel.textContent = "La suerte está girando...";
    spinCount.textContent = `GIRO ${completedSpins + 1}`;
    playClicksUntilStop(startAngle);

    roulette.addEventListener("transitionend", function finishSpin(event) {
        if (event.propertyName !== "transform") return;
        roulette.removeEventListener("transitionend", finishSpin);
        cancelAnimationFrame(clickFrame);
        completedSpins += 1;
        result.textContent = winner;
        resultLabel.textContent = "Número ganador";
        spinCount.textContent = completedSpins < specialSequence.length
            ? `GIRO ${completedSpins + 1}`
            : `GIRO ${completedSpins}`;
        roulette.setAttribute("aria-label", `Ruleta detenida en el número ${winner}`);
        spinButton.disabled = false;
    });
}

createLabels();
spinButton.addEventListener("click", spinRoulette);
window.addEventListener("resize", () => {
    labels.replaceChildren();
    createLabels();
});
