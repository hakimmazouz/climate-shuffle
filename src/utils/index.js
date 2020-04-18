export const map = (n, start1, stop1, start2, stop2) =>
    ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

export const constrain = (n, min, max) => Math.min(Math.max(n, min), max);

export const mapConstrain = (n, start1, stop1, start2, stop2) =>
    constrain(map(n, start1, stop1, start2, stop2), start2, stop2);

export const createArray = (length, fill) => {
    const arr = new Array(length);
    for (let i = 0; i < length; i++) {
        arr[i] = typeof fill === "function" ? fill() : fill;
    }
    return arr;
};
