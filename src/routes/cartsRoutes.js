import express from 'express';
import { getCartById, addProductToCart } from '../controllers/cartsController.js';

const router = express.Router();

router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);

export default router;
