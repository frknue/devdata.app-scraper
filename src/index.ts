import { indeedScraper } from "./indeed/scraper";
import { addOrUpdate } from "./libs/db";
import { countryList } from "./libs/countryList";

async function main() {
    const cities = countryList.usa.cities;
    
    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const data = await indeedScraper("usa", city);
        await addOrUpdate(data);
    }
    console.log("Done");
}

main();
