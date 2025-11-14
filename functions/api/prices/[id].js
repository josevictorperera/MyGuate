// functions/api/prices/[id].js
import { loadProducts } from "../../../lib/loadProducts.js";

export async function onRequest(context) {
  const { params, env } = context;
  const id = params.id;

  const products = loadProducts();
  const product = products.find(p => String(p.id) === String(id));

  if (!product) {
    return new Response(JSON.stringify({ message: "not_found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  let price = product.regular_price;

  const kv = await env.PRODUCT_PRICES.get(`product:${product.id}:price`);
  if (kv) price = kv;

  return new Response(JSON.stringify({ id: product.id, price }), {
    headers: { "Content-Type": "application/json" }
  });
}
