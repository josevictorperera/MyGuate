// functions/lib/loadProducts.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Convert string -> stable numeric ID using djb2 hash
 */
function stableIdFromString(s) {
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) + hash) + s.charCodeAt(i);
    hash = hash & 0xffffffff; // keep 32-bit
  }
  return Math.abs(hash);
}

export function loadProducts() {
  const dir = path.join(process.cwd(), "_products");

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"));

  const products = files.map((file) => {
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, "utf8");
    const parsed = matter(raw);

    const data = parsed.data || {};
    const content = parsed.content ? parsed.content.trim() : "";

    // Prefer explicit ID, fallback to stable hash of filename
    let id = data.ID || data.id;
    if (!id) id = stableIdFromString(file);

    const slug = data.slug || file.replace(/\.md$/, "");
    const sku = data.sku || slug;
    const image = data.image || null;

    return {
      id: Number(id),
      name: data.title || slug,
      slug,
      sku: String(sku),
      regular_price: data.price !== undefined ? String(data.price) : null,
      description: content,
      images: image ? [{ src: image }] : [],
      short_description: data.short_description || "",
      categories: data.category ? [data.category] : []
    };
  });

  return products;
}
