import {Router} from 'express';
import fs from 'fs';
import path from 'path';
import {basePath} from '../utils/utils.js';

const router = Router();

/* Uso Handlebars */
router.get('/', (__, res) => {
    const file = path.resolve(basePath + '/src/json/products.json');
    const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
    res.render('home', {title: 'Lista de productos', products: products});
});

export default router;