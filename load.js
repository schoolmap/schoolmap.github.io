let canvas;
function draw() { }
function resizeCanvas() {
    canvas = document.getElementById("canvas");
    canvas.setAttribute("height", canvas.clientHeight.toString());
    canvas.setAttribute("width", canvas.clientWidth.toString());
    draw();
}
//window.addEventListener("load", resizeCanvas);
//window.addEventListener("resize", resizeCanvas);
//# sourceMappingURL=load.js.map