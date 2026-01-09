const BASE_URL = "https://pl.wikipedia.org/w/api.php";

export async function getLinksFromArticle(title) {
  const url = `${BASE_URL}?action=query&titles=${encodeURIComponent(
    title
  )}&prop=links&pllimit=max&format=json&origin=*`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pageId === "-1") {
      console.warn(`Artykuł "${title}" nie istnieje.`);
      return [];
    }

    const links = pages[pageId].links;

    if (!links) return [];

    const articleTitles = links
      .filter((link) => link.ns === 0)
      .map((link) => link.title);

    return articleTitles;
  } catch (error) {
    console.error("Błąd pobierania danych z Wikipedii:", error);
    return [];
  }
}

export async function checkArticleExists(title) {
  const url = `${BASE_URL}?action=query&titles=${encodeURIComponent(
    title
  )}&format=json&origin=*`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    return pageId !== "-1";
  } catch (error) {
    console.error("Błąd sprawdzania artykułu:", error);
    return false;
  }
}

export async function getArticleDetails(title) {
  const url = `${BASE_URL}?action=query&titles=${encodeURIComponent(
    title
  )}&prop=extracts|pageimages&exintro&explaintext&pithumbsize=200&format=json&origin=*`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pageId === "-1") return null;

    const page = pages[pageId];
    return {
      summary: page.extract
        ? page.extract.substring(0, 150) + "..."
        : "Brak opisu.",
      thumbnail: page.thumbnail ? page.thumbnail.source : null,
    };
  } catch (error) {
    console.error("Błąd pobierania szczegółów:", error);
    return null;
  }
}
