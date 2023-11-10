import type { Menu } from "../interfaces/menu.js";
import { SlackHelper } from "../services/slack_helper.js";
import puppeteer from "puppeteer";

export async function createLucullus(slackHelper: SlackHelper): Promise<Menu> {
  const name = "Lucullus";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.lucullus-restaurant.at/menue", {});

  // on this page find a link that contains a child with the name "Mittagsmenü", get the href atribute of that link
  const urls = await page.$$eval(
    "a",
    (links) =>
      links
        .filter((link) => link.textContent?.includes("Mittagsmenü"))
        .map((link) => link.getAttribute("href")) as string[]
  );

  const url = urls[0];
  await browser.close();
  if (url === null) return { name: name, shareableUrl: undefined };

  const shareableUrl = await slackHelper.uploadFileFromUrl(url, name);
  return { name: name, shareableUrl: shareableUrl };
}
