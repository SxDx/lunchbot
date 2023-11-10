import Slack from "@slack/bolt";
import { SlackHelper } from "../services/slack_helper.js";
import { EventHandler } from "./event_handler.js";

import { createHiddenKitchen } from "../restaurants/hidden_kitchen.js";
import { createSpoonfood } from "../restaurants/spoonfood.js";
import { createLucullus } from "../restaurants/lucullus.js";

export class MenuHandler implements EventHandler {
  constructor(
    private readonly lunchbot: Slack.App,
    private readonly slackHelper: SlackHelper
  ) {}

  install() {
    this.lunchbot.event("app_mention", async ({ event, client }) => {
      const today = new Date();

      const restaurants = await Promise.all([
        createHiddenKitchen(this.slackHelper),
        createLucullus(this.slackHelper),
        createSpoonfood(this.slackHelper),
      ]);

      let attachments = restaurants.map(
        (restaurant) => restaurant.shareableUrl
      );
      attachments = attachments.filter(
        (attachment) => attachment !== undefined
      );
      const attachmentsMessage = attachments
        .map((url) => `<${url} | >`)
        .join(" ");

      const markdownMessage = attachmentsMessage;
      const blocks = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `:bento: Lunch menus for ${today.toLocaleString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: attachmentsMessage,
          },
        },
      ];
      await client.chat.postMessage({
        channel: event.channel,
        text: markdownMessage,
        blocks: blocks,
      });
    });
  }
}
