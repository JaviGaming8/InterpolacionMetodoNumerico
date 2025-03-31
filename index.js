// - El formulario donde el usuario ingresará los datos.
const formularioDatos = document.getElementById("data-form");
const entradaX1 = document.getElementById("x1-input");
const entradaY1 = document.getElementById("y1-input");
const entradaX2 = document.getElementById("x2-input");
const entradaY2 = document.getElementById("y2-input");
const entradaX = document.getElementById("x-input");
const respuesta = document.getElementById("answer");
const tablaResultados = document.getElementById("tabla-resultados").querySelector("tbody");

// Aquí configuramos la estructura inicial de la gráfica usando Plotly.
let datos = [
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

/**
 * Esta función simula un valor real usando una fórmula cuadrática 
 * basada en los puntos de control X1, Y1, X2 y Y2.
 * @param {number} x - El valor de X para el que queremos calcular Y.
 * @returns {number} El valor de Y simulado.
 */
const funcionValorReal = (x) => {
  const x1 = parseFloat(entradaX1.value);  
  const y1 = parseFloat(entradaY1.value);
  const x2 = parseFloat(entradaX2.value); 
  const y2 = parseFloat(entradaY2.value);  
  const a = (y2 - y1) / Math.pow(x2 - x1, 2);  
  return a * Math.pow(x - x1, 2) + y1;
};

/**
 * Esta función calcula la interpolación lineal entre los puntos X1, Y1 y X2, Y2.
 * @param {number} x1 - Primer valor de X.
 * @param {number} x2 - Segundo valor de X.
 * @param {number} y1 - Primer valor de Y.
 * @param {number} y2 - Segundo valor de Y.
 * @param {number} x - Valor de X para el que se desea calcular Y.
 * @returns {number} Valor interpolado en Y.
 */
const interpolacionLineal = (x1, x2, y1, y2, x) => {
  const m = (y2 - y1) / (x2 - x1);
  return y1 + m * (x - x1); 
};

/**
 * Esta función recoge los valores de entrada, calcula la interpolación y la simulación,
 * y genera los datos para la gráfica y la tabla.
 * @returns {object} Un objeto con los resultados calculados.
 */
const calcularDatos = () => {
  const x1 = parseFloat(entradaX1.value);
  const y1 = parseFloat(entradaY1.value);
  const x2 = parseFloat(entradaX2.value);
  const y2 = parseFloat(entradaY2.value);
  const x = parseFloat(entradaX.value);
  const yInterpolado = interpolacionLineal(x1, x2, y1, y2, x);  // Calcula el valor interpolado
  const yReal = funcionValorReal(x);  // Calcula el valor real simulado

  // Generar puntos para la curva de la función real
  const pasos = 20;  
  let puntosCurvaRealX = [];
  let puntosCurvaRealY = [];
  for (let i = 0; i <= pasos; i++) {
    const xi = x1 + ((x2 - x1) * i) / pasos;  
    puntosCurvaRealX.push(xi);  
    puntosCurvaRealY.push(funcionValorReal(xi));  
  }

  return { x1, y1, x2, y2, x, yInterpolado, yReal, puntosCurvaRealX, puntosCurvaRealY };
};

const actualizarDatos = () => {
  const { x1, y1, x2, y2, x, yInterpolado, yReal, puntosCurvaRealX, puntosCurvaRealY } = calcularDatos();

  // Actualiza los datos de la gráfica con los nuevos valores
  datos[0].x = [x1, x2];
  datos[0].y = [y1, y2];
  datos[1].x = [x];
  datos[1].y = [yInterpolado];
  datos[2].x = [x];
  datos[2].y = [yReal];
  datos[3].x = puntosCurvaRealX;
  datos[3].y = puntosCurvaRealY;

  // Muestra el resultado en un mensaje de respuesta
  respuesta.textContent = `Valor interpolado: ${yInterpolado.toFixed(4)} | Valor real simulado: ${yReal.toFixed(4)} | Diferencia: ${Math.abs(yInterpolado - yReal).toFixed(4)}`;

  // Actualiza la tabla de resultados con los valores calculados
  tablaResultados.innerHTML = `
    <tr>
      <td>${x1}</td>
      <td>${y1}</td>
      <td>${x2}</td>
      <td>${y2}</td>
      <td>${x}</td>
      <td>${yInterpolado.toFixed(4)}</td>
      <td>${yReal.toFixed(4)}</td>
      <td>${Math.abs(yInterpolado - yReal).toFixed(4)}</td>
    </tr>
  `;
};

 // Esta función inicializa la gráfica cuando se carga la página.

const graficar = () => {
  actualizarDatos();  
  Plotly.newPlot("plot", datos, layout, config);  
};

const redibujar = () => {
  actualizarDatos(); 
  Plotly.redraw("plot");
};


// Se ejecuta cuando la página se ha cargado completamente
window.addEventListener("load", graficar);

// Se ejecuta cuando cualquier valor del formulario cambia
formularioDatos.addEventListener("change", redibujar);
