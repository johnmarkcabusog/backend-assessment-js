import { Env } from "..";
import { neon } from "@neondatabase/serverless";

export async function getProducts(env: Env): Promise<Response> {
  const sql = neon(env.DATABASE_URL);

 
  try {
    const query = `SELECT * from products`;
    const products = await sql(query);

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json", // Set the Content-Type to JSON
      },
    });

  } catch (err) {
    return new Response("Something Went wrong", {
      status: 500,
      headers: {
        "Content-Type": "application/json", 
      },
    });
  }

}
