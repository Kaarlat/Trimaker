import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '../src/files/products.json');

const readProductsFromFile = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo el archivo de productos:', error);
        return [];
    }
};

const writeProductsToFile = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
};

router.get('/', (req, res) => {
    const products = readProductsFromFile();
    res.json(products);
});

router.post('/', (req, res) => {
    const products = readProductsFromFile();
    
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category
    };

    products.push(newProduct);
    writeProductsToFile(products);

    res.status(201).json(newProduct);
});

export default router;