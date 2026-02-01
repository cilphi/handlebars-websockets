import crypto from 'crypto';
import {promises as fsPromises} from 'fs';

// Default products for initialization
const originalProducts = [
    {
        id: "c1b9a7e4-3a4f-4c9a-9f6b-1a2e3d4f5a01",
        title: "Catan",
        description: "Juego de estrategia y negociación donde los jugadores colonizan una isla y comercian recursos.",
        code: "SKU-CATAN",
        price: 45.99,
        stock: 12,
        status: true,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/catan/img1.jpg",
        "https://example.com/catan/img2.jpg",
        "https://example.com/catan/img3.jpg",
        "https://example.com/catan/img4.jpg"
        ]
    },
    {
        id: "a4d2c8f1-7b2e-4e6a-8c91-0f3b2e1d9a22",
        title: "Carcassonne",
        description: "Juego de colocación de losetas donde se construyen ciudades, caminos y campos.",
        code: "SKU-CARC",
        price: 39.5,
        stock: 8,
        status: true,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/carcassonne/img1.jpg",
        "https://example.com/carcassonne/img2.jpg",
        "https://example.com/carcassonne/img3.jpg",
        "https://example.com/carcassonne/img4.jpg"
        ]
    },
    {
        id: "f7e1b9c3-2a8d-4c4f-9e71-6d0a1b3c8f33",
        title: "Ticket to Ride",
        description: "Juego familiar de construcción de rutas ferroviarias a lo largo del mapa.",
        code: "SKU-TTR",
        price: 49.99,
        stock: 0,
        status: false,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/tickettoride/img1.jpg",
        "https://example.com/tickettoride/img2.jpg",
        "https://example.com/tickettoride/img3.jpg",
        "https://example.com/tickettoride/img4.jpg"
        ]
    },
    {
        id: "9d3a6f2e-5b8c-4e1a-9c2f-7a4b6d8e1a44",
        title: "Dixit",
        description: "Juego creativo de cartas e ilustraciones basado en la imaginación y la narrativa.",
        code: "SKU-DIXIT",
        price: 34.75,
        stock: 15,
        status: true,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/dixit/img1.jpg",
        "https://example.com/dixit/img2.jpg",
        "https://example.com/dixit/img3.jpg",
        "https://example.com/dixit/img4.jpg"
        ]
    },
    {
        id: "2e6c9a1b-4f5d-4a2c-8b71-9f3e0d6a5b55",
        title: "Pandemic",
        description: "Juego cooperativo donde los jugadores trabajan juntos para detener brotes de enfermedades globales.",
        code: "SKU-PAND",
        price: 44.0,
        stock: 5,
        status: true,
        category: "Juegos de mesa",
        thumbnails: [
        "https://example.com/pandemic/img1.jpg",
        "https://example.com/pandemic/img2.jpg",
        "https://example.com/pandemic/img3.jpg",
        "https://example.com/pandemic/img4.jpg"
        ]
    }
];

//Clase ProductManager
export class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }
    
    // Crear archivo con productos por defecto si no existe
    async createProductsFile() {
        try {
            await fsPromises.access(this.filePath);
            console.log('El archivo products.json ya existe. No se sobrescribirá.');
            return false;
        } catch (error) {
            if (error.code === 'ENOENT') {
                try {
                    await this.#writeProducts(originalProducts);
                    console.log('El archivo con los productos por defecto fue creado con éxito.');
                    return true;
                } catch (writeError) {
                    console.error('Error al crear el archivo de productos:', writeError);
                    throw writeError;
                }
            } else {
                throw error;
            }
        }
    }

    //Escribir en el archivo de productos
    async #writeProducts (products) {
        try {
            await fsPromises.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
            console.log('El archivo con los productos fue creado con éxito.');
        } catch (error) {
            console.error('Error al crear el archivo de productos:', error);
            throw error;
        }
    }

    //Taer productos desde el archivo
    async getProducts() {
        try {
            const data = await fsPromises.readFile(this.filePath, 'utf-8');
            if (!data) return [];
            const parsed = JSON.parse(data);
            console.log('Productos cargados desde el archivo:', parsed);
            return parsed;
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            console.error('Error al leer el archivo de productos:', error);
            throw error;
        }
    }
    
    //Traer producto por ID
    async getProductById (id) {
        try {
            const products = await this.getProducts();
            const product = products.find(item => item.id === id);
            if (!product) {
                return {};
            } return product;
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error);
        }
    }
        
    //Agregar un nuevo producto
    async addProduct (newProduct) {
        try {
            const products = await this.getProducts();
            const exists = products.some(item => item.code === newProduct.code);
            if (exists) {
                console.log('Error: Ya existe un producto con el código:', newProduct.code);
                return null;
            }
            const id = crypto.randomUUID();
            const productToSave = { id, ...newProduct };
            products.push(productToSave);
            await this.#writeProducts(products);
            console.log('Nuevo producto agregado con éxito:', productToSave);
            return productToSave;
        } catch (error) {
            console.error('Error al agregar el nuevo producto:', error);
            throw error;
        }
    }
    
    //Actualizar un producto
    async updateProduct (id, updatedFields) {
        try {
            const products = await this.getProducts();
            const exists = products.some(item => item.id === id);
            if (!exists) {
                console.log('Error: No existe un producto con el ID:', id);
                return null;
            };
            const updatedProduct = products.map(item => {
                if (item.id === id) return {...item, ...updatedFields};
                return item;
            });
            await this.#writeProducts(updatedProduct);
            const updated = updatedProduct.find(item => item.id === id);
            console.log('Producto actualizado con éxito:', updated);
            return updated;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    }
    
    //Eliminar un producto
    async deleteProduct (id) {
        try {
            const products = await this.getProducts();
            const exists = products.some(item => item.id === id);
            if (!exists) {
                console.log('Error: No existe un producto con el ID:', id);
                return null;
            };
            const deletedProducts = products.filter(item => item.id !== id);
            await this.#writeProducts(deletedProducts);
            console.log('Producto eliminado con éxito.');
            return true;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    // Eliminar el archivo de productos
    async deleteAllProducts() {
        try {
            await fsPromises.access(this.filePath);
            try {
                await fsPromises.unlink(this.filePath);
                console.log('El archivo con los productos fue eliminado con éxito.');
                return true;
            } catch (deleteError) {
                console.error('Error al eliminar el archivo de productos:', deleteError);
                throw deleteError;
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('El archivo products.json no existe. No hay nada que eliminar.');
                return false;
            } else {
                throw error;
            }
        }
    }
}