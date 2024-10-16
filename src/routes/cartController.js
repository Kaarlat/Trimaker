import Cart from '../models/cart.js'; 
import Product from '../models/event.model.js';

export const createCart = async (cartData) => {
    const cart = new Cart(cartData);
    return await cart.save();
};


export const getCartById = async (cid) => {
    return await Cart.findById(cid).populate('products.product'); 
};

export const addProductToCart = async (cid, pid, quantity) => {
    const cart = await Cart.findById(cid);
    const product = await Product.findById(pid);

    const existingProduct = cart.products.find(p => p.product.toString() === pid);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ product: pid, quantity });
    }

    return await cart.save();
};

export const updateCart = async (cid, pid, quantity) => {
    const cart = await Cart.findById(cid);
    const existingProduct = cart.products.find(p => p.product.toString() === pid);

    if (existingProduct) {
        existingProduct.quantity = quantity;
    }

    return await cart.save();
};

export const removeProductFromCart = async (cid, pid) => {
    const cart = await Cart.findById(cid);
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    return await cart.save();
};
