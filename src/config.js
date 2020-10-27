// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: true,

  intentMap: {
    "AMAZON.YesIntent": "YesIntent",
    "AMAZON.NoIntent": "NoIntent",
    "AMAZON.RepeatIntent": "RepeatIntent",
    "AMAZON.StopIntent": "StopIntent",
    "AMAZON.HelpIntent": "HelpIntent",
    "AMAZON.CancelIntent": "CancelIntent",
    "AMAZON.FallbackIntent": "Unhandled",
    },
    i18n: {
      resources: {
          'en-US': require('./i18n/en-US.json'),
      }
  }, 
  db: {
    FileDb: {
      pathToFile: '../db/db.json',
    },
  },
};


