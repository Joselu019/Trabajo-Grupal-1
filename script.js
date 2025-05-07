// Parte 1 - Gestión de zonas y tarifas
const datosZonas = [
    ["Norte", 5.0, [12, 15, 14, 13, 16, 14, 17]],
    ["Este", 4.5, [9, 8, 12, 10, 11, 10, 9]],
    ["Sur", 4.8, [11, 13, 15, 14, 12, 13, 11]]
];

let productoSeleccionado = null;

function calcularPromedioPedidos() {
    const cuerpoTablaZonas = document.querySelector("#tablaZonas tbody");
    cuerpoTablaZonas.innerHTML = "";

    let zonaMasActiva = "";
    let promedioMasAlto = 0;

    datosZonas.forEach(zona => {
        const [nombre, tarifa, pedidos] = zona;
        const promedio = _.round(_.sum(pedidos) / pedidos.length, 2);

        if (promedio > promedioMasAlto) {
            promedioMasAlto = promedio;
            zonaMasActiva = nombre;
        }

        const fila = document.createElement("tr");
        fila.className = "fila-tabla";
        fila.innerHTML = `
            <td class="celda-dato">${nombre}</td>
            <td class="celda-dato">${tarifa}</td>
            <td class="celda-dato">${pedidos.join(", ")}</td>
            <td class="celda-dato">${promedio}</td>
        `;
        cuerpoTablaZonas.appendChild(fila);
    });

    alert(`La zona más activa es ${zonaMasActiva} con un promedio de ${promedioMasAlto} pedidos por día`);
}

// Parte 3 - Gestión de productos
let productos = [
    { id: 1, nombre: "Portátil", precio: 1200, stock: 8 },
    { id: 2, nombre: "Teléfono", precio: 600, stock: 15 },
    { id: 3, nombre: "Tablet", precio: 400, stock: 10 },
    { id: 4, nombre: "Monitor", precio: 300, stock: 5 }
];

function reasignarIds() {
    productos.forEach((producto, index) => {
        producto.id = index + 1;
    });
    administradorProductos.sincronizarCon(productos);
}

function mostrarProductos(productosAMostrar = productos) {
    const cuerpoTablaProductos = document.querySelector("#tablaProductos tbody");
    cuerpoTablaProductos.innerHTML = "";

    productosAMostrar.forEach(producto => {
        const fila = document.createElement("tr");
        fila.className = "fila-tabla";
        fila.innerHTML = `
            <td class="celda-dato">${producto.id}</td>
            <td class="celda-dato">${producto.nombre}</td>
            <td class="celda-dato">${producto.precio}€</td>
            <td class="celda-dato">${producto.stock}</td>
            <td class="celda-dato">
                <button onclick="actualizarStock(${producto.id})" class="boton">Actualizar Stock</button>
                <button onclick="eliminarProducto(${producto.id})" class="boton">Eliminar</button>
            </td>
        `;
        cuerpoTablaProductos.appendChild(fila);
    });
}

function agregarProducto() {
    const nombre = document.getElementById("nombreProducto").value;
    const precio = parseFloat(document.getElementById("precioProducto").value);
    const stock = parseInt(document.getElementById("stockProducto").value);

    if (!nombre || isNaN(precio) || isNaN(stock)) {
        alert("Por favor complete todos los campos con datos válidos");
        return;
    }

    const nuevoProducto = { id: 0, nombre, precio, stock }; // ID temporal
    productos.push(nuevoProducto);
    reasignarIds();
    mostrarProductos();

    // Limpiar campos
    document.getElementById("nombreProducto").value = "";
    document.getElementById("precioProducto").value = "";
    document.getElementById("stockProducto").value = "";
}

function eliminarProducto(id) {
    productos = productos.filter(producto => producto.id !== id);
    reasignarIds();
    mostrarProductos();
}

function actualizarStock(id) {
    productoSeleccionado = id;
    const modal = document.getElementById("modalStock");
    const input = document.getElementById("nuevoStockInput");
    input.value = "";
    modal.style.display = "block";
}

function filtrarProductosPorStock() {
    const umbral = parseInt(document.getElementById("filtroStock").value);
    if (isNaN(umbral)) {
        alert("Por favor ingrese un número válido");
        return;
    }

    const productosFiltrados = productos.filter(producto => producto.stock < umbral);
    mostrarProductos(productosFiltrados);
}

// Parte 4 - Clase genérica
class AdministradorColecciones {
    constructor() {
        this.elementos = [];
    }

    agregar(elemento) {
        this.elementos.push(elemento);
    }

    eliminarPorId(id) {
        this.elementos = this.elementos.filter(elemento => elemento.id !== id);
    }

    buscarPorId(id) {
        return this.elementos.find(elemento => elemento.id === id);
    }

    listarTodos() {
        return [...this.elementos];
    }

    sincronizarCon(lista) {
        this.elementos = [...lista];
    }
}

const administradorProductos = new AdministradorColecciones();
administradorProductos.sincronizarCon(productos);

// Parte 5 - Método genérico
function compararPorClave(arr, clave) {
    return _.orderBy(arr, [clave], ['asc']);
}

// Inicialización de la aplicación
function inicializarAplicacion() {
    mostrarProductos();

    // Event listeners existentes
    document.getElementById("calcularPromedio").addEventListener("click", calcularPromedioPedidos);
    document.getElementById("agregarProducto").addEventListener("click", agregarProducto);
    document.getElementById("filtrarProductos").addEventListener("click", filtrarProductosPorStock);
    document.getElementById("restablecerFiltro").addEventListener("click", () => mostrarProductos());
    document.getElementById("buscarPorTarifa").addEventListener("click", buscarPorTarifa);
    document.getElementById("restablecerTarifas").addEventListener("click", () => mostrarZonasFiltradas());
    mostrarZonasFiltradas();

    // Event listeners para el modal de stock
    document.getElementById("confirmarStock").addEventListener("click", () => {
        const nuevoStock = parseInt(document.getElementById("nuevoStockInput").value);
        if (isNaN(nuevoStock)) {
            alert("Por favor ingrese una cantidad válida");
            return;
        }

        const producto = productos.find(p => p.id === productoSeleccionado);
        if (producto) {
            producto.stock = nuevoStock;
            mostrarProductos();
            document.getElementById("modalStock").style.display = "none";
        }
    });

    document.getElementById("cancelarStock").addEventListener("click", () => {
        document.getElementById("modalStock").style.display = "none";
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
        const modal = document.getElementById("modalStock");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Event listener para búsqueda de elementos
    document.getElementById("buscarElemento").addEventListener("click", () => {
        const id = parseInt(document.getElementById("entradaColeccion").value);
        if (isNaN(id)) {
            alert("Por favor ingrese un ID válido");
            return;
        }

        const elemento = administradorProductos.buscarPorId(id);
        const resultadoDiv = document.getElementById("resultadoBusqueda");

        if (elemento) {
            resultadoDiv.innerHTML = `
                <p><strong>Elemento encontrado:</strong></p>
                <p>ID: ${elemento.id}</p>
                <p>Nombre: ${elemento.nombre}</p>
                <p>Precio: ${elemento.precio}€</p>
                <p>Stock: ${elemento.stock}</p>
            `;
        } else {
            resultadoDiv.innerHTML = "<p>No se encontró ningún elemento con ese ID</p>";
        }
    });
}

document.addEventListener("DOMContentLoaded", inicializarAplicacion);


function mostrarZonasFiltradas(zonas = datosZonas) {
    const cuerpoTablaZonas = document.querySelector("#tablaZonas tbody");
    cuerpoTablaZonas.innerHTML = "";

    zonas.forEach(zona => {
        const [nombre, tarifa, pedidos] = zona;
        const promedio = _.round(_.sum(pedidos) / pedidos.length, 2);

        const fila = document.createElement("tr");
        fila.className = "fila-tabla";
        fila.innerHTML = `
            <td class="celda-dato">${nombre}</td>
            <td class="celda-dato">${tarifa}</td>
            <td class="celda-dato">${pedidos.join(", ")}</td>
            <td class="celda-dato">${promedio}</td>
        `;
        cuerpoTablaZonas.appendChild(fila);
    });
}

function buscarPorTarifa() {
    const tarifaBuscada = parseFloat(document.getElementById("buscarTarifa").value);
    
    if (isNaN(tarifaBuscada)) {
        alert("Por favor ingrese una tarifa válida");
        return;
    }

    const zonasFiltradas = datosZonas.filter(zona => zona[1] === tarifaBuscada);
    
    if (zonasFiltradas.length === 0) {
        alert("No se encontraron zonas con esa tarifa exacta");
        return;
    }

    mostrarZonasFiltradas(zonasFiltradas);
}