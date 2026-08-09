import users from "@/data/users.json";
import products from "@/data/products.json";

const seeds = {
  lumea_users: users,
  lumea_orders: [],
  lumea_products: products,
  lumea_reviews: [],
  lumea_wishlist: [],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readStoredValue(key) {
  try {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) return { exists: false, value: null };
    return { exists: true, value: JSON.parse(rawValue) };
  } catch (error) {
    console.warn(
      `LUMÉA storage value for "${key}" was invalid and will be restored.`,
      error,
    );
    return { exists: true, invalid: true, value: null };
  }
}

export function getItem(key, fallback = null) {
  const stored = readStoredValue(key);
  return stored.invalid || !stored.exists ? clone(fallback) : stored.value;
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    console.error(`Unable to save LUMÉA storage value for "${key}".`, error);
    return null;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Unable to remove LUMÉA storage value for "${key}".`, error);
  }
}

export function initializeStorage() {
  Object.entries(seeds).forEach(([key, seed]) => {
    const stored = readStoredValue(key);
    if (!stored.exists || stored.invalid) setItem(key, clone(seed));
  });

  if (!getItem("lumea_product_catalog_images_v1", false)) {
    setItem("lumea_products", clone(products));
    setItem("lumea_product_catalog_images_v1", true);
  }

  // Remove the old demo collections once. New orders, reviews and favourites
  // are created only through the integrated application flows.
  if (!getItem("lumea_real_collections_v3", false)) {
    setItem("lumea_orders", []);
    setItem("lumea_reviews", []);
    setItem("lumea_wishlist", []);
    Object.keys(localStorage)
      .filter((key) => key.startsWith("lumea_wishlist_"))
      .forEach((key) => removeItem(key));
    setItem("lumea_real_collections_v3", true);
  }
}

function normalizeIntegratedProduct(product) {
  return {
    id: String(product.id),
    name: product.name || "LUMÉA product",
    brand: product.brand || "LUMÉA",
    category: product.category || "Beauty",
    price: Number(product.price || 0),
    oldPrice: null,
    shade: product.variant || product.category || "Standard",
    image: product.image || "",
    inStock: true,
    description: product.description || "",
  };
}

export function saveIntegratedProduct(product) {
  if (!product?.id) return null;
  initializeStorage();
  const normalized = normalizeIntegratedProduct(product);
  const products = getItem("lumea_products", []);
  const index = products.findIndex((item) => String(item.id) === normalized.id);
  if (index >= 0) products[index] = { ...products[index], ...normalized };
  else products.push(normalized);
  setItem("lumea_products", products);
  return normalized;
}

export function addIntegratedWishlistProduct(product) {
  const savedProduct = saveIntegratedProduct(product);
  if (!savedProduct) return null;
  const user = getItem("lumea_current_user", null);
  const key = `lumea_wishlist_${user?.id || "guest"}`;
  const items = getItem(key, []);
  if (!items.includes(savedProduct.id)) setItem(key, [...items, savedProduct.id]);
  return savedProduct;
}

export function toggleIntegratedWishlistProduct(product, active) {
  const savedProduct = saveIntegratedProduct(product);
  if (!savedProduct) return null;
  const user = getItem("lumea_current_user", null);
  const key = `lumea_wishlist_${user?.id || "guest"}`;
  const items = getItem(key, []);
  const nextItems = active
    ? (items.includes(savedProduct.id) ? items : [...items, savedProduct.id])
    : items.filter((id) => id !== savedProduct.id);
  setItem(key, nextItems);
  return { product: savedProduct, active };
}

export function prepareIntegratedReview(product) {
  const savedProduct = saveIntegratedProduct(product);
  const user = getItem("lumea_current_user", null);
  if (!savedProduct || !user) return { product: savedProduct, requiresLogin: true };
  const reviews = getItem("lumea_reviews", []);
  let review = reviews.find(
    (item) => item.userId === user.id && String(item.productId) === savedProduct.id,
  );
  if (!review) {
    review = { id: `review-${Date.now()}`, userId: user.id, productId: savedProduct.id, status: "pending", rating: 0, title: "", comment: "", date: "" };
    setItem("lumea_reviews", [...reviews, review]);
  }
  setItem("lumea_open_review_product", review.id);
  return { product: savedProduct, review, requiresLogin: false };
}

export function resetStorage() {
  Object.entries(seeds).forEach(([key, seed]) => setItem(key, clone(seed)));
  removeItem("lumea_current_user");
}
