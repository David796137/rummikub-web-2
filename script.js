// Utilidades para generar fichas (números y colores)
const colores = ['azul', 'rojo', 'negro', 'naranja'];
const NUM_FICHAS = 14;

// Genera una ficha aleatoria (número y color)
function fichaAleatoria() {
    const numero = Math.floor(Math.random() * 13) + 1; // 1 a 13
    const color = colores[Math.floor(Math.random() * colores.length)];
    return { numero, color };
}

// Genera la "mano" del jugador
function repartirFichas() {
    let fichas = [];
    for (let i = 0; i < NUM_FICHAS; i++) {
        fichas.push(fichaAleatoria());
    }
    return fichas;
}

// Dibuja las fichas y permite seleccionarlas
function mostrarFichas(fichas, seleccionadas) {
    const fichasDiv = document.getElementById("fichas");
    fichasDiv.innerHTML = "";
    fichas.forEach((ficha, idx) => {
        const el = document.createElement("span");
        el.className = "ficha" + (seleccionadas.has(idx) ? " seleccionada" : "");
        el.innerText = ficha.numero;
        el.title = ficha.color;
        el.style.color = ficha.color;
        el.onclick = () => {
            // Alterna selección
            if (seleccionadas.has(idx)) {
                seleccionadas.delete(idx);
            } else {
                seleccionadas.add(idx);
            }
            mostrarFichas(fichas, seleccionadas);
            document.getElementById("jugarBtn").disabled = seleccionadas.size < 3;
        };
        fichasDiv.appendChild(el);
    });
}

window.onload = function() {
    const modal = document.getElementById("instruccionesModal");
    const juego = document.getElementById("juego");
    const comenzarBtn = document.getElementById("comenzarBtn");

    let fichasJugador = [];
    let seleccionadas = new Set();

    comenzarBtn.onclick = function() {
        modal.style.display = "none";
        juego.style.display = "block";
    };

    document.getElementById("repartirBtn").onclick = function() {
        fichasJugador = repartirFichas();
        seleccionadas = new Set();
        mostrarFichas(fichasJugador, seleccionadas);
        document.getElementById("jugarBtn").disabled = true;
        document.getElementById("mensaje").innerText = "";
    };

    document.getElementById("jugarBtn").onclick = function() {
        const jugada = Array.from(seleccionadas).map(idx => fichasJugador[idx]);
        const valido = validarJugada(jugada);
        document.getElementById("mensaje").innerText = valido ?
            "¡Jugada válida!" : "Jugada inválida. Debe ser grupo o escalera.";
    };
};

// Valida si un arreglo de fichas es grupo o escalera
function validarJugada(jugada) {
    if (jugada.length < 3) return false;

    // ¿Es grupo? (igual número, todos colores diferentes)
    const num = jugada[0].numero;
    const coloresSet = new Set();
    let esGrupo = jugada.every(f => f.numero === num && !coloresSet.has(f.color) && coloresSet.add(f.color));
    if (esGrupo) return true;

    // ¿Es escalera? (igual color, números consecutivos)
    const color = jugada[0].color;
    let nums = jugada.map(f => f.numero).sort((a, b) => a - b);
    let esEscalera = jugada.every(f => f.color === color);
    if (esEscalera) {
        for (let i = 1; i < nums.length; i++) {
            if (nums[i] !== nums[i - 1] + 1) return false;
        }
        return true;
    }
    return false;
}