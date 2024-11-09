
import { Env } from "..";

import { neon } from "@neondatabase/serverless";

const BATCH_SIZE = 100; // assuming the payload takes in thousands of data

export async function deleteProduct(
  request: Request,
  env:Env
): Promise<Response> {
  try {
    const sql = neon(env.DATABASE_URL);

    const request_url =  await request.url;

    const segments = request_url.split("/");  // Split the URL path by '/'
    const productId = segments[segments.length - 1];  // The last segment is the product ID

    const selectQuery = `SELECT * from products where productId = ${productId}`;

    const product = await sql(selectQuery);
    if(product.length == 0){
      throw new Error("Product not Found");
    }
    const query = `DELETE from products where productId = ${productId}`;

    await sql(query);

    return new Response("Product Successfully Deletes", {
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
