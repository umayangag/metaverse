import Cache from "./Cache.js";

const JSON_HEADERS = {
  headers: {
    Accept: "application/json",
  },
};

const TSV_HEADERS = {
  headers: {
    Accept: "text/csv",
  },
};

async function jsonNonCache(url) {
  const response = await fetch(url, JSON_HEADERS);
  const dataJson = await response.json();
  return dataJson;
}

export default class WWW {
  static async json(url) {
    return Cache.get(`WWW.json.v3.${url}`, async function () {
      return jsonNonCache(url);
    });
  }

  static async tsv(url) {
    const response = await fetch(url, TSV_HEADERS);
    const content = await response.text();
    const lines = content.split("\n");
    const keys = lines[0].split("\t").map((key) => key.replace("\r", ""));
    const dataList = lines.slice(1, -1).map(function (line) {
      const values = line.split("\t");
      return keys.reduce(function (data, key, i) {
        data[key] = values[i];
        return data;
      }, {});
    });
    return dataList;
  }
}
