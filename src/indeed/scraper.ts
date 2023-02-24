import dayjs from "dayjs";
import puppeteer from "puppeteer";
import cheerio from "cheerio";

import { CityData } from "../libs/types";

const browserConfig = {
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
};

const httpHeaders = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
};

const programmingLangs = [
    "Java",
    "JavaScript",
    "Typescript",
    "Python",
    "Kotlin",
    "C",
    "C%2B%2B",
    "C%23",
    "Golang",
    "Rust",
    "Visual Basic",
    "PHP",
    "Delphi",
    "Swift",
    "Ruby",
    "Perl",
    "Objective C",
];
const frameworks = [
    "Angular",
    "React",
    "Vue",
    "ASP NET",
    "Django",
    "jQuery",
    "Spring",
    "Laravel",
    "Ruby on Rails",
    "NodeJS",
];
const categories = [
    "DevOps",
    "Web Developer",
    "Backend Developer",
    "Frontend Developer",
    "Fullstack Developer",
    "Data Scientist",
    "Game Developer",
    "Mobile Developer",
    "IT Security",
];

const createTimeStamp = (): string => {
    return dayjs().format("DD-MM-YYYY");
};

const getCountrySubdomain = (country: string): string => {
    switch (country) {
        case "australia":
            return "au";
        case "austria":
            return "at";
        case "belgium":
            return "be";
        case "canada":
            return "ca";
        case "denmark":
            return "dk";
        case "finland":
            return "fi";
        case "france":
            return "fr";
        case "germany":
            return "de.";
        case "india":
            return "in";
        case "ireland":
            return "ie";
        case "italy":
            return "it";
        case "luxembourg":
            return "lu";
        case "netherlands":
            return "nl";
        case "new zealand":
            return "nz";
        case "norway":
            return "no";
        case "poland":
            return "pl";
        case "portugal":
            return "pt";
        case "spain":
            return "es";
        case "sweden":
            return "se";
        case "switzerland":
            return "ch";
        case "usa":
            return "";
        case "united kingdom":
            return "uk";
        default:
            return "";
    }
};

export async function indeedScraper(country: string, city: string): Promise<CityData> {
    console.log(`Scraping ${country} - ${city}...`);
    const programmingLangsData = {};
    const frameworksData = {};
    const categoriesData = {};

    const timestamp = createTimeStamp();

    const subdomain = getCountrySubdomain(country);
    const browser = await puppeteer.launch(browserConfig);
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders(httpHeaders);

    for (const programmingLang of programmingLangs) {
        const url = `https://${subdomain}indeed.com/jobs?q=${programmingLang}&l=${city}&radius=0`;
        await page.goto(url, { waitUntil: "load" });
        await page.waitForTimeout(3500);
        const html = await page.content();
        const $ = cheerio.load(html);

        const searchCount: string = $(".jobsearch-JobCountAndSortPane-jobCount").text();

        const searchCountNumber: number = parseInt(searchCount.replace(/\D/g, ""));

        console.log(`${programmingLang}: ${searchCountNumber}`);

        programmingLangsData[programmingLang] = searchCountNumber;
    }

    for (const framework of frameworks) {
        const url = `https://${subdomain}indeed.com/jobs?q=${framework}&l=${city}&radius=0`;
        await page.goto(url, { waitUntil: "load" });
        await page.waitForTimeout(3500);
        const html = await page.content();
        const $ = cheerio.load(html);

        const searchCount: string = $(".jobsearch-JobCountAndSortPane-jobCount").text();

        const searchCountNumber: number = parseInt(searchCount.replace(/\D/g, ""));
        console.log(`${framework}: ${searchCountNumber}`);

        frameworksData[framework] = searchCountNumber;
    }

    for (const category of categories) {
        const url = `https://${subdomain}indeed.com/jobs?q=${category}&l=${city}&radius=0`;
        await page.goto(url, { waitUntil: "load" });
        await page.waitForTimeout(3500);
        const html = await page.content();
        const $ = cheerio.load(html);

        const searchCount: string = $(".jobsearch-JobCountAndSortPane-jobCount").text();

        const searchCountNumber: number = parseInt(searchCount.replace(/\D/g, ""));
        console.log(`${category}: ${searchCountNumber}`);

        categoriesData[category] = searchCountNumber;
    }
    // Rename C%2B%2B to C++ and C%23 to C#
    programmingLangsData["C++"] = programmingLangsData["C%2B%2B"];
    delete programmingLangsData["C%2B%2B"];
    programmingLangsData["C#"] = programmingLangsData["C%23"];
    delete programmingLangsData["C%23"];

    const data = {
        timestamp,
        city: city,
        country: country,
        programmingLangs: programmingLangsData,
        frameworks: frameworksData,
        categories: categoriesData,
    };
    console.log(data);
    await browser.close();

    return data;
}
