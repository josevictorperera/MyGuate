// functions/wp-json/wc/v1/products.js
import { loadProducts } from "../../../lib/loadProducts.js";

export async function onRequest() {
  const products = loadProducts();

  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" }
  });
}
