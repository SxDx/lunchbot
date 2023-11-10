import type { Menu } from "../interfaces/menu.js";
import { SlackHelper } from "../services/slack_helper.js";
import puppeteer from "puppeteer";

export async function createSpoonfood(slackHelper: SlackHelper): Promise<Menu> {
  const name = "Spoonfood";
  const selector = "#tageskarte";
  const baseUrl = "https://www.spoonfood.at";

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(baseUrl, {});
  await page.waitForSelector(selector);
  const element = await page.$(selector);
  let menu = <Menu>{ name: name, shareableUrl: undefined };

  console.log("element", element);
  if (element) {
    const screenshot = await element.screenshot();
    console.log("screenshot", screenshot);
    const shareableUrl = await slackHelper.uploadFileToSlack(
      screenshot as Buffer,
      name,
      "png"
    );
    menu = <Menu>{ name: name, shareableUrl: shareableUrl };
  }
  await browser.close();
  return menu;
}
