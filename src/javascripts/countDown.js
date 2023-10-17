function countDown() {
    state.values.currentTime--,

    ;

    if (state.values.currentTime <= 0) {
        alert("Game Over! O seu resultado foi: " + state.values.result);
    }
}
