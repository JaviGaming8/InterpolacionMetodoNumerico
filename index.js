const data_form = document.getElementById("data-form");
const x1_input = document.getElementById("x1-input");
const y1_input = document.getElementById("y1-input");
const x2_input = document.getElementById("x2-input");
const y2_input = document.getElementById("y2-input");
const x_input = document.getElementById("x-input");
const answer = document.getElementById("answer");

// Función para simular el valor "real" (puedes cambiarla por tu propia función)
const realValueFunction = (x) => {
    // Ejemplo: función cuadrática que pasa por los puntos de control
    const x1 = parseFloat(x1_input.value);
    const y1 = parseFloat(y1_input.value);
    const x2 = parseFloat(x2_input.value);
    const y2 = parseFloat(y2_input.value);
    
    // Calculamos una curva cuadrática que pasa por los puntos (x1,y1) y (x2,y2)
    const a = (y2 - y1) / Math.pow(x2 - x1, 2);
    return a * Math.pow(x - x1, 2) + y1;
};

let data = [
    {
        x: [0, 0],
        y: [0, 0],
        mode: "lines+markers",
        marker: { size: 8, color: 'blue' },
        line: { color: 'blue' },
        name: "Línea interpolación"
    },
    {
        x: [0],
        y: [0],
        mode: "markers",
        marker: { size: 14, color: 'blue' },
        name: "Punto interpolado"
    },
    {
        x: [0],
        y: [0],
        mode: "markers",
        marker: { size: 14, color: 'red' },
        name: "Valor real (simulado)"
    },
    {
        x: [],
        y: [],
        mode: "lines",
        line: { color: 'red', dash: 'dot' },
        name: "Función real"
    }
];

let layout = {
    title: "Interpolación Lineal vs Valor Real",
    showlegend: true,
    legend: { orientation: "h", y: -0.2 }
};

let config = { responsive: true };

const linear_interpolation = (x1, x2, y1, y2, x) => {
    let m = (y2 - y1) / (x2 - x1);
    return y1 + m * (x - x1);
};

const calc_data = () => {
    let x1 = parseFloat(x1_input.value);
    let y1 = parseFloat(y1_input.value);
    let x2 = parseFloat(x2_input.value);
    let y2 = parseFloat(y2_input.value);
    let x = parseFloat(x_input.value);
    let y = linear_interpolation(x1, x2, y1, y2, x);
    let y_real = realValueFunction(x);
    
    // Generamos puntos para la curva "real"
    let realCurveX = [];
    let realCurveY = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
        const xi = x1 + (x2 - x1) * i / steps;
        realCurveX.push(xi);
        realCurveY.push(realValueFunction(xi));
    }
    
    return { x1, y1, x2, y2, x, y, y_real, realCurveX, realCurveY };
}

const update_data = () => {
    const { x1, y1, x2, y2, x, y, y_real, realCurveX, realCurveY } = calc_data();
    data[0].x = [x1, x2];
    data[0].y = [y1, y2];
    data[1].x = [x];
    data[1].y = [y];
    data[2].x = [x];
    data[2].y = [y_real];
    data[3].x = realCurveX;
    data[3].y = realCurveY;
    answer.textContent = `Valor interpolado: ${y.toFixed(4)} | Valor real simulado: ${y_real.toFixed(4)} | Diferencia: ${Math.abs(y - y_real).toFixed(4)}`;
}

const plot = () => {
    update_data();
    Plotly.newPlot("plot", data, layout, config);
};

const redraw = () => {
    update_data();
    Plotly.redraw("plot");
}

window.addEventListener("load", () => {
    plot();
});

data_form.addEventListener("change", () => {
    redraw();
});
