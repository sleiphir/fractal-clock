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
    
    context.lineWidth = width;
    context.strokeStyle = color;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    
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
    const end_x = x + radius * Math.sin(angle);
    const end_y = y + radius * Math.cos(angle);

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
 * @param {string} color color of the strokes (hex or name, e.g "red" or "#FF0000")
 */
function drawCurrentTime(x, y, radius, angle_offset, width, color)
{
    const time = getTime();
    // Current hour with decimals (e.g 1h 30m -> 1.5)
    const hours = time.h + (time.m / 60);
    // Current hour with decimals (e.g 1m 30s -> 1.5)
    const minutes = time.m + (time.s / 60);
    // Current seconds with decimals (e.g 1s 553ms -> 1.553)
    const seconds = time.s + (time.ms / 1000);

    const second_hand = drawLineAngle(x, y, radius, -seconds / 60 * Math.PI * 2 - Math.PI + angle_offset, width, color);
    const minute_hand = drawLineAngle(x, y, radius, -minutes / 60 * Math.PI * 2 - Math.PI + angle_offset, width * 1.5, color);
    const hour_hand = drawLineAngle(x, y, radius, -hours / 12 * Math.PI * 2 - Math.PI + angle_offset, width * 2, color);

    return { second_hand, minute_hand, hour_hand };
}

/**
 * Draw the current time as a fractal
 * @param {number} x start pos x
 * @param {number} y start pos y
 * @param {number} radius radius of the implied circle
 * @param {number} angle_offset angle offset of the clock (rotation of the clock as a whole)
 * @param {number} width width of the strokes
 * @param {string} color color of the strokes (hex or name, e.g "red" or "#FF0000")
 */
function drawFractalTime(x, y, radius, angle_offset, width, color)
{
    // beginPath() and stroke() are called here after every fractal branches has been prepared for optimization purposes
    context.beginPath();
    context.strokeStyle = 'white';
    const root = drawCurrentTime(x, y, radius, angle_offset, width, color);
    context.stroke();
    context.beginPath();
    _recFractal(root.second_hand, radius * 0.70, 0.5, "#f4ff95", 1);
    context.stroke();
    context.beginPath();
    _recFractal(root.minute_hand, radius * 0.70, 0.5, "#ff9a95", 1);
    context.stroke();
    context.beginPath();
    _recFractal(root.hour_hand, radius * 0.70, 0.5, "#a095ff", 1);
    context.stroke();
}

/**
 * Internal recursive function used by drawFractalTime
 * @param {{x,y,angle}} hand second or hour hand object
 * @param {number} radius radius in radian
 * @param {number} width width of the strokes
 * @param {string} color color of the strokes
 */
function _recFractal(hand, radius, width, color, iter)
{
    //color = "#"+(parseInt(color.substr(1), 16) - iter * 65793).toString(16);
    // Continue the recursion while the radius is above 3 pixels
    if (radius >= 7) {
        // Draw the new clock with a radius 30% smaller
        const hands = drawCurrentTime(hand.x, hand.y, radius, hand.angle, width, color);
        // Draw second hand clock
        _recFractal(hands.second_hand, radius * 0.70, width * 0.67, color, iter + 1);
        // Draw minute hand clock
        _recFractal(hands.minute_hand, radius * 0.70, width * 0.67, color, iter + 1);
        // Draw hour hand clock
        _recFractal(hands.hour_hand, radius * 0.70, width * 0.67, color, iter + 1);
    }
}
