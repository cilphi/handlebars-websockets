import { Router } from "express";
import { ProductManager } from '../managers/productManager.js';
import {io} from '../app.js';

const router = Router();

//GET Lista productos
router.get('/', async (__,res) => {
    try {
        const productManager = new ProductManager("../json/products.json");
        const products = await productManager.getProducts();
    
    res.json(products);
    res.render('realTimeProducts', {title: 'Lista de productos', products: products});
    } catch (error) {
        res.status(500).json({msg: 'Error al obtener los productos'});
    }
});

//GET Producto por ID
router.get('/:id', async (req, res) => {
    try {
    const {id} = req.params;
    const productManager = new ProductManager("../json/products.json");
    const product = await productManager.getProductById(id);
    res.json({msg: 'Producto encontrado', product: product});
    } catch (error) {
        res.status(500).json({msg: 'Error al obtener el producto'});
    }
});

//POST Crear producto
router.post('/', async (req, res) => {
    const body = req.body;
    if (!body.title || !body.description || !body.price || !body.code || !body.stock || !body.category) {
        return res.status(400).json({msg: 'Faltan datos obligatorios para crear el producto'});
    }
    const productManager = new ProductManager("../json/products.json");
    const newProduct = await productManager.addProduct(body);
    io.emit('newProduct', newProduct);
    res.json("products",{type: 'POST', msg: 'Producto agregado', product: newProduct});
    res.render('realTimeProducts', {title: 'Lista de productos', products: newProduct});
});

//PUT
router.put('/:id', async (req, res) => {
    try {
    const {id} = req.params;
    const body = req.body;
    const productManager = new ProductManager("../json/products.json");
    const updatedProduct = await productManager.updateProduct(id, body);
    if (updatedProduct === null) {
        return res.status(404).json({msg: 'Producto no encontrado'});
    }
    io.emit('updateProduct', {type:'PUT',msg:'Producto actualizado', product: updatedProduct});
    res.json({msg: 'Producto actualizado', product: updatedProduct});
    res.render('realTimeProducts', {title: 'Lista de productos', products: updatedProduct});
    } catch (error) {
        res.status(500).json({msg: 'Error al actualizar el producto'});
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const productManager = new ProductManager("../json/products.json");
        const deletedProduct = await productManager.deleteProduct(id);
        if (deletedProduct === null) {
            return res.status(404).json({msg: 'Producto no encontrado'});
        }
        io.emit('deleteProduct', {type: 'DELETE', product: deletedProduct});
        res.json({msg: 'Producto eliminado', product: deletedProduct});
        res.render('realTimeProducts', {title: 'Lista de productos', products: deletedProduct});
    } catch (error) {
        res.status(500).json({msg: 'Error al eliminar el producto'});
    }
});

export default router;