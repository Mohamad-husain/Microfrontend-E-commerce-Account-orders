import users from "@/data/users.json";
import orders from "@/data/orders.json";
import products from "@/data/products.json";
import reviews from "@/data/reviews.json";
import wishlist from "@/data/wishlist.json";

const seeds = {
  lumea_users: users,
  lumea_orders: orders,
  lumea_products: products,
  lumea_reviews: reviews,
  lumea_wishlist: wishlist,
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
}

export function resetStorage() {
  Object.entries(seeds).forEach(([key, seed]) => setItem(key, clone(seed)));
  removeItem("lumea_current_user");
}
