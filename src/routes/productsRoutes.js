import express from 'express';
import fs from 'fs';

const router = express.Router();
const productsFilePath = './data/products.json';

// GET /api/products - Listar todos los productos
router.get('/', (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading products file' });
        let products = JSON.parse(data);
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        products = products.slice(0, limit);
        res.json(products);
    });
});

// GET /api/products/:pid - Obtener un producto por su ID
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading products file' });
        const products = JSON.parse(data);
        const product = products.find(p => p.id === pid);
        if (product) res.json(product);
        else res.status(404).json({ error: 'Product not found' });
    });
});

// POST /api/products - Agregar un nuevo producto
router.post('/', (req, res) => {
    const newProduct = req.body;
    if (!newProduct.title || !newProduct.description || !newProduct.code ||
        !newProduct.price || newProduct.status === undefined || 
        !newProduct.stock || !newProduct.category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading products file' });
        const products = JSON.parse(data);
        const newId = (products.length > 0) ? (parseInt(products[products.length - 1].id) + 1).toString() : '1';
        newProduct.id = newId;
        products.push(newProduct);
        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ error: 'Error saving product' });
            res.status(201).json(newProduct);
        });
    });
});

export default router;
