import fs from "fs";
import { hey } from "./helper";
import { indeedScraper } from "./indeed/scraper";
import { addOrUpdate } from "./libs/db";
import { dummyData2 } from "./libs/globals";

async function main() {
  // const data = await indeedScraper("germany", "karlsruhe");
  await addOrUpdate(dummyData2);
}

main();
