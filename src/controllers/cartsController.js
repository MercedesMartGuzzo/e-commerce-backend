import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construir la ruta para el archivo de datos de carritos
const cartsFilePath = join(__dirname, '../../data/carts.json');

export const getCartById = (req, res) => {
    const { cid } = req.params;
    fs.readFile(cartsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading carts file' });
        const carts = JSON.parse(data);
        const cart = carts.find(c => c.id === cid);
        if (cart) res.json(cart);
        else res.status(404).json({ error: 'Cart not found' });
    });
};

export const addProductToCart = (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    fs.readFile(cartsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading carts file' });
        const carts = JSON.parse(data);
        const cart = carts.find(c => c.id === cid);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        // Buscar producto en el carrito
        const existingProduct = cart.products.find(p => p.product === pid);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ error: 'Error saving cart' });
            res.status(200).json(cart);
        });
    });
};
