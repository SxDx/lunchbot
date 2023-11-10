import type { Menu } from "../interfaces/menu.js";
import { SlackHelper } from "../services/slack_helper.js";

export async function createHiddenKitchen(
  slackHelper: SlackHelper
): Promise<Menu> {
  const name = "Hidden Kitchen Park";
  const url = "https://www.hiddenkitchen.at/s/Park.pdf";

  const shareableUrl = await slackHelper.uploadFileFromUrl(url, name);
  return { name: name, shareableUrl: shareableUrl };
}
