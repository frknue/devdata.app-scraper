import { indeedScraper } from "./indeed/scraper";
import { addOrUpdate } from "./libs/db";
import { countryList } from "./libs/countryList";

async function main() {
  const data = await indeedScraper(
    countryList.canada.country,
    countryList.canada.cities[1]
  );
  await addOrUpdate(data);
}

main();
