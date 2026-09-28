let spins = 0;

function spinRoulette() {
    spins++;
    let result;

    if (spins % 4 === 0) {
        result = "3 - 7 - 8";
    } else {
        result = Math.floor(Math.random() * 10) + 1;
    }

    const resultDiv = document.getElementById("result");
    resultDiv.innerText = result;
    resultDiv.style.transform = "scale(1.2)";
    setTimeout(() => {
        resultDiv.style.transform = "scale(1)";
    }, 200);
}
