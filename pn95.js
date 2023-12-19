import puppeteer from 'puppeteer';

let productUrls = [];

const headerString = '"SKU","URL","Brand","Title","Size","Count","Characteristics","Details","Certifications","Color","Manufacturer","Reviews"'

async function waitSeconds(seconds) {
  function delay(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }
  await delay(seconds)
}

/* Cleaning strings so they don't mess with CSV 
*  Newlines
*  Might need to remove quotation marks
*/
function cleanString(str) {
  if (str) {
    str = str.replace(/(\r\n|\n|\r)/gm, " ");
    str = str.replace(/"/g, "'");
    return str;
  } else {
    return "";
  }
  
}

/* Scrape product page
*
*/
async function scrapeProduct(page, productUrl) {
  // console.log(productUrl);
  await page.goto(productUrl);
  
  await waitSeconds(5);

  const title = await page.$eval('h1', el => el.textContent);

  const sku = await page.$eval('.css-15lmz9r .css-1xcn75x', el => el.textContent);
  
  const brand = await page.$eval('.css-1vl9990 .css-1rtmbqw', el => el.textContent);

  const size = await page.$eval('.css-p8xoy8 .css-118vrcq', el => el.textContent)
    .catch(() => "")
    .then();

  const count = await page.$eval('.css-hfqqda .css-1dnhiqu', el => el.textContent);

  const characteristics = await page.$$eval('.css-kf9nj8 .css-192wlhb', els => els.map(el => el.textContent));
  characteristics.pop(); // PN95 added "Our mission" to every mask listing, this removes it

  let details, certs, color, manufacturer, sizeGuide, reviews = "";

  // Reviews are printing as a list within a cell, so 1 row/product
  // Could print to a separate reviews file or
  // Duplicate the rest of the product info so it's 1 row/review
  // const reviews = [];

  const divList = await page.$$('.css-fc7veu > div');
  for (const div of divList) {
    const dtText = await div.$eval('dt', dt => dt.textContent);
    const divText = await div.$eval('div', dv => dv.textContent);

    if (dtText === "Product Details") {
      details = divText || "";
    } else if (dtText === "Certifications") {
      certs = divText || "";
    } else if (dtText === "Color") {
      color = divText || "";
    } else if (dtText === "Manufacturer") {
      manufacturer = divText || "";
    } else if (dtText === "Size Guidance") {
      sizeGuide= divText || "";
    } else if (dtText === "Reviews") {

      const reviewList = await div.$$('.spr-review')
        .catch(() => [])
        .then();
      for (const review of reviewList) {
        const rating = await review.$$('i');
        const reviewTitle = await review.$eval('h3', el => el.textContent);
        const reviewContent = await review.$eval('p', el => el.textContent);
        if (reviews.length > 0) { 
          reviews += ", ";
        }
        reviews += "['" + rating.length.toString() + "', '" + reviewTitle + "', '" + reviewContent + "']"
        // If printing each review as a row, you'd want a list of objects returned 
        // reviews.push({
        //   rating: rating.length,
        //   reviewTitle: reviewTitle,
        //   reviewContent: reviewContent
        // });
      }
    }
  }

  const product = {
    sku: sku,
    url: productUrl,
    brand: brand,
    title: title,
    size: size,
    count: count,
    characteristics: characteristics,
    details: cleanString(details),
    certs: cleanString(certs),
    color: color,
    manufacturer: cleanString(manufacturer),
    reviews: cleanString(reviews)
  }

  return product;
}

/* Main puppeteer call: node pn95.js > pn95_masks.csv
*
*  Reads all of mask URLs from page 1 and 2
*  Passes that product URL to function which scrapes that page
*  Prints the formatted line for a CSV
*/
(async () => {
  // Launch the browser and open a new blank page
  // Headless means the chromium browser will open and you can watch it process the page
  // const browser = await puppeteer.launch({headless: false});
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://projectn95.org/collections/masks/');
  // await waitSeconds(5);

  // console.log("we made it\n");
  await waitSeconds(5);

  // console.log('how MANY?', (await page.$$(".ais-Hits-item a")).length);
  const allItems = await page.$$eval('.ais-Hits-item a', elements => elements.map(el => el.href));
  // console.log(allItems);

  productUrls = productUrls.concat(allItems);
  // console.log(productUrls.length);

  // Get second page
  await page.goto('https://www.projectn95.org/collections/masks/?page=2');
  await waitSeconds(5);

  const allItems2 = await page.$$eval('.ais-Hits-item a', elements => elements.map(el => el.href));
  productUrls = productUrls.concat(allItems2);
  // console.log(productUrls.length);

  // Print CSV header
  console.log(headerString);

  // Print product scraping
  for (const productUrl of productUrls) {
    const product = await scrapeProduct(page, productUrl);
    const prodString = '"' + Object.values(product).join('","') + '"';
    console.log(prodString);
  }

  // If you need to troubleshoot on a specific URL:
  // const product = await scrapeProduct(page, "https://www.projectn95.org/products/dentec-safety-comfort-air-158dn5-filter-pads-one-size-usa/");
  // const prodString = '"' + Object.values(product).join('","') + '"';
  // console.log(prodString);
  
  await browser.close();
})();
