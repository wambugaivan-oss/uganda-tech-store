// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Path to the static product data (simulating a DB)
const productsFilePath = path.join(__dirname, 'products.json');

// Middleware
// Allow cross-origin requests from your React frontend (port 3000)
app.use(cors({
    origin: 'http://localhost:3000' 
}));
app.use(bodyParser.json());

// --- Utility Functions for Reading/Writing Products ---

const readProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products file:', error.message);
        // If file doesn't exist, return an empty array
        return [];
    }
};

const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
};


// --- API Endpoints ---

// 1. GET all products
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// 2. POST (Admin) - Add a new product
app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    let products = readProducts();
    
    // Simple ID generation
    const newId = Math.max(...products.map(p => p.id || 0), 0) + 1;
    const productToAdd = { ...newProduct, id: newId };

    products.push(productToAdd);
    writeProducts(products);
    
    res.status(201).json(productToAdd);
});

// 3. DELETE (Admin) - Delete a product
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    let products = readProducts();
    
    const initialLength = products.length;
    products = products.filter(p => p.id !== productId);
    
    if (products.length < initialLength) {
        writeProducts(products);
        res.status(200).json({ message: 'Product deleted successfully.' });
    } else {
        res.status(404).json({ message: 'Product not found.' });
    }
});

// 4. PUT/PATCH (Admin) - Update an existing product (simplified)
app.patch('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updates = req.body;
    let products = readProducts();

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updates };
        writeProducts(products);
        res.json(products[productIndex]);
    } else {
        res.status(404).json({ message: 'Product not found.' });
    }
});


// --- Server Setup ---

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Admin Password is: ugadminpassword'); // Reminder
});
// ... (all the Express routes you had before) ...

// IMPORTANT: Export the app for Vercel to use it as a serverless function
module.exports = app;
