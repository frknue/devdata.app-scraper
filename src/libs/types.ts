export interface CityData {
  timeStamp: string;
  city: string;
  country: string;
  programmingLangs: {
    [key: string]: number;
  };
  frameworks: {
    [key: string]: number;
  };
  categories: {
    [key: string]: number;
  };
}
