// ================================
// Selección de elementos del DOM
// ================================
const formularioDatos = document.getElementById("data-form");
const entradaX1 = document.getElementById("x1-input");
const entradaY1 = document.getElementById("y1-input");
const entradaX2 = document.getElementById("x2-input");
const entradaY2 = document.getElementById("y2-input");
const entradaX = document.getElementById("x-input");
const respuesta = document.getElementById("answer");
const tablaResultados = document.getElementById("tabla-resultados").querySelector("tbody");

// ================================
// Configuración de la gráfica (Plotly)
// ================================
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

// ================================
// Funciones de Cálculo y Actualización
// ================================

/**
 * Calcula el valor real simulado para un valor dado de x.
 * Se utiliza una función cuadrática que pasa por los puntos de control.
 * @param {number} x - Valor en el eje x.
 * @returns {number} Valor simulado en y.
 */
const funcionValorReal = (x) => {
  const x1 = parseFloat(entradaX1.value);
  const y1 = parseFloat(entradaY1.value);
  const x2 = parseFloat(entradaX2.value);
  const y2 = parseFloat(entradaY2.value);
  // Fórmula: y = a*(x - x1)^2 + y1, donde a se calcula con los puntos de control
  const a = (y2 - y1) / Math.pow(x2 - x1, 2);
  return a * Math.pow(x - x1, 2) + y1;
};

/**
 * Calcula la interpolación lineal entre dos puntos.
 * @param {number} x1 - Primer valor de x.
 * @param {number} x2 - Segundo valor de x.
 * @param {number} y1 - Primer valor de y.
 * @param {number} y2 - Segundo valor de y.
 * @param {number} x - Valor de x para el cual se desea interpolar.
 * @returns {number} Valor interpolado de y.
 */
const interpolacionLineal = (x1, x2, y1, y2, x) => {
  let m = (y2 - y1) / (x2 - x1);
  return y1 + m * (x - x1);
};

/**
 * Recopila y calcula todos los datos necesarios para la gráfica y la tabla.
 * @returns {object} Objeto con los datos calculados.
 */
const calcularDatos = () => {
  const x1 = parseFloat(entradaX1.value);
  const y1 = parseFloat(entradaY1.value);
  const x2 = parseFloat(entradaX2.value);
  const y2 = parseFloat(entradaY2.value);
  const x = parseFloat(entradaX.value);
  const yInterpolado = interpolacionLineal(x1, x2, y1, y2, x);
  const yReal = funcionValorReal(x);

  // Generación de puntos para la curva de la función real
  let puntosCurvaRealX = [];
  let puntosCurvaRealY = [];
  const pasos = 20;
  for (let i = 0; i <= pasos; i++) {
    const xi = x1 + ((x2 - x1) * i) / pasos;
    puntosCurvaRealX.push(xi);
    puntosCurvaRealY.push(funcionValorReal(xi));
  }

  return { x1, y1, x2, y2, x, yInterpolado, yReal, puntosCurvaRealX, puntosCurvaRealY };
};

/**
 * Actualiza los datos de la gráfica y la tabla con los nuevos valores.
 */
const actualizarDatos = () => {
  const { x1, y1, x2, y2, x, yInterpolado, yReal, puntosCurvaRealX, puntosCurvaRealY } = calcularDatos();

  // Actualización de datos en la gráfica
  datos[0].x = [x1, x2];
  datos[0].y = [y1, y2];
  datos[1].x = [x];
  datos[1].y = [yInterpolado];
  datos[2].x = [x];
  datos[2].y = [yReal];
  datos[3].x = puntosCurvaRealX;
  datos[3].y = puntosCurvaRealY;

  // Actualización del mensaje de respuesta
  respuesta.textContent = `Valor interpolado: ${yInterpolado.toFixed(4)} | Valor real simulado: ${yReal.toFixed(4)} | Diferencia: ${Math.abs(yInterpolado - yReal).toFixed(4)}`;

  // Actualización de la tabla de resultados
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

/**
 * Inicializa la gráfica.
 */
const graficar = () => {
  actualizarDatos();
  Plotly.newPlot("plot", datos, layout, config);
};

/**
 * Redibuja la gráfica con los nuevos datos.
 */
const redibujar = () => {
  actualizarDatos();
  Plotly.redraw("plot");
};

// ================================
// Eventos: Carga de la página y cambios en el formulario
// ================================
window.addEventListener("load", graficar);
formularioDatos.addEventListener("change", redibujar);
