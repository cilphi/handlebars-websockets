import { Router } from "express";
import { ProductManager } from '../managers/productManager.js';
import { io } from '../../app.js';

const router = Router();

//GET Lista productos
router.get('/', async (req, res) => {
    const productManager = new ProductManager("./src/json/products.json");
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { title: 'Lista de productos', products
    });
});

//GET Producto por ID
router.get('/:id', async (req, res) => {
    try {
    const {id} = req.params;
    const productManager = new ProductManager("./src/json/products.json");
    const product = await productManager.getProductById(id);
    res.json({msg: 'Producto encontrado', product: product});
    } catch (error) {
        res.status(500).json({msg: 'Error al obtener el producto'});
    }
});

//POST Crear lista de productos
router.post('/reset', async (req, res) => {
    try {
        const productManager = new ProductManager("./src/json/products.json");
        await productManager.createProductsFile();
        // Load products to broadcast the current list
        const products = await productManager.getProducts();
        io.emit('productsReset', products);
        return res.json({ ok: true, message: 'products.json created if missing', products });
    } catch (error) {
        console.error('Error in reset endpoint:', error);
        return res.status(500).json({ ok: false, message: 'Error creating products.json' });
    }
});

//POST Crear producto
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        if (!body.title || !body.description || !body.price || !body.code || !body.stock || !body.category) {
            return res.status(400).json({ ok: false, msg: 'Faltan datos obligatorios' });
        }
        const productManager = new ProductManager("./src/json/products.json");
        await productManager.addProduct(body);
        const products = await productManager.getProducts();
        io.emit('productsUpdated', products);
        res.json({ ok: true, products });
    } catch (error) {
        res.status(500).json({ ok: false });
    }
});

//PUT
router.put('/:id', async (req, res) => {
    try {
    const {id} = req.params;
    const body = req.body;
    const productManager = new ProductManager("./src/json/products.json");
    const updatedProduct = await productManager.updateProduct(id, body);
    if (updatedProduct === null) {
        return res.status(404).json({msg: 'Producto no encontrado'});
    }
    const products = await productManager.getProducts();
    io.emit('productsUpdated', products);
    res.json({msg: 'Producto actualizado', product: updatedProduct});
    } catch (error) {
        res.status(500).json({msg: 'Error al actualizar el producto'});
    }
});

//DELETE Borrar todos los productos
router.delete('/all', async (req, res) => {
    try {
        const productManager = new ProductManager("./src/json/products.json");
        await productManager.deleteAllProducts();
        // Broadcast that products were removed (empty list)
        io.emit('productsDeletedAll', []);
        return res.json({ ok: true, message: 'products.json deleted if it existed' });
    } catch (error) {
        console.error('Error in delete-all endpoint:', error);
        return res.status(500).json({ ok: false, message: 'Error deleting products.json' });
    }
});

//DELETE Borrar un producto
router.delete('/:id', async (req, res) => {
    const productManager = new ProductManager("./src/json/products.json");
    const deletedProduct = await productManager.deleteProduct(req.params.id);

    if (!deletedProduct) {
        return res.status(404).json({ ok: false });
    }

    const products = await productManager.getProducts();

    io.emit('productsUpdated', products);

    res.json({ ok: true });
});

export default router;