// Código completo migrado desde tu index.html

let movimientos = [], movimientosFiltrados = [];
let grafica, graficaMensual, graficaIngresos, graficaGastos;

const gruposCategorias = {
    alimentacion: ["Desayuno", "Comida", "Cena", "Snacks", "Café", "Panadería", "Tortillas"],
    transporte: ["Uber/Didi", "Camión", "Estacionamiento", "Casetas", "Gasolina"],
    hogar: ["Agua Garrafón", "Limpieza", "Papel Higiénico", "Focos", "Gas LP"],
    mandado: ["Verduras", "Frutas", "Carnes", "Pan", "Refrescos", "Mandado"],
    tecnologia: ["Recarga teléfono", "Impresiones", "Teléfono"],
    personales: ["Aseo personal", "Helado", "Regalo pequeño", "Chivo", "Manutención", "Mis Gastos", "Otros"],
    trabajo: ["Herramientas", "Material oficina", "Refacciones pequeñas", "Nómina"],
    salud: ["Medicinas", "Curitas"],
    ninos: ["Lonche escolar", "Útiles escolares"],
    mascotas: ["Comida mascota", "Arena"]
};

let todasLasCategorias = [...new Set(Object.values(gruposCategorias).flat())];

function formatoFechaIOS(f) {
    const d = new Date(f);
    return d.toLocaleDateString("es-MX") + " " + d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

function guardar() { localStorage.setItem("movimientos", JSON.stringify(movimientos)); }
function cargar() {
    const d = localStorage.getItem("movimientos");
    if (d) movimientos = JSON.parse(d).map(m => ({ ...m, fecha: new Date(m.fecha) }));
}

// Render dinámico
function render() {
    document.getElementById('root').innerHTML = `
        <div class="card">
            <h2>Registrar movimiento</h2>
            <input type="text" id="monto" placeholder="Monto 0.00">
            <select id="tipo"><option value="entrada">Entrada</option><option value="salida">Gasto</option></select>
            <select id="grupoCategorias" onchange="filtrarCategoriasPorGrupo()">
                <option value="all">Todas</option>
                ${Object.keys(gruposCategorias).map(g=>`<option value="${g}">${g}</option>`).join('')}
            </select>
            <select id="categoria"></select>
            <button onclick="agregarMovimiento()">Agregar</button>
        </div>
        <div class="card"><h2>Movimientos</h2><table><thead><tr>
            <th>Monto</th><th>Tipo</th><th>Categoría</th><th>Fecha</th><th></th>
        </tr></thead><tbody id="tabla"></tbody></table></div>
        <button onclick="borrarTodosLosDatos()">Borrar todo</button>
    `;

    cargarCategorias();
    filtrarCategoriasPorGrupo();
    actualizar();
}

function cargarCategorias() {
    const cat = document.getElementById('categoria');
    cat.innerHTML = todasLasCategorias.map(c=>`<option>${c}</option>`).join('');
}

function filtrarCategoriasPorGrupo() {
    const g = document.getElementById('grupoCategorias').value;
    const cat = document.getElementById('categoria');
    cat.innerHTML = (g==='all'?todasLasCategorias:gruposCategorias[g]).map(c=>`<option>${c}</option>`).join('');
}

function agregarMovimiento() {
    const montoInput = document.getElementById("monto");
    const monto = parseFloat(montoInput.value.replace(",", "."));
    if (!monto || monto <= 0) return alert("Monto inválido");

    movimientos.push({ monto, tipo: document.getElementById('tipo').value, categoria: document.getElementById('categoria').value, fecha: new Date() });
    guardar(); actualizar(); montoInput.value = '';
}

function eliminar(i){ movimientos.splice(i,1); guardar(); actualizar(); }

function actualizarTabla(){
    const tabla = document.getElementById('tabla');
    tabla.innerHTML = movimientos.map((m,i)=>`
        <tr><td>$${m.monto.toFixed(2)}</td><td>${m.tipo}</td><td>${m.categoria}</td>
        <td>${formatoFechaIOS(m.fecha)}</td>
        <td><button onclick="eliminar(${i})">❌</button></td></tr>`).join('');
}

function actualizar(){ actualizarTabla(); }
function borrarTodosLosDatos(){ if(confirm('¿Borrar todo?')) { movimientos=[]; guardar(); actualizar(); } }

document.addEventListener('DOMContentLoaded', ()=>{ cargar(); render(); });
