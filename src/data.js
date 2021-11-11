"use strict";

const axios = require("axios");
const parser = require("xml2json");

/**
 * Async function that returns jackpot info
 */
let getJackpotData = async () => {
  // endpoint
  // let lotteryXMLEndpoint = "https://valottery.com/jackpots.xml";
  // let lotteryXMLEndpoint = "https://valottery.com/resulttable.xml";
  // Temporary test endpoint
  let lotteryXMLEndpoint =
    "https://dev-churchhill.pantheonsite.io/resultTable_CASHPOP.xml";
  try {
    let res = await axios({
      url: lotteryXMLEndpoint,
      method: "get",
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      // Don't forget to return something
      return parseXMLData(res.data);
    }
  } catch (err) {
    console.error(err);
  }

  return false;
};

/**
 * Async function that returns winning numbers by key
 *
 * @param {*} gameKey
 */
let getWinningNumbersData = async (gameKey) => {
  // fetch data from the API
  let data = await fetchWinningNumbersData();
  // if the data comes through for our key return it
  let tmp = {};
  if (false !== data && gameKey in data["results"]) {
    if (gameKey == "cashPop") {
      let k;
      let cashPopResults = data["results"]["cashPop"];
      tmp["numbers"] = "";
      tmp["date"] = new Date(
        data["results"]["cashPop"]["draw1"]["drawdate"]
      ).toDateString();
      let i = 0;
      let lngth = Object.keys(cashPopResults).length;
      for (k in cashPopResults) {
        let num = cashPopResults[k]["N1"].toString();
        if (i === lngth - 1) {
          tmp["numbers"] += "and ";
          tmp["numbers"] += num;
        } else {
          tmp["numbers"] += num;
          tmp["numbers"] += ", ";
        }
        i++;
      }
    }
    else if ("draw1" in data["results"][gameKey]) {
      let k;
      // handle multiple drawings
      for (k in data["results"][gameKey]) {
        tmp[k] = {};

        // handle single multiple games
        tmp[k]["numbers"] = filterKeys(data["results"][gameKey][k], /^N/);
        if (tmp[k]["numbers"].length > 0) {
          // format the numbers

          // Pre Fireball updates
          // tmp[k]["numbers"] = tmp[k]["numbers"]

          // .join(", ")
          // .replace(/,(?=[^,]+$)/, ", and ");

          // Post Fireball Updates
          tmp[k]["numbers"] = tmp[k]["numbers"];
          tmp[k]["fireBall"] = tmp[k]["numbers"].pop();
          tmp[k]["numbers"] = tmp[k]["numbers"].join(", ");
        } else {
          // return false if we don't have any numbers
          tmp[k]["numbers"] = false;
        }

        // get draw date as a string
        if ("drawdate" in data["results"][gameKey][k]) {
          let drawDate = new Date(data["results"][gameKey][k]["drawdate"]);
          tmp[k]["drawdate"] = drawDate.toDateString();
        }
        if ("drawtime" in data["results"][gameKey][k]) {
          tmp[k]["drawtime"] = data["results"][gameKey][k]["drawtime"];
        }
      }
    } else {
      // handle single drawing games

      // get winning numbers as a string
      tmp["numbers"] = filterKeys(data["results"][gameKey], /^N/);
      tmp["bonusBall"] = tmp["numbers"].pop();
      tmp["numbers"] = tmp["numbers"].join(", ");
      // get draw date as a string
      if ("drawdate" in data["results"][gameKey]) {
        let drawDate = new Date(data["results"][gameKey]["drawdate"]);
        tmp["drawdate"] = drawDate.toDateString();
      }
    }

  } else if (false !== data && gameKey in data["results"]["cashPop"]){
      tmp["number"] = data["results"]["cashPop"][gameKey]["N1"]
      tmp["drawtime"] = data["results"]["cashPop"][gameKey]["drawtime"]
      tmp["date"] = new Date(
        data["results"]["cashPop"][gameKey]["drawdate"]
      ).toDateString();
    }
        // return numbers data
        return tmp;
  return false;
};

/**
 * Async function that returns raffle info
 */
let getRaffleData = async () => {
  // endpoint
  let lotteryXMLEndpoint = "https://valottery.com/raffle.xml";

  try {
    let res = await axios({
      url: lotteryXMLEndpoint,
      method: "get",
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      // Don't forget to return something
      return parseXMLData(res.data);
    }
  } catch (err) {
    console.error(err);
  }

  return false;
};

/**
 * Async function that returns Rolling Jackpot info
 */
let getRollingJackpotData = async () => {
  // endpoint
  let lotteryXMLEndpoint = "https://valottery.com/rollingjackpot.xml";
  console.log("pullingdata");
  try {
    let res = await axios({
      url: lotteryXMLEndpoint,
      method: "get",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      // Don't forget to return something
      return parseXMLData(res.data);
    }
  } catch (err) {
    console.error(err);
  }

  return false;
};

/**
 * fetches winning data from external web service
 */
let fetchWinningNumbersData = async () => {
  // endpoint
  // let lotteryXMLEndpoint = "https://valottery.com/resulttable.xml";
  //temporary server to check off of.
  let lotteryXMLEndpoint =
    "https://dev-churchhill.pantheonsite.io/resultTable_CASHPOP.xml";
  try {
    let res = await axios({
      url: lotteryXMLEndpoint,
      method: "get",
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      // Don't forget to return something
      return parseXMLData(res.data);
    }
  } catch (err) {
    console.error(err);
  }

  return false;
};

/**
 * parses XML to JSON
 *
 * @param {*} xml
 */
let parseXMLData = (xml) => {
  let json = parser.toJson(xml);
  return JSON.parse(json);
};

/**
 * Filter out keys/values by pattern
 *
 * @param {*} obj
 * @param {*} filter
 */
let filterKeys = (obj, filter) => {
  let key,
    values = [];

  for (key in obj) {
    if (obj.hasOwnProperty(key) && filter.test(key) && "" !== obj[key]) {
      values.push(obj[key]);
    }
  }

  return values;
};

module.exports.getJackpotData = getJackpotData;
module.exports.getWinningNumbersData = getWinningNumbersData;
module.exports.getRaffleData = getRaffleData;
module.exports.getRollingJackpotData = getRollingJackpotData;
