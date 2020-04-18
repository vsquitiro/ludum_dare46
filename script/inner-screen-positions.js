const xStart = 3.5 * 32;
const yStart = 4.5 * 32;

function c2px(x) {
    return x * 32 + xStart;
}

function c2py(y) {
    return y * 32 + yStart;
}

export {
    c2px,
    c2py
}