const socket = io();

// Función para renderizar Lista de Productos
function renderProducts(products) {
    const container = document.querySelector('#productsSection .vistaProductos');
    if (!container) return;
    if (products.length === 0) {
        container.innerHTML = 
        `<div class="productDetails">
            <h4>Los productos han sido borrados</h4>
            <p>Si quieres ver los juegos disponibles, haz click en Restaurar Lista de productos</p>
        </div>`;
        return;
    }
    container.innerHTML = products.map(product => 
        `<article class="productCard" id="${product.id}">
            <h4>${product.title}</h4>
            <p>${product.description}</p>
            <div class="productDetails">
                <ul>
                    <li>Precio: $${product.price}</li>
                    <li>Categoría: ${product.category}</li>
                    <li>Stock: ${product.stock}</li>
                </ul>
                <button type="button"
                        class="btnDanger"
                        onclick="deleteProduct('${product.id}')">
                    Eliminar Producto
                </button>
            </div>
        </article>
    `).join('');
}

// Agregar producto
async function addProduct() {
    const form = document.getElementById("createProductForm");
    const product = {
        title: form.title.value,
        description: form.description.value,
        category: form.category.value,
        price: Number(form.price.value),
        stock: Number(form.stock.value),
        status: form.status.value === "true",
        code: form.code.value,
        thumbnails: [
            form.img1.value,
            form.img2.value,
            form.img3.value,
            form.img4.value
        ]
    };
    try {
        const resp = await fetch("/realtimeproducts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
        const data = await resp.json();
        if (!data.ok) alert('No se pudo agregar el producto');
        alert("Producto agregado correctamente");
    } catch (error) {
        console.error("Error al agregar producto:", error);
    }
};

// Actualizar producto
async function updateProduct() {
    const form = document.getElementById('updateProductForm');
    const id = form.idProducto.value;
    const updatedFields = {
        stock: Number(form.stock.value),
        status: form.status.value === 'true'
    };
    try {
        const resp = await fetch(`/realtimeproducts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFields)
        });
        const data = await resp.json();
        if (!data.msg) alert('No se pudo actualizar el producto');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
    }
}

//Borrar producto por id
async function deleteProduct(id) {
    try {
        const resp = await fetch(`/realtimeproducts/${id}`, {
            method: 'DELETE'
        });
        const data = await resp.json();
        if (!data.ok) {
            alert('No se pudo eliminar el producto');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}


// Funciones llamadas desde los botones
window.deleteAllProducts = async () => {
    try {
        const resp = await fetch('/realtimeproducts/all', { method: 'DELETE' });
        const data = await resp.json();
        if (data.ok) {
            alert('Todos los productos fueron eliminados.');
        }
    } catch (error) {
        console.error('Error al eliminar todos los productos:', error);
    }
};

window.createProductsFile = async () => {
    try {
        const resp = await fetch('/realtimeproducts/reset', { method: 'POST' });
        const data = await resp.json();
        if (data.ok) {
            alert('Productos restaurados.');
        }
    } catch (error) {
        console.error('Error al restaurar productos:', error);
    }
};

// Socket emits en tiempo real
socket.on('connect', () => {
    console.log('Conectado al servidor de sockets con ID:', socket.id);
});

['productsUpdated', 'productsDeletedAll', 'productsReset'].forEach(event => {
    // Productos vacíos por defecto si no se detectan
    socket.on(event, (products = []) => {  
        renderProducts(products);
    });
});