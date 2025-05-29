let chart;
// Laura, Leonardo e Samuel
function gerarGrafico() {
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  const c = parseFloat(document.getElementById("c").value);
  const corGrafico = document.getElementById("corGrafico").value;
  const corPontos = document.getElementById("corPontos").value;

  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    alert("Preencha todos os coeficientes corretamente!");
    return;
  }

  if (a === 0) {
    alert("O coeficiente 'a' deve ser diferente de zero!");
    return;
  }

  const xVals = [];
  const yVals = [];
  const xMin = -10, xMax = 10, step = 0.1;

  for (let x = xMin; x <= xMax; x += step) {
    const y = a * x * x + b * x + c;
    xVals.push(x);
    yVals.push(y);
  }

  const verticeX = -b / (2 * a);
  const verticeY = a * verticeX * verticeX + b * verticeX + c;
  const interseccaoY = { x: 0, y: c };

  let pontosPrincipais = [
    { x: verticeX, y: verticeY },
    interseccaoY
  ];

  const delta = b * b - 4 * a * c;
  let raiz1, raiz2;

  if (delta >= 0) {
    raiz1 = (-b + Math.sqrt(delta)) / (2 * a);
    raiz2 = (-b - Math.sqrt(delta)) / (2 * a);
    pontosPrincipais.push({ x: raiz1, y: 0 });
    pontosPrincipais.push({ x: raiz2, y: 0 });
  }

  const ctx = document.getElementById('grafico').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xVals,
      datasets: [
        {
          label: 'f(x) = ax² + bx + c',
          data: xVals.map((x, i) => ({ x: x, y: yVals[i] })),
          borderColor: corGrafico,
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        },
        {
          type: 'scatter',
          label: 'Pontos Principais',
          data: pontosPrincipais,
          backgroundColor: corPontos,
          pointRadius: 6,
          showLine: false
        }
      ]
    },
    options: {
      animation: { duration: 1000 },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: -10,
          max: 10,
          grid: {
            color: (ctx) => ctx.tick.value === 0 ? '#000' : '#ccc',
            lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1
          },
          title: {
            display: true,
            text: 'x'
          }
        },
        y: {
          min: -10,
          max: 10,
          grid: {
            color: (ctx) => ctx.tick.value === 0 ? '#000' : '#ccc',
            lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1
          },
          title: {
            display: true,
            text: 'f(x)'
          }
        }
      },
      plugins: {
        legend: { display: true },
        zoom: {
          pan: {
            enabled: false,
            mode: 'xy'
          },
          zoom: {
            drag: {
              enabled: false  
            },
            wheel: {
              enabled: false
            },
            pinch: {
              enabled: false
            },
            mode: 'xy'
          }
        }
      }
    },
    plugins: [ChartZoom]
  });

  const infoDiv = document.getElementById("info-equacao");
  let infoHTML = `<h3>Informações da Equação</h3>`;
  infoHTML += `<p><strong>Equação:</strong> f(x) = ${a}x² + ${b}x + ${c}</p>`;
  infoHTML += `<p><strong>Δ (delta):</strong> ${delta}</p>`;

  if (delta > 0) {
    infoHTML += `<p><strong>Raízes reais:</strong> x₁ = ${raiz1.toFixed(2)}, x₂ = ${raiz2.toFixed(2)}</p>`;
  } else if (delta === 0) {
    infoHTML += `<p><strong>Raiz real única:</strong> x = ${verticeX.toFixed(2)}</p>`;
  } else {
    infoHTML += `<p><strong>Não há raízes reais.</strong></p>`;
  }

  infoHTML += `<p><strong>Vértice:</strong> (${verticeX.toFixed(2)}, ${verticeY.toFixed(2)})</p>`;
  infoHTML += `<p><strong>Intercepto com o eixo y:</strong> (0, ${c})</p>`;

  infoDiv.innerHTML = infoHTML;
}

function ativarZoom() {
  if (chart) {
    chart.options.plugins.zoom.zoom.wheel.enabled = true;
    chart.options.plugins.zoom.pan.enabled = true;
    chart.options.plugins.zoom.zoom.drag.enabled = true;
    chart.update();
  }
}

function desativarZoom() {
  if (chart) {
    chart.options.plugins.zoom.zoom.wheel.enabled = false;
    chart.options.plugins.zoom.pan.enabled = false;
    chart.options.plugins.zoom.zoom.drag.enabled = false;
    chart.update();
  }
}

function resetarZoom() {
  if (chart) {
    chart.resetZoom();
  }
}
