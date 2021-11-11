"use strict";

// =================================================================================
// App Configuration
// =================================================================================

const { App } = require("jovo-framework");
const { Alexa } = require("jovo-platform-alexa");
// const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require("jovo-plugin-debugger");
// const { FileDb } = require('jovo-db-filedb');
const config = require("./config.js");
// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App(config);

app.use(
  new Alexa(),
  // new GoogleAssistant(),
  new JovoDebugger()
  // new FileDb()
);

const lotteryData = require("./data.js");

// // Add analytics layer
// app.addBespokenAnalytics("17157472-e0d2-45ea-8670-20f80055be48");
// app.addDashbotAlexa('UceYYMdT4XI896Dbe4W5alscQbRrNWeJBDbNQU0O');
// app.addBotanalyticsAlexa('12478d7b0c8b13ede4e73bfa3a89f951d92d9966');

// =================================================================================
// App Logic
// =================================================================================

let today = new Date();

app.setHandler({
  LAUNCH() {
    let speech = this.t("LAUNCH_SPEECH");
    let reprompt = this.t("LAUNCH_REPROMPT");

    this.ask(speech, reprompt);
  },
  async JackpotIntent() {
    // Let Alexa handle the dialogue via a delegate
    if (!this.$alexaSkill.$dialog.isCompleted()) {
      this.$alexaSkill.$dialog.delegate();
    }

    if (
      this.$inputs.lotteryGame.id == "powerball" ||
      this.$inputs.lotteryGame.id == "megamillion" ||
      this.$inputs.lotteryGame.id == "cash5"
    ) {
      let responseKey,
        speechResponse = "";
      switch (this.$inputs.lotteryGame.id) {
        case "powerball":
          responseKey = "powerBall";
          speechResponse = "JACKPOT_POWERBALL";
          break;
        case "megamillion":
          responseKey = "megaMillions";
          speechResponse = "JACKPOT_MEGAMILLIONS";
          break;
        case "cash5":
          responseKey = "cash5";
          speechResponse = "JACKPOT_CASH5";
          break;
      }

      // make the API call
      let data = await executeJackpotAPICall(responseKey);
      if (false !== data) {
        // write speech
        let speech = this.speechBuilder().addT(speechResponse, data);
        this.tell(speech);
      } else {
        // error handling

        let speech = this.speechBuilder().addT("JACKPOT_TROUBLE");
        this.tell(speech);
      }
    } else if (this.$inputs.lotteryGame.id == "rolling") {
      // get the api Information
      let data = await executeRollingJackpotAPICall("pnpRollingJackpot");
      if (false !== data) {
        if (data.jackpotValue == "$") {
          let speech = this.speechBuilder().addT(
            "JACKPOT_ROLLING_INVALID",
            data
          );
          this.tell(speech);
        } else {
          let speech = this.speechBuilder().addT(
            "JACKPOT_ROLLINGJACKPOT",
            data
          );
          this.tell(speech);
        }
      } else {
        // error handling
        let speech = this.speechBuilder().addT("JACKPOT_TROUBLE");
        this.tell(speech);
      }
    } else if ([
      "cashpop",
      "cashpopafter",
      "cashpopprime",
      "cashpoprush",
      "cashpoplunch",
      "cashpopcoffee",
    ].includes(this.$inputs.lotteryGame.id)
  ) {
    let speech = this.speechBuilder().addT("JACKPOT_CASHPOP").addT("NUMBERS_CASHPOP_OUTRO");
    this.tell(speech);
    } else {
      // Give a warning message for any other value of lotteryGame slot
      let speech = this.speechBuilder().addT("JACKPOT_INVALID", {
        // lotteryGame: this.$inputs.lotteryGame.id,
        lotteryGame: "that",
      });
      // .addT('JACKPOT_GAMES')
      this.tell(speech);
    }
  },
  NextDrawingIntent() {
    // Handle the dialogue
    if (!this.$alexaSkill.$dialog.isCompleted()) {
      this.$alexaSkill.$dialog.delegate();
    }
    // handle various draw times
    if (this.$inputs.lotteryGame.id == "powerball") {
      this.tell(this.speechBuilder().addT("DRAWING_POWERBALL"));
    } else if (this.$inputs.lotteryGame.id == "megamillion") {
      this.tell(this.speechBuilder().addT("DRAWING_MEGAMILLIONS"));
    } else if (this.$inputs.lotteryGame.id == "bankamillion") {
      this.tell(this.speechBuilder().addT("DRAWING_BANKMILLION"));
    } else if (this.$inputs.lotteryGame.id == "cash4") {
      this.tell(this.speechBuilder().addT("DRAWING_CASH4LIFE"));
    } else if (this.$inputs.lotteryGame.id == "cash5") {
      this.tell(this.speechBuilder().addT("DRAWING_CASH5"));
    } else if (this.$inputs.lotteryGame.id == "pick4") {
      this.tell(this.speechBuilder().addT("DRAWING_PICK4"));
    } else if (this.$inputs.lotteryGame.id == "pick3") {
      this.tell(this.speechBuilder().addT("DRAWING_PICK3"));
    } else if (this.$inputs.lotteryGame.id == "rolling") {
      this.tell(this.speechBuilder().addT("DRAWING_ROLLINGJACKPOT"));
    } else if (this.$inputs.lotteryGame.id == "cashpop") {
      this.tell(this.speechBuilder().addT("DRAWING_CASHPOP"));
    } else {
      // Give a warning message for any other value of lotteryGame slot
      let speech = this.speechBuilder()
        .addT("DRAWING_INVALID", {
          // lotteryGame: this.$inputs.lotteryGame.value,
          lotteryGame: "That",
        })
        .addT("DRAWING_GAMES");
      this.tell(speech);
    }
  },
  async WinningNumbersIntent() {
    if (!this.$alexaSkill.$dialog.isCompleted()) {
      this.$alexaSkill.$dialog.delegate();
    }

    // handle various winning numbers

    if (this.$inputs.lotteryGame.id == "powerball") {
      // handle the powerball slot
      let data = await executeWinningNumbersSingleAPICall("powerBall");

      if (false !== data) {
        let speech = this.speechBuilder().addT("NUMBERS_POWERBALL", data);
        this.tell(speech);
      } else {
        let speech = this.speechBuilder().addT("NUMBERS_TROUBLE");
        this.tell(speech);
      }
    } else if (this.$inputs.lotteryGame.id == "megamillion") {
      // handle the mega millions slot
      let data = await executeWinningNumbersSingleAPICall("megaMillions");
      if (false !== data) {
        let speech = this.speechBuilder().addT("NUMBERS_MEGAMILLIONS", data);
        this.tell(speech);
      } else {
        let speech = this.speechBuilder().addT("NUMBERS_TROUBLE");
        this.tell(speech);
      }
    } else if (this.$inputs.lotteryGame.id == "cash5") {
      // handle the cash5 slot
      let data = await executeWinningNumbersSingleAPICall("cash5");
      if (false !== data) {
        let speech = this.speechBuilder().addT("NUMBERS_CASH5", data);
        this.tell(speech);
      } else {
        let speech = this.speechBuilder().addT("NUMBERS_TROUBLE");
        this.tell(speech);
      }
    } else if (this.$inputs.lotteryGame.id == "bankamillion") {
      // handle the bank a million slot
      let data = await executeWinningNumbersSingleAPICall("bankAMillion");
      if (false !== data) {
        let speech = this.speechBuilder().addT("NUMBERS_BANKMILLION", data);
        this.tell(speech);
      } else {
        let speech = this.speechBuilder().addT("NUMBERS_TROUBLE");
        this.tell(speech);
      }
    } else if (this.$inputs.lotteryGame.id == "cash4") {
      // handle the cash 4 life slot
      let data = await executeWinningNumbersSingleAPICall("cash4Life");
      if (false !== data) {
        let speech = this.speechBuilder().addT("NUMBERS_CASH4LIFE", data);
        this.tell(speech);
      } else {
        let speech = this.speechBuilder().addT("NUMBERS_TROUBLE");
        this.tell(speech);
      }
    } else if (
      this.$inputs.lotteryGame.id == "pick4" ||
      this.$inputs.lotteryGame.id == "pick3"
    ) {
      let gameName = this.$inputs.lotteryGame.id;
      let responseKey,
        speechResponse = "";
      switch (this.$inputs.lotteryGame.id) {
        case "pick4":
          responseKey = "pick4";
          speechResponse = "NUMBERS_PICK4";
          break;
        case "pick3":
          responseKey = "pick3";
          speechResponse = "NUMBERS_PICK3";
          break;
      }

      // get the jackpot data
      let data = await lotteryData.getWinningNumbersData(responseKey);
      // set up speech
      let speech = "";
      // if there is data
      if (false !== data) {
        // write speech
        speech = this.speechBuilder();
        for (let k in data) {
          if (false !== data[k]["numbers"]) {
            speech = speech.addT(speechResponse, {
              numbers: data[k]["numbers"],
              fireball: data[k]["fireBall"],
              date: data[k]["drawdate"],
              time: data[k]["drawtime"],
            });
          } else {
            speech = speech.addT("NUMBERS_FUTURE", {
              lotteryGame: gameName,
              date: data[k]["drawdate"],
              time: data[k]["drawtime"],
            });
          }
        }
      } else {
        // error handling
        speech = this.speechBuilder().addT("NUMBERS_TROUBLE");
      }
      this.tell(speech);
    } else if (this.$inputs.lotteryGame.id == "rolling") {
      // handle the rolling slot
      this.tell(this.t("NUMBERS_ROLLINGJACKPOT"));
    } else if (this.$inputs.lotteryGame.id == "cashpop") {
      // handle cashpop full list
      let data = await lotteryData.getWinningNumbersData("cashPop");
      let speech = this.speechBuilder()
        .addT("NUMBERS_CASHPOP", data)
        .addT("NUMBERS_CASHPOP_OUTRO");
      this.tell(speech);
    } else if (
      [
        "cashpopafter",
        "cashpopprime",
        "cashpoprush",
        "cashpoplunch",
        "cashpopcoffee",
      ].includes(this.$inputs.lotteryGame.id)
    ) {
      let responseKey,
        speechResponse = "";
      switch (this.$inputs.lotteryGame.id) {
        case "cashpopcoffee":
          responseKey = "draw1";
          speechResponse = "NUMBERS_CASHPOP_COFFEE_BREAK";
          break;
        case "cashpoplunch":
          responseKey = "draw2";
          speechResponse = "NUMBERS_CASHPOP_LUNCH_BREAK";
          break;
        case "cashpoprush":
          responseKey = "draw3";
          speechResponse = "NUMBERS_CASHPOP_RUSH_HOUR";
          break;
        case "cashpopprime":
          responseKey = "draw4";
          speechResponse = "NUMBERS_CASHPOP_PRIME_TIME";
          break;
        case "cashpopafter":
          responseKey = "draw5";
          speechResponse = "NUMBERS_CASHPOP_AFTER_HOURS";
          break;
      }

      let data = await lotteryData.getWinningNumbersData(responseKey);
      let speech = this.speechBuilder();
      if (data["number"] === undefined) {
        speech.addT("NUMBERS_CASHPOP_NOTDRAWN", data);
        speech.addT("NUMBERS_CASHPOP_OUTRO");
      } else {
        speech.addT(speechResponse, data);
      }
      this.tell(speech);
    } else {
      // Give a warning message for any other value of lotteryGame slot
      let speech = this.speechBuilder()
        .addT("NUMBERS_INVALID", {
          lotteryGame: lotteryGame.value,
        })
        .addT("NUMBERS_GAMES");
      this.tell(speech);
    }
  },
  ListGamesIntent() {
    this.$speech.addT("LIST_GAMES");
    this.tell(this.$speech);
  },
  async RaffleIntent() {
    let raffleData = await lotteryData.getRaffleData();
    // init speech
    let speech = this.speechBuilder();

    let raffleStartDate = new Date("November 01, 2021 00:00:01");
    let raffleEndDate = new Date("January 01, 2022 00:00:01");

    if (today <= raffleEndDate && today >= raffleStartDate) {
      // check for valid data
      if (false !== raffleData && raffleData.hasOwnProperty("TransDetails")) {
        // get variables
        let raffleTickets = raffleData.TransDetails["details1"].tickets;
        let raffleUpdatedAt = new Date(
          raffleData.TransDetails["details2"].updated
        );

        if (raffleUpdatedAt) {
          speech = speech.addT("RAFFLE_UPDATE", {
            raffleUpdatedAt: raffleUpdatedAt.toDateString(),
          });
        }
        if (raffleTickets) {
          if (raffleTickets > 0) {
            speech = speech.addT("RAFFLE_TICKETS", {
              raffleTickets: raffleTickets,
            });
          } else {
            speech = speech.addT("RAFFLE_OUT");
          }
        } else {
          // error handling
          speech = speech.addT("RAFFLE_TROUBLE");
        }
      } else {
        // error handling
        speech = speech.addT("RAFFLE_TROUBLE");
      }
    } else {
      speech = speech.addT("RAFFLE_END");
    }
    this.tell(speech);
  },
  NoCanDoIntent() {
    this.tell(this.t("NOT_YET") + " " + this.t("OUTBOUND_MESSAGE"));
  },
  HelpIntent() {
    if (!this.$alexaSkill.$dialog.isCompleted()) {
      this.$alexaSkill.$dialog.delegate();
    }
    this.tell(
      this.t("LIST_INTENTS") +
        " " +
        this.t("HELP_MESSAGE") +
        " " +
        this.t("EXAMPLE_INVOCATION")
    );
  },
  CancelIntent() {
    this.tell(this.t("CANCEL_MESSAGE"));
  },
  StopIntent() {
    this.tell(this.t("STOP_MESSAGE"));
  },
  Unhandled() {
    this.toIntent("NoCanDoIntent");
  },
});

/**
 * API call for getting current jackpot data for a single game
 *
 * @param {*} responseKey reference key returned in the lottery API response
 */

let executeRollingJackpotAPICall = async (responseKey) => {
  // wait for data to come back from API
  let jackpotData = await lotteryData.getRollingJackpotData();

  let jackpotVal = jackpotData.results[responseKey].jackpotvalue;
  let jackpotDate = jackpotData.results[responseKey].jackpotdate;
  //convert jackpotVal to Currency
  jackpotVal = formatVal(jackpotVal);
  //convert jackpotDate to readable jackpotDate
  jackpotDate = new Date(jackpotDate);
  jackpotDate = formatDate(jackpotDate);

  // check for valid data
  if (
    false !== jackpotData &&
    undefined !== jackpotData.results[responseKey].jackpotvalue &&
    undefined !== jackpotData.results[responseKey].jackpotdate
  ) {
    return {
      jackpotValue: jackpotVal,
      jackpotDate: jackpotDate,
    };
  } else {
    return false;
  }
};

function formatDate(date) {
  let options = { month: "long" };
  let month = new Intl.DateTimeFormat("en-US", options).format(date);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return month + " " + date.getDate() + " at " + strTime;
}

function formatVal(val) {
  val = val.toString();
  val = "$" + val.slice(0, -2);
  return val;
}

/**
 * API call for getting current jackpot data for a single game
 *
 * @param {*} responseKey reference key returned in the lottery API response
 */
let executeJackpotAPICall = async (responseKey) => {
  // get the jackpot data
  let jackpotData = await lotteryData.getJackpotData();
  // check for valid data
  if (
    false !== jackpotData &&
    undefined !== jackpotData.results[responseKey].jackpotvalue &&
    undefined !== jackpotData.results[responseKey].cashvalue
  ) {
    return {
      jackpotValue: jackpotData.results[responseKey].jackpotvalue,
      cashValue: jackpotData.results[responseKey].cashvalue,
      multiplierValue: jackpotData.results[responseKey].mult,
    };
  } else if (
    false !== jackpotData &&
    undefined !== jackpotData.results[responseKey].jackpotvalue
  ) {
    return {
      jackpotValue: jackpotData.results[responseKey].jackpotvalue,
    };
  } else {
    return false;
  }
};

/**
 * API call for a single set of winning numbers for a single game
 *
 * @param {*} responseKey reference key returned in the lottery API response
 */
let executeWinningNumbersSingleAPICall = async (responseKey) => {
  // get the jackpot data
  let data = await lotteryData.getWinningNumbersData(responseKey);

  // if there is data
  if (false !== data) {
    return {
      numbers: data["numbers"],
      bonusBall: data["bonusBall"],
      date: data["drawdate"],
    };
  } else {
    // error handling
    return false;
  }
};

module.exports = { app };
