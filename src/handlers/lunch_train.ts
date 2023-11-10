import Slack from "@slack/bolt";
import { SlackHelper } from "../services/slack_helper.js";
import { EventHandler } from "./event_handler.js";

import { lunchtrainMessage } from "../helpers/message.js";

export class LunchTrainHandler implements EventHandler {
  constructor(
    private readonly lunchbot: Slack.App,
    private readonly slackHelper: SlackHelper
  ) {}

  install() {
    this.lunchbot.command("/lunchtrain", async ({ command, ack, client }) => {
      await ack();

      const args = command.text.split(" ");

      // Check if both destination and time are provided as arguments
      if (args.length === 2) {
        const [destination, time] = args;

        const blocks = lunchtrainMessage(destination, time, command.user_id);

        await client.chat.postMessage({
          channel: command.channel_id,
          blocks,
        });

        return;
      }

      const blocks = [
        {
          type: "input",
          block_id: "destination_block",
          label: {
            type: "plain_text",
            text: "Destination",
          },
          element: {
            type: "plain_text_input",
            action_id: "destination",
          },
        },
        {
          type: "input",
          block_id: "time_block",
          label: {
            type: "plain_text",
            text: "Time",
          },
          element: {
            type: "plain_text_input",
            action_id: "time",
          },
        },
      ];

      // Open a modal to collect the destination and time
      await client.views.open({
        trigger_id: command.trigger_id,
        view: {
          type: "modal",
          callback_id: "lunchtrain_modal",
          title: {
            type: "plain_text",
            text: "Start a Lunch Train",
          },
          blocks,
          submit: {
            type: "plain_text",
            text: "Submit",
          },
          private_metadata: command.channel_id,
        },
      });
    });

    this.lunchbot.view(
      "lunchtrain_modal",
      async ({ view, ack, client, context }) => {
        await ack();

        const destination =
          view.state.values.destination_block.destination.value;
        const time = view.state.values.time_block.time.value;

        if (!destination || !time) {
          return;
        }

        const blocks = lunchtrainMessage(destination, time, context.userId!);

        await client.chat.postMessage({
          channel: view.private_metadata,
          blocks,
        });
      }
    );
  }
}
