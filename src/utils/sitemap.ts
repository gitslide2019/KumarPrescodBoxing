/**
 * Sitemap Generation Utility for Kumar Prescod Boxing Website
 * Generates dynamic sitemap.xml for SEO optimization
 */

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const staticRoutes: SitemapUrl[] = [
  {
    loc: '/',
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    loc: '/about',
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    loc: '/fights',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    loc: '/journey',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    loc: '/sponsors',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    loc: '/shop',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    loc: '/podcast',
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString().split('T')[0]
  }
];

export const generateSitemap = (
  baseUrl: string = 'https://kumarprescod.com',
  additionalUrls: SitemapUrl[] = []
): string => {
  const allUrls = [...staticRoutes, ...additionalUrls];
  
  const urlEntries = allUrls.map(url => {
    const fullUrl = `${baseUrl}${url.loc}`;
    return `
  <url>
    <loc>${fullUrl}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;
};

// Boxing-specific dynamic content for sitemap
export const generateDynamicUrls = async (): Promise<SitemapUrl[]> => {
  const dynamicUrls: SitemapUrl[] = [];
  
  // Add fight-specific URLs if available
  try {
    // This would typically fetch from an API or CMS
    const upcomingFights = [
      { id: '2025-08-16-oakland', date: '2025-08-16' }
    ];
    
    upcomingFights.forEach(fight => {
      dynamicUrls.push({
        loc: `/fights/${fight.id}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
      });
    });
  } catch (error) {
    console.warn('Could not generate dynamic fight URLs for sitemap');
  }

  return dynamicUrls;
};

export const generateNewsArticles = (): SitemapUrl[] => {
  // Boxing news articles - would typically come from CMS
  const newsArticles = [
    { slug: 'kumar-prescod-training-update', date: '2025-01-15' },
    { slug: 'upcoming-oakland-fight-announcement', date: '2025-01-10' }
  ];

  return newsArticles.map(article => ({
    loc: `/news/${article.slug}`,
    changefreq: 'monthly' as const,
    priority: 0.6,
    lastmod: article.date
  }));
};

export const generateImageSitemap = (): string => {
  const images = [
    {
      url: '/images/portraits/kumar-prescod-profile.jpg',
      title: 'Kumar Prescod - Professional Boxer',
      caption: 'Kumar Prescod, 18-year-old professional boxer from Oakland, CA'
    },
    {
      url: '/images/training/daily-routine/training-session.jpg', 
      title: 'Kumar Prescod Training Session',
      caption: 'Daily training routine at Oakland boxing gym'
    }
  ];

  const imageEntries = images.map(img => `
    <image:image>
      <image:loc>https://kumarprescod.com${img.url}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://kumarprescod.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    ${imageEntries}
  </url>
</urlset>`;
};