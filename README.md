# Product Management Application

## Introduction

Product Management Application is a full-stack web application that allows users to manage products, categories, and subcategories efficiently. Users can browse products, search for specific items, filter products by category, and save products to their wishlist.

The application is built with a React frontend, Node.js/Express backend, and MongoDB database.

---

## Features

### Product Management

* Add new products with images.
* Edit existing products.
* View product details.
* Store multiple product variants such as RAM, price, and quantity.

### Category Management

* Create categories.
* Create subcategories under categories.
* Automatically update the sidebar when new categories or subcategories are added.

### Search and Filtering

* Search products by name.
* Filter products by category and subcategory.
* Apply multiple filters at the same time.

### Wishlist

* Add products to wishlist.
* Remove products from wishlist.
* View saved products in the wishlist drawer.

### Pagination

* Server-side pagination for better performance.
* Choose how many products to display per page.

### Image Upload

* Upload product images while creating products.
* Images are stored and served from the backend.

### Validation

* Form validation for user inputs.
* Backend validation using Express Validator.

---

## Technologies Used

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Lucide React
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* Express Validator

---

## Requirements

Before running the application, make sure the following software is installed:

* Node.js (Version 16 or later)
* MongoDB

---

## Project Setup

### Clone the Project

Navigate to the project directory after cloning the repository.

---

## Backend Setup

### Step 1: Open the Server Folder

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside the `server` folder and add:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/product_management
JWT_SECRET=your_super_secret_key
```

### Step 4: Start the Backend Server

```bash
npm start
```

The backend server will run at:

```text
http://localhost:5000
```

---

## Frontend Setup

### Step 1: Open the Client Folder

```bash
cd client
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside the `client` folder and add:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### Step 4: Start the Frontend Application

```bash
npm run dev
```

The frontend application will run at:

```text
http://localhost:5173
```

---

## How to Use

### Create Categories

Click the **Add Category** button to create a new category.

### Create Subcategories

After creating a category, use the **Add Subcategory** button to create subcategories.

### Add Products

Click **Add Product** and enter:

* Product name
* Description
* Product images
* RAM
* Price
* Quantity
* Subcategory

### Search Products

Use the search bar to find products by name.

### Filter Products

Use the sidebar to filter products by categories and subcategories.

### Manage Wishlist

Click the heart icon on a product to add it to your wishlist. You can remove products from the wishlist at any time.

---

## Troubleshooting

### Images Are Not Displayed

Make sure the value of `VITE_BACKEND_URL` matches your backend server URL.

### Database Connection Error

Ensure MongoDB is installed and running properly.

### Port Already in Use

Change the port number in the `.env` file and restart the server.

---

## Future Enhancements

* Product deletion
* Category editing and deletion
* Subcategory editing and deletion
* User roles and permissions
* Product reviews and ratings
* Shopping cart functionality
* Order management system
* Cloud image storage using Firebase or AWS S3

---

## Conclusion

This application provides a simple and efficient way to manage products, categories, and wishlists. It demonstrates modern full-stack development using React, Node.js, Express, and MongoDB.
