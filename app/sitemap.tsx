export default async function sitemap() {
  const rootUrl = {
    url: "https://ludaria.alexis-gousseau.com",
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 1,
  };

  return [rootUrl];
}
