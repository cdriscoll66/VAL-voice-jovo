// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  alexaSkill: {
    nlu: 'alexa',
  },
  // googleAction: {
  //   nlu: 'dialogflow',
  // },
  // endpoint: '${JOVO_WEBHOOK_URL}',
  stages: {
    local: {
      endpoint: '${JOVO_WEBHOOK_URL}',
    },
    dev: {
      endpoint: 'arn:aws:lambda:us-east-1:818943587759:function:VALotterySkillDev',
      alexaSkill: {
        skillId: 'amzn1.ask.skill.12319b98-d653-486d-bee4-9a8d5b85dc3c',
      },
    },
    prod: {
      endpoint: 'arn:aws:lambda:us-east-1:818943587759:function:VALotterySkillProd',
      alexaSkill: {
        skillId: 'amzn1.ask.skill.12319b98-d653-486d-bee4-9a8d5b85dc3c',
      },
    },
  },
};
