const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),  // novo elemento para mostrar vidas
        container: document.querySelector(".container") // para tela game over
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        livesCount: 3,
        gameOver: false,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    }
};

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        endGame();
    }
}

function playSound(type) {
    let audio;
    if(type === "hit"){
        audio = new Audio("../audios/hit.m4a");
    } else if(type === "miss"){
        audio = new Audio("../audios/miss.m4a");
    }
    if(audio){
        audio.volume = 0.2;
        audio.play();
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy", "hit", "miss");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function updateLives() {
    state.view.lives.textContent = "Vidas: " + state.values.livesCount;
}

function endGame() {
    state.values.gameOver = true;
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);

    // Remove inimigo e desativa o clique
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    // Cria tela de Game Over personalizada
    const gameOverDiv = document.createElement("div");
    gameOverDiv.id = "game-over";
    gameOverDiv.style.cssText = `
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        z-index: 100;
    `;

    gameOverDiv.innerHTML = `
        <h1>Game Over</h1>
        <p>Sua pontuação foi: ${state.values.result}</p>
        <button id="restart-btn">Jogar Novamente</button>
    `;

    state.view.container.appendChild(gameOverDiv);

    document.querySelector("#restart-btn").addEventListener("click", () => {
        gameOverDiv.remove();
        restartGame();
    });
}

function restartGame() {
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.livesCount = 3;
    state.values.gameOver = false;
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;
    updateLives();

    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (state.values.gameOver) return;

            if (square.id === state.values.hitPosition) {
                // Acertou
                state.values.result++;
                state.view.score.textContent = state.values.result;
                playSound("hit");

                // Feedback visual verde
                square.classList.add("hit");
                setTimeout(() => square.classList.remove("hit"), 300);

                state.values.hitPosition = null;
            } else {
                // Errou
                state.values.livesCount--;
                updateLives();
                playSound("miss");

                // Feedback visual vermelho
                square.classList.add("miss");
                setTimeout(() => square.classList.remove("miss"), 300);

                if (state.values.livesCount <= 0) {
                    endGame();
                }
            }
        });
    });
}

function initialize() {
    // Cria elemento para mostrar vidas, se não existir
    if (!state.view.lives) {
        const menuLivesDiv = document.createElement("div");
        menuLivesDiv.id = "lives";
        menuLivesDiv.style.cssText = "color: red; font-size: 1.2em; margin-left: 20px;";
        document.querySelector(".menu").appendChild(menuLivesDiv);
        state.view.lives = menuLivesDiv;
    }

    updateLives();
    addListenerHitBox();

    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

initialize();
