import dedent from 'dedent';

export default function handler(req, res) {
    const robots = dedent`
    User-agent: Googlebot
    Disallow: /login/
    Disallow: /admin/
    Disallow: /_next/

    User-agent: *
    Allow: /

    Sitemap: ${process.env.HOST_NAME}/sitemap.xml
    `;
    res.send(robots);
}
