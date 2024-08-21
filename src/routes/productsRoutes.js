import express from 'express';
import { getAllProducts, getProductById, addProduct } from '../controllers/productsController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.post('/', addProduct);

export default router;
