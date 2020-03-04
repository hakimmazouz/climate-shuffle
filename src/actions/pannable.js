export default function pannable(node) {
    let x;
    let y;

    function handleMousedown(event) {
        x = event.targetTouches
            ? event.targetTouches[0].clientX
            : event.clientX;
        y = event.targetTouches
            ? event.targetTouches[0].clientY
            : event.clientY;

        node.dispatchEvent(
            new CustomEvent("panstart", {
                detail: { x, y },
            })
        );

        window.addEventListener("mousemove", handleMousemove);
        window.addEventListener("mouseup", handleMouseup);
        if ("ontouchmove" in window && "ontouchend" in window) {
            window.addEventListener("touchmove", handleMousemove);
            window.addEventListener("touchend", handleMouseup);
        }
    }

    function handleMousemove(event) {
        const dx =
            (event.targetTouches
                ? event.targetTouches[0].clientX
                : event.clientX) - x;
        const dy =
            (event.targetTouches
                ? event.targetTouches[0].clientY
                : event.clientY) - y;
        x = event.targetTouches
            ? event.targetTouches[0].clientX
            : event.clientX;
        y = event.targetTouches
            ? event.targetTouches[0].clientY
            : event.clientY;

        node.dispatchEvent(
            new CustomEvent("panmove", {
                detail: { x, y, dx, dy },
            })
        );
    }

    function handleMouseup(event) {
        x = event.changedTouches
            ? event.changedTouches[0].clientX
            : event.clientX;
        y = event.changedTouches
            ? event.changedTouches[0].clientY
            : event.clientY;

        node.dispatchEvent(
            new CustomEvent("panend", {
                detail: { x, y },
            })
        );

        window.removeEventListener("mousemove", handleMousemove);
        window.removeEventListener("mouseup", handleMouseup);
        if ("ontouchmove" in window && "ontouchend" in window) {
            window.removeEventListener("touchmove", handleMousemove);
            window.removeEventListener("touchend", handleMouseup);
        }
    }

    node.addEventListener("mousedown", handleMousedown);
    if ("ontouchstart" in window)
        node.addEventListener("touchstart", handleMousedown);

    return {
        destroy() {
            node.removeEventListener("mousedown", handleMousedown);
        },
    };
}
