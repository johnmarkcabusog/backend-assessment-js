import { Env } from "..";
import { neon } from "@neondatabase/serverless";

const BATCH_SIZE = 100; // Assuming the payload contains thousands of products

export async function updateProducts(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const sql = neon(env.DATABASE_URL);

    const requestBody = await request.json();
    const products = requestBody.products;

    let batch = []; // Holds products for the current batch

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // Process each variant of the product and prepare an update for each one
      product.variants.forEach((variant) => {
        // We push a prepared SQL UPDATE for each variant
        batch.push({
          sku: variant.sku,
          title: product.title + " + " + variant.sku, // Concatenate product title with variant title
          tags: product.tags,
        });
      });

      // If batch is full, execute the batch update
      if (batch.length >= BATCH_SIZE || i === products.length - 1) {
        try {
          // Use SQL to update the products in bulk based on SKU
          const values = batch
            .map(
              (product) =>
                `('${product.title}', '${product.tags}', '${product.sku}')`
            )
            .join(", ");

          const query = `
            UPDATE products
            SET title = CASE sku
              ${batch
                .map(
                  (product) => `WHEN '${product.sku}' THEN '${product.title}'`
                )
                .join(" ")}
            END,
            tags = CASE sku
              ${batch
                .map(
                  (product) => `WHEN '${product.sku}' THEN '${product.tags}'`
                )
                .join(" ")}
            END
            WHERE sku IN (${batch
              .map((product) => `'${product.sku}'`)
              .join(", ")});
          `;

          // Execute the update query
          await sql(query);
        } catch (error) {
          console.error("Error updating batch", error);
        }
        batch = []; // Reset the batch after processing
      }
    }

    const selectQuery = `SELECT * from products`;
    const productList = await sql(selectQuery);

    return new Response(JSON.stringify(productList), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
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
