const fs = require('fs');
const path = require('path');

const prettier = require('prettier');

const pages = [
  '', // HomePage
  'deportes',
  'salud',
  'grasa',
  'mujer',
  'cognitivo',
  'faq',
  'terms',
  'privacy',
  'contact',
];

const domain = 'https://endlessgoalsnutrition.com';

const generateSitemap = async () => {
  const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const route = page ? `/${page}` : '';
          return `
            <url>
              <loc>${domain}${route}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>${page ? '0.8' : '1.0'}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  const formattedSitemap = await prettier.format(sitemap, { parser: 'html' });

  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), formattedSitemap);

  console.log('Sitemap generated successfully!');
};

generateSitemap();
