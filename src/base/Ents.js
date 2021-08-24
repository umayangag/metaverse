import WWW from "./WWW.js";

export const ENT = {
  COUNTRY: "country",
  PROVINCE: "province",
  DISTRICT: "district",
  DSD: "dsd",
  GND: "gnd",
};

export const REGION_TYPES = Object.values(ENT);

export const ENT_TO_NAME = {
  [ENT.PROVINCE]: "Province",
  [ENT.DISTRICT]: "District",
  [ENT.DSD]: "Divisional Secretariat Division",
  [ENT.GND]: "Grama Niladhari Division",
};

export const PARENT_TO_CHILD = {
  [ENT.COUNTRY]: ENT.PROVINCE,
  [ENT.PROVINCE]: ENT.DISTRICT,
  [ENT.DISTRICT]: ENT.DSD,
  [ENT.DSD]: ENT.GND,
  [ENT.GND]: undefined,
};

export default class Ents {
  static getRegionName(regionType) {
    return ENT_TO_NAME[regionType];
  }
  static async getEntsByType(entType) {
    const url = `data/ents/${entType}.tsv`;
    return await WWW.tsv(url);
  }

  static async getEntIndexByType(entType) {
    const ents = await Ents.getEntsByType(entType);
    return ents.reduce(function (entIndex, ent) {
      entIndex[ent.id] = ent;
      return entIndex;
    }, {});
  }

  static async getAllEntIndex() {
    const entTypes = REGION_TYPES;
    const entIndexList = await Promise.all(
      entTypes.map(async function (entType) {
        return await Ents.getEntIndexByType(entType);
      })
    );

    return entTypes.reduce(function (allEntIndex, entType, iEnt) {
      allEntIndex[entType] = entIndexList[iEnt];
      return allEntIndex;
    }, {});
  }

  static async getEnt(entType, entID) {
    const entIndex = await Ents.getEntIndexByType(entType);
    let ent = entIndex[entID];
    if (ent["centroid"]) {
      ent["centroid"] = JSON.parse(ent["centroid"]);
    }
    return ent;
  }

  static async getParentToChildMap() {
    const url = `data/ents/parent_to_child_map.json`;
    return await WWW.json(url);
  }

  static async getChildIDs(parentID, childRegionType) {
    const ents = await Ents.getEntsByType(childRegionType);
    return ents
      .map((ent) => ent.id)
      .filter((entID) => entID.includes(parentID));
  }

}
