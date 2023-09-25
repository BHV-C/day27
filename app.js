const express = require('express');
const app = express();
const fs = require('fs');
let products = JSON.parse((fs.readFileSync('./products.json')));
// let products = [
//     { id: 1, name: 'iPhone 12 Pro', price: 1099.99 },
//     { id: 2, name: 'Samsung Galaxy S21', price: 999.99 },
//     { id: 3, name: 'Sony PlayStation 5', price: 499.99 },
//     { id: 4, name: 'MacBook Pro 16', price: 2399.99 },
//     { id: 5, name: 'DJI Mavic Air 2', price: 799.99 },
//     { id: 6, name: 'iPhone', price: 899.99 },
//   ];


app.get('/', (req, res) => {res.send("welcome to my server");});

// GET request to retrieve a specific product by ID
// app.get('/products/:id', (req, res) => {
//   const productId = parseInt(req.params.id);
//   // Use the productId to fetch the corresponding product from the database
//   // Return the product information as the response
//   const product = products.find(p => p.id === productId);

//     if (product) {
//         // If the product exists, return its details as JSON
//         res.json(product);
//     } else if ( !product && (!req.search)){
//         // If the product is not found, return a 404 response
//         res.status(404).json({ error: 'Product not found' });
//     }
//   res.send(`Product ID: ${productId}`);
// });
// Define the "PUT /products/:id" route to update a specific product
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const name = req.query.name,price = req.query.price;

    // Find the product with the specified ID
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
        // If the product is not found, return a 404 response
        res.status(404).json({ error: 'Product not found' });
    } else {
        // Update the product's details
        products[productIndex].name = name;
        products[productIndex].price = parseFloat(price);

        // Return the updated product as JSON
        res.json(products[productIndex]);
    }
});

// Define the "DELETE /products/:id" route to delete a specific product
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    // const productToDelete = ;
    // Find the product with the specified ID
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex === -1){
        // If the product is not found, return a 404 response
        res.status(404).json({ error: 'Product not found' });
    } else{
        // Remove the product from the list
        products.splice(productIndex, 1);

        // Return a success message
        res.json({ message: 'Product deleted successfully' });
    }
});


app.get('/products', (req,res) => {
    // const searchQuery = req.query.q;
    // const minPrice = req.query.minPrice;
    // const maxPrice = req.query.maxPrice;

    // return the list of products
    // res.json(products);
    res.status(200).json({status: "success",count: products.length, data:{products: products}});
    // res.send(`Search Query: ${searchQuery}, Min Price: ${minPrice}, Max Price: ${maxPrice}`);
});
// Define the "POST /products" route to create a new product
app.post('/products', (req, res) => {
    
    const newId = products[products.length -1].id +1;
    const newProducts = Object.assign({id : newId}, req.body);
    
    products.push(newProducts);
    fs.writeFile('products.json', JSON.stringify(products), err => {
        res.status(201).json({
            status: 'success',
            data: {
                products: newProducts
            }
        })
    });
    
    // const { name, price }    = req.body;
    // Generate a new unique ID for the product (you can use a more robust method in production)
    // const newProductId = products.length + 1;
    
    // // Create the new product object
    // const newProduct = {
    //     id: newProductId,
    //     name: name,
    //     price: parseFloat(price),
    // };

    // // Add the new product to the list of products
    // products.push(newProduct);

    // // Return the newly created product as JSON
    // res.status(201).json(newProduct);
});

// GET request to search for products based on query parameters
app.get('/products/search', (req, res) => {
  const q = req.query.q;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
//   const { q, minPrice, maxPrice } = req.query;
  // Use the searchQuery, minPrice, and maxPrice to perform a search in the database
  // Return the search results as the response
  let filteredProducts = products;

  if (q) {
      filteredProducts = filteredProducts.filter(product => {
          return product.name.toLowerCase().includes(q.toLowerCase());
      });
  }

  if (minPrice) {
      filteredProducts = filteredProducts.filter(product => {
          return product.price >= parseFloat(minPrice);
      });
  }

  if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
          return product.price <= parseFloat(maxPrice);
      });
  }
  if (!filteredProducts.length) {
    res.send("Product not found");
  }

  res.json(filteredProducts);
//   res.send(`Search Query: ${q}, Min Price: ${minPrice}, Max Price: ${maxPrice}`);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    // Use the productId to fetch the corresponding product from the database
    // Return the product information as the response
    const product = products.find(p => p.id === productId);
  
      if (product) {
          // If the product exists, return its details as JSON
        //   res.json(product);
          res.status(200).json({status: "success",count: products.length, data:{products: product}});

      } else{
          // If the product is not found, return a 404 response
          res.status(404).json({ error: 'Product not found' });
      }
    res.send(`Product ID: ${productId}`);
  });
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});







