const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

// Canvas is a square as big as possible in the window
const canvas_size = window.innerHeight > window.innerWidth
    ? window.innerWidth
    : window.innerHeight;

canvas.width = canvas_size;
canvas.height = canvas_size;

document.querySelector(".content").style.height = window.innerHeight;

// Reload on resize
window.addEventListener("resize", () => { location.reload(); });

// Update the title every seconds to the current time
setInterval(() => {
    const time = getTime();
    document.title = `Fractal Clock - ${time.h < 10 ? `0${time.h}` : time.h}:${time.m < 10 ? `0${time.m}` : time.m}:${time.s < 10 ? `0${time.s}` : time.s}`
}, 1000);

// Main loop
function loop()
{
    context.clearRect(0, 0, canvas_size, canvas_size);
    drawFractalTime(canvas_size / 2, canvas_size / 2, canvas_size / 7, 0, 3);
    window.requestAnimationFrame(loop);
}

loop();
