function countdown() {
    for (let i = 35; i >= 0; i--) {
        let el = document.getElementById('countdown');
        let newEl = document.createElement("p");
        newEl.textContent = "Countdown: " + i;
        el.appendChild(newEl);
    }
}
