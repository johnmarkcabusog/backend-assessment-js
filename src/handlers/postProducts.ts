import { Env } from "..";

import { neon } from "@neondatabase/serverless";

const BATCH_SIZE = 100; // assuming the payload takes in thousands of data

export async function postProducts(
  request: Request,
  env:Env
): Promise<Response> {
  try {
    const sql = neon(env.DATABASE_URL);

    const requestBody = await request.json();
    const products = requestBody.products;
    // console.log(env.DATABASE_URL);

    let batch = []; // Holds products for the current batch

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // Add product to current batch
      product.variants.forEach((variant) => {
        batch.push({
          id: product.id,
          title: product.title + " + " + variant.title,
          tags: product.tags,
          sku: variant.sku,
        });
      });

      // If batch is full, insert it
      if (batch.length >= BATCH_SIZE || i === products.length - 1) {
        try {
          // Use SQL bulk insert (e.g., using the VALUES syntax)
          const values = batch
            .map(
              (product) =>
                `('${product.id}','${product.title}', '${product.tags}', '${product.sku}')`
            )
            .join(", ");
          const query = `
              INSERT INTO products (productId,title,tags,sku)
              VALUES ${values}
            `;

          await sql(query);
          console.log(`Batch of ${batch.length} products inserted.`);
        } catch (error) {
          console.error("Error inserting batch", error);
        }
        batch = []; // Reset the batch after insert
      }
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json", // Set the Content-Type to JSON
      },
    });
    
  } catch (error) {
    const errorResponse = {
      error: "Something went wrong",
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: {
        "Content-Type": "application/json", // Return the error response as JSON
      },
    });
  }
}
