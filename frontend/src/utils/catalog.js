import { CATALOG } from '@/data/catalog.js';

export const PRODUCTS = CATALOG;
export const PRODUCT_BY_ID = new Map(PRODUCTS.map(product => [product.id, product]));
export const CATEGORIES = [
  'All', 'Home Organization', 'Kitchen', 'Cabinet & Drawer',
  'Closet & Entry', 'Bathroom', 'Laundry', 'Prep Tools', 'Storage'
];
export const CATEGORY_CARDS = [
  { name: 'Home Organization', description: 'Racks, shelves, bins and organizers for every room in the house.' },
  { name: 'Prep Tools', description: 'Scales, thermometers, openers and everyday kitchen gadgets.' },
  { name: 'Storage', description: 'Food containers, bag holders, wraps and kitchen storage racks.' },
  { name: 'Cabinet & Drawer', description: 'Utensil trays, drawer organizers and cabinet storage.' },
  { name: 'Bathroom', description: 'Shower caddies, vanity organizers and bathroom storage.' },
  { name: 'Closet & Entry', description: 'Hangers, closet organizers and entryway storage.' },
  { name: 'Laundry', description: 'Laundry baskets, hampers and laundry room organizers.' }
];

export const money = value => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2
}).format(Number(value) || 0);

export const productImageUrl = (product, index = 0, width = 800) => {
  const imageIds = product?.amz || [];
  const imageId = imageIds[index] || imageIds[0];
  if (!imageId) return '';
  const resolution = width <= 200 ? 200 : width <= 600 ? 600 : 1000;
  return `https://m.media-amazon.com/images/I/${imageId}._AC_SL${resolution}_.jpg`;
};

export const productImageCount = product => product?.amz?.length || 0;
export const productsIn = category => PRODUCTS.filter(product => product.cat === category || product.sub === category);
export const firstIn = (category, count = 1) => productsIn(category).slice(0, count);
export const countIn = category => productsIn(category).length;
export const subcategories = () => [...new Set(PRODUCTS.map(product => product.sub))];
export const categoryUrl = category => category === 'All'
  ? '/shop/'
  : `/collections/${category.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}/`;

export function searchProducts(query, limit = 8) {
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) return [];
  return PRODUCTS.filter(product => [product.name, product.short, product.brand, product.cat, product.sub]
    .some(value => String(value || '').toLowerCase().includes(normalized))).slice(0, limit);
}
