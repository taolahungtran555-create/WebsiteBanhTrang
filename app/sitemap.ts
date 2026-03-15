import { MetadataRoute } from 'next';

const BASE_URL = 'https://banhtrangtronngoncantho.vn';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes
  const routes = [
    '',
    '/menu',
    '/tin-tuc',
    '/lien-he',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Mock Dynamic Routes (In production, replace with DB call)
  const posts = ['banh-trang-tron-ngon-nhat-can-tho', 'ship-banh-trang-tron-can-tho'].map((slug) => ({
    url: `${BASE_URL}/tin-tuc/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const products = ['banh-trang-tron-thap-cam', 'banh-trang-tron-kho-bo'].map((slug) => ({
    url: `${BASE_URL}/menu/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...posts, ...products];
}
