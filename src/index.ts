/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { deleteProduct } from "./handlers/deleteProduct";
import { getProducts } from "./handlers/getProducts";
import { postProducts } from "./handlers/postProducts";
import { updateProducts } from "./handlers/updateProducts";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  MY_SERVICE: Fetcher;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // Route handling for GET requests
    if (request.method === "GET" && url.pathname === "/api/products") {
      return getProducts(env);
    }

    // Route handling for POST requests
    if (request.method === "POST" && url.pathname === "/api/products") {
      return postProducts(request, env);
    }

    // Route handling for DELETE requests
    if (
      request.method === "DELETE" &&
      url.pathname.startsWith("/api/products/")
    ) {
      return deleteProduct(request, env);
    }

    // Route handling for DELETE requests
    if (request.method === "PUT") {
      return updateProducts(request, env);
    }
    // If no route is matched, return 404
    return new Response("Not Found", { status: 404 });
  },
};
