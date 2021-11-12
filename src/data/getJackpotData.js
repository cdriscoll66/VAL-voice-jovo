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
