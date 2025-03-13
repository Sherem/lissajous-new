document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
    const ctx = canvas.getContext("2d");

    // Helper function to resize the canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.8;
    }

    // Resize canvas on load
    resizeCanvas();

    // Resize canvas on window resize
    window.addEventListener("resize", resizeCanvas);

    let A = 1, B = 1, a = 3, b = 2, delta = 0, scale = 150;
    let t = 0;
    let autoChange = true;

    document.getElementById("autoChange").addEventListener("change", function () {
        autoChange = this.checked;
    });

    function updateParameters() {
        if (!autoChange) {
            A = parseFloat(document.getElementById("A").value);
            B = parseFloat(document.getElementById("B").value);
            a = parseFloat(document.getElementById("a").value);
            b = parseFloat(document.getElementById("b").value);
            scale = parseFloat(document.getElementById("scale").value);
        }
        updateInfoPanel();
    }

    function updateInfoPanel() {
        document.getElementById("infoPanel").innerHTML = `
            Frequencies: a = ${a.toFixed(2)}, b = ${b.toFixed(2)}<br>
            Amplitudes: A = ${A.toFixed(2)}, B = ${B.toFixed(2)}<br>
            Frequency Ratio: ${(a / b).toFixed(2)}
        `;
    }

    document.querySelectorAll("input[type=range]").forEach(input => {
        input.addEventListener("input", updateParameters);
    });

    function drawGrid() {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        let step = 50;
        let halfX = canvas.width / 2;
        let halfY = canvas.height / 2;
        let startX = halfX % step;
        let startY = halfY % step;

        for (let x = startX; x < canvas.width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = startY; y < canvas.height; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(halfX, 0);
        ctx.lineTo(halfX, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, halfY);
        ctx.lineTo(canvas.width, halfY );
        ctx.stroke();

        // Add 10-pixel tick marks aligned to the center on the horizontal axis
        let tickLength = 5;
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        let xPos = halfX;
        // Draw ticks to the right of the center
        while (xPos < canvas.width) {
            ctx.beginPath();
            ctx.moveTo(xPos, halfY - tickLength);
            ctx.lineTo(xPos, halfY + tickLength);
            ctx.stroke();
            xPos += 10;
        }
        // Draw ticks to the left of the center
        xPos = halfX - 10;
        while (xPos >= 0) {
            ctx.beginPath();
            ctx.moveTo(xPos, halfY - tickLength);
            ctx.lineTo(xPos, halfY + tickLength);
            ctx.stroke();
            xPos -= 10;
        }

        // Add 10-pixel tick marks aligned to the center on the vertical axis
        let yPos = halfY;
        // Draw ticks below the center
        while (yPos < canvas.height) {
            ctx.beginPath();
            ctx.moveTo(halfX - tickLength, yPos);
            ctx.lineTo(halfX + tickLength, yPos);
            ctx.stroke();
            yPos += 10;
        }
        // Draw ticks above the center
        yPos = halfY - 10;
        while (yPos >= 0) {
            ctx.beginPath();
            ctx.moveTo(halfX - tickLength, yPos);
            ctx.lineTo(halfX + tickLength, yPos);
            ctx.stroke();
            yPos -= 10;
        }
    }

    function drawLissajous() {
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 2 * Math.PI; i += 0.01) {
            let x = A * Math.sin(a * i + delta);
            let y = B * Math.sin(b * i);
            ctx.lineTo(canvas.width / 2 + x * scale, canvas.height / 2 + y * scale);
        }
        ctx.stroke();

        delta += 0.02; // Animate phase shift

        if (autoChange) {
            a = 3 + Math.sin(t * 0.01) * 2;
            b = 2 + Math.cos(t * 0.01) * 2;
            A = 1 + Math.sin(t * 0.005) * 0.5;
            B = 1 + Math.cos(t * 0.005) * 0.5;
            scale = parseFloat(document.getElementById("scale").value);
            document.getElementById("A").value = A;
            document.getElementById("B").value = B;
            document.getElementById("a").value = a;
            document.getElementById("b").value = b;
        }

        t += 1;
        updateInfoPanel();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawLissajous();
        delta += 0.02;
        requestAnimationFrame(animate);
    }

    animate();
});
