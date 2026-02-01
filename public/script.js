// Socket connection
const socket = io();



// Helper function to render product list dynamically
function renderProducts(products) {
    const container = document.querySelector('section:nth-of-type(2)'); // Products list section
    const productsHtml = products.map(product => `
        <article class="productCard" id="${product.id}">
            <h4>${product.title}</h4>
            <p>${product.description}</p>
            <div class="productDetails">
                <ul>
                    <li>Precio: $${product.price}</li>
                    <li>Categoría: ${product.category}</li>
                    <li>Stock: ${product.stock}</li>
                </ul>
                <button class="btnDanger" onclick="deleteProduct('${product.id}')">Eliminar Producto</button>
            </div>
        </article>
    `).join('');
    container.innerHTML = '<h1>Productos Actualizados:</h1>' + productsHtml;
}

const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = productForm.title.value;
    const description = productForm.description.value;
    const category = productForm.category.value;
    const price = productForm.price.value;
    const stock = productForm.stock.value;
    const status = productForm.status.value;
    const code = productForm.code.value;
    // Array de imágenes falsas
    const images = [ 
        productForm.img1.value,
        productForm.img2.value,
        productForm.img3.value,
        productForm.img4.value
    ];

    const formData = {
        title,
        description,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        status: status === 'true',
        code
    };
    try {
        fetch('/api/products', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert(`Producto agregado: ${data.product.title}`);
    });

    productForm.reset();
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
});

// Functions called from the realTimeProducts view buttons
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

socket.on('productsReset', (products) => {
    renderProducts(products);
});

socket.on('productsDeletedAll', () => {
    renderProducts([]);
});

socket.on('newProduct', (product) => {
    location.reload();
});

socket.on('updateProduct', (data) => {
    location.reload();
});

socket.on('deleteProduct', (data) => {
    location.reload();
});