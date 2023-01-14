const { MongoClient } = require("mongodb");
require("dotenv").config();

import { CityData } from "./types";

const uri = process.env.URI;

const client = new MongoClient(uri);

export async function connectDB() {
  await client
    .connect()
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err: unknown) => {
      console.log(err);
    });
}

export async function getCityData(
  country: string,
  city: string
): Promise<CityData> {
  await connectDB();
  const cityData = await client
    .db("DevProject")
    .collection(country.toLowerCase())
    .findOne({ city: city });
  return cityData;
}

export async function addOrUpdate(data: CityData) {
  await connectDB();
  const city = await client.db("DevProject").collection(data.country).findOne({
    city: data.city,
  });
  if (city != null) {
    console.log("Updating city data");
    await client
      .db("DevProject")
      .collection(data.country)
      .replaceOne({ city: data.city }, data);
  } else {
    console.log("city does not exist in DB inserting...");
    await client.db("DevProject").collection(data.country).insertOne(data);
  }
}
