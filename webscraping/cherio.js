const express = require('express');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const cheerio = require('cheerio');

dotenv.config();

const app = express();

// Helper Function: Scrape The Verge
async function scrapeTheVerge() {
  const url = 'https://www.theverge.com/tech';
  console.log('Fetching data from The Verge...');

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set user agent to mimic a real browser
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );
    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    const $ = cheerio.load(html);

    const articles = [];
    $('.c-entry-box--compact__title').each((_, element) => {
      const title = $(element).find('a').text().trim();
      const link = $(element).find('a').attr('href');

      if (title && link) {
        articles.push({ title, link });
      }
    });

    await browser.close();

    if (articles.length === 0) {
      console.log('No articles found on The Verge. Check selectors.');
      return [];
    }

    console.log(`Scraped ${articles.length} articles from The Verge.`);
    return articles;
  } catch (error) {
    console.error('Error fetching data from The Verge:', error.message);
    return [];
  }
}

// Helper Function: Scrape Hacker News
async function scrapeHackerNews() {
  const url = 'https://news.ycombinator.com/';
  console.log('Fetching data from Hacker News...');

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    const $ = cheerio.load(html);

    const articles = [];
    $('.storylink').each((_, element) => {
      const title = $(element).text().trim();
      const link = $(element).attr('href');

      if (title && link) {
        articles.push({ title, link });
      }
    });

    await browser.close();

    if (articles.length === 0) {
      console.log('No articles found on Hacker News. Check selectors.');
      return [];
    }

    console.log(`Scraped ${articles.length} articles from Hacker News.`);
    return articles;
  } catch (error) {
    console.error('Error fetching data from Hacker News:', error.message);
    return [];
  }
}

// Route: Fetch Tech News from All Sources
app.get('/tech-news', async (req, res) => {
  try {
    const vergeArticles = await scrapeTheVerge();
    const hackerNewsArticles = await scrapeHackerNews();

    const allArticles = [...vergeArticles, ...hackerNewsArticles];

    if (allArticles.length === 0) {
      return res.status(404).json({ message: 'No articles found from sources.' });
    }

    res.json({
      message: 'Tech news scraped successfully',
      data: allArticles,
    });
  } catch (error) {
    console.error('Error in /tech-news route:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
