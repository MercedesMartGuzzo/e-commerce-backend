import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construir la ruta para el archivo de datos de productos
const productsFilePath = join(__dirname, '../../data/products.json');

export const getAllProducts = (req, res) => {
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading products file' });
        const products = JSON.parse(data);
        res.json(products);
    });
};

export const getProductById = (req, res) => {
    const { pid } = req.params;
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading products file' });
        const products = JSON.parse(data);
        const product = products.find(p => p.id === pid);
        if (product) res.json(product);
        else res.status(404).json({ error: 'Product not found' });
    });
};

export const addProduct = (req, res) => {
    const newProduct = req.body;
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
};
