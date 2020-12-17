const HOUR_COLOR = "#a095ff";
const MINUTE_COLOR = "#ff9a95";
const SECOND_COLOR = "#f4ff95";

/**
 * Return the current local time (HH:MM:SS) in an object { h, m, s, ms}
 */
function getTime() {
    const date = new Date();
    return {
        h: date.getHours() % 12,
        m: date.getMinutes(),
        s: date.getSeconds(),
        ms: date.getMilliseconds()
    }
}

/**
 * 
 * @param {number} x1 start pos x 
 * @param {number} y1 start pos y
 * @param {number} x2 end pos x
 * @param {number} y2 end pos y
 * @param {number} width width of the stroke
 * @param {string} color color of the stroke (hex or name, e.g "red" or "#FF0000")
 */
function drawLine(x1, y1, x2, y2, width, color)
{
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

/**
 * 
 * @param {number} x start pos x
 * @param {number} y start pos y
 * @param {number} radius radius of the implied circle
 * @param {number} angle angle in radian
 * @param {number} width width of the stroke
 * @param {string} color color of the stroke (hex or name, e.g "red" or "#FF0000")
 */
function drawLineAngle(x, y, radius, angle, width, color)
{
    const end_x = x + radius * Math.cos(angle);
    const end_y = y + radius * Math.sin(angle);

    drawLine(x, y, end_x, end_y, width, color);

    return {
        x: end_x,
        y: end_y,
        angle: angle
    }
}

/**
 * Draw the current time
 * @param {number} x start pos x
 * @param {number} y start pos y
 * @param {number} radius radius of the implied circle
 * @param {number} angle_offset angle offset of the clock (rotation of the clock as a whole)
 * @param {number} width width of the strokes
 */
function drawCurrentTime(x, y, radius, angle_offset, width)
{
    const time = getTime();
    // Current hour with decimals (e.g 1h 30m -> 1.5)
    const hours = time.h + (time.m / 60);
    // Current hour with decimals (e.g 1m 30s -> 1.5)
    const minutes = time.m + (time.s / 60);
    // Current seconds with decimals (e.g 1s 553ms -> 1.553)
    const seconds = time.s + (time.ms / 1000);

    const second_hand = drawLineAngle(x, y, radius, seconds * Math.PI * 2 / 60 - Math.PI/2 + angle_offset, width, SECOND_COLOR);
    const minute_hand = drawLineAngle(x, y, radius, minutes * Math.PI * 2 / 60 - Math.PI/2 + angle_offset, width, MINUTE_COLOR);
    const   hour_hand = drawLineAngle(x, y, radius,   hours * Math.PI * 2 / 12 - Math.PI/2 + angle_offset, width, HOUR_COLOR);

    return { second_hand, minute_hand, hour_hand };
}

/**
 * Draw the current time as a fractal
 * @param {number} x start pos x
 * @param {number} y start pos y
 * @param {number} radius radius of the implied circle
 * @param {number} angle_offset angle offset of the clock (rotation of the clock as a whole)
 * @param {number} width width of the strokes
 */
function drawFractalTime(x, y, radius, angle_offset, width)
{
    const root = drawCurrentTime(x, y, radius, angle_offset, width);
    _recFractal(root.second_hand, radius * 0.70, 2);
    _recFractal(root.minute_hand, radius * 0.70, 2);
    _recFractal(root.hour_hand, radius * 0.70, 2);
}

/**
 * Internal recursive function used by drawFractalTime
 * @param {{x,y,angle}} hand second or hour hand object
 * @param {number} radius radius in radian
 * @param {number} width width of the strokes
 */
function _recFractal(hand, radius, width, iter = 1)
{
    // Continue while the radius is above 15 pixels and the call stack depth is below 10
    if (radius >= 15 && iter < 10) {
        // Draw the new clock with a radius 30% smaller
        const hands = drawCurrentTime(hand.x, hand.y, radius, hand.angle, width);
        // Draw second hand clock
        _recFractal(hands.second_hand, radius * 0.70, width * 0.5, iter + 1);
        // Draw minute hand clock
        _recFractal(hands.minute_hand, radius * 0.70, width * 0.5, iter + 1);
        // Draw hour hand clock
        _recFractal(hands.hour_hand, radius * 0.70, width * 0.5, iter + 1);
    }
}
