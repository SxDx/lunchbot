import { timeToEmoji } from "./utils.js";

export function lunchtrainMessage(
  destination: string,
  time: string,
  user: string
): any[] {
  const clockEmoji = timeToEmoji(time);
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":lunch_train: *All aboard the Lunch Train!*",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Train conductor:* :railway_car:\n<@${user}>\n\n*Destination:* :round_pushpin:\n${destination}\n\n*Departure Time:* ${clockEmoji}\n${time}`,
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "React with :raising_hand: to join.",
      },
    },
  ];

  return blocks;
}
