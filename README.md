# Product Inventory System

## Requirements
- Node.js version 18.17.0 or higher

## Database Configuration
The `DATABASE_URL` is **hardcoded** in the `.toml` configuration file. This is directly connected to a database setup in [Neon Database](https://neon.tech), a serverless PostgreSQL platform.

## Endpoints

### 1. **GET /api/products**
Fetches all the products saved in the database. If product data is empty, proceed to executing endpoint 2.

- **Response**: Returns a list of all products.
- **Example**: `GET http://localhost:3000/api/products`

### 2. **POST /api/products**
This endpoint allows you to add products to the database.

- **How to use**: Directly copy the JSON from the following endpoint and feed it to the body of this endpoint's request:
  - [Mock Data Source](https://02557f4d-8f03-405d-a4e7-7a6483d26a04.mock.pstmn.io/get)
- **Example**:
  ```bash
  POST http://localhost:3000/api/products
  Content-Type: application/json
  Body: <Paste the JSON from the above link here>

### 3. DELETE /api/products/
Deletes a specific product from the database based on the provided productId.

- **How to use**: How to use: Provide the productId to delete a product. The productId should be passed as a part of the URL path.
- **Example**:
  ```bash
  DELETE http://localhost:3000/api/products/9505912586529

Response: Confirms if the product was successfully deleted.

### 3.  PUT /api/products
This endpoint updates an existing product's title and appends the sku to it.


- **How to use**: Directly copy the JSON from the following endpoint and feed it to the body of this endpoint's request:
  - [Mock Data Source](https://02557f4d-8f03-405d-a4e7-7a6483d26a04.mock.pstmn.io/get)
- **Example**:
  ```bash
  PUT http://localhost:3000/api/products
  Content-Type: application/json
  Body: <Paste the JSON from the above link here>


