import Slack from "@slack/bolt";
import { SlackHelper } from "./services/slack_helper.js";
import { MenuHandler } from "./handlers/menu.js";
import { LunchTrainHandler } from "./handlers/lunch_train.js";

const lunchbot = new Slack.App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  port: Number(process.env.PORT) || 3000,
  logLevel: Slack.LogLevel.DEBUG,
});

const slackHelper = new SlackHelper(lunchbot);
const menuHandler = new MenuHandler(lunchbot, slackHelper);
const lunchTrainHandler = new LunchTrainHandler(lunchbot, slackHelper);

menuHandler.install();
lunchTrainHandler.install();

(async () => {
  try {
    await lunchbot.start();
    console.log("🍱 Lunchbot ready!");
  } catch (error) {
    console.error("Error starting Lunchbot:", error);
  }
})();
