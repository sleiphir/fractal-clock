const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

// Canvas is a square as big as possible in the window
const canvas_size = window.innerHeight > window.innerWidth
    ? window.innerWidth
    : window.innerHeight;

canvas.width = canvas_size;
canvas.height = canvas_size;

const clock = document.querySelector("#clock");
clock.style.width = canvas_size / 2.7;

const dom_time = document.querySelector("#time");

// Reload on resize
window.addEventListener("resize", () => { location.reload(); });

// Update the title every seconds to the current time
setInterval(() => {
    const time = getTime();
    dom_time.children[0].textContent = time.h < 10 ? `0${time.h}` : time.h;
    dom_time.children[1].textContent = time.m < 10 ? `0${time.m}` : time.m;
    dom_time.children[2].textContent = time.s < 10 ? `0${time.s}` : time.s;
    document.title = `${time.h}:${time.m}:${time.s}`
}, 1000);

// Main loop
function loop()
{
    context.clearRect(0, 0, canvas_size, canvas_size);
    drawFractalTime(canvas_size / 2, canvas_size / 2, canvas_size / 7, 0, 1);
    window.requestAnimationFrame(loop);
}

loop();
