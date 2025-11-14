// functions/wp-json/wc/v1/products/[id].js
import { loadProducts } from "../../../../lib/loadProducts.js";

function checkAuth(request, env) {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;

  const encoded = auth.split(" ")[1];
  const decoded = atob(encoded);

  const [user, pass] = decoded.split(":");
  return user === env.WC_KEY && pass === env.WC_SECRET;
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const id = params.id;

  let products = loadProducts();
  let product = products.find(p => String(p.id) === String(id));

  if (!product) {
    return new Response(JSON.stringify({ message: "Product not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  // ========= GET product =========
  if (request.method === "GET") {
    let price = product.regular_price;
    const kv = await env.PRODUCT_PRICES.get(`product:${product.id}:price`);
    if (kv) price = kv;

    return new Response(
      JSON.stringify({ ...product, regular_price: price }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // ========= PUT update price =========
  if (request.method === "PUT" || request.method === "POST") {
    if (!checkAuth(request, env)) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ message: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const newPrice =
      body.regular_price ??
      body.price ??
      body.regularPrice ??
      null;

    if (!newPrice) {
      return new Response(JSON.stringify({ message: "No price provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    await env.PRODUCT_PRICES.put(
      `product:${product.id}:price`,
      String(newPrice)
    );

    return new Response(
      JSON.stringify({ ...product, regular_price: String(newPrice) }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response("Method Not Allowed", { status: 405 });
}
