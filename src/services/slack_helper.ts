import { App } from "@slack/bolt";
import { createMenuFileName } from "../helpers/utils.js";

export class SlackHelper {
  constructor(private readonly lunchbot: App) {}

  async uploadFileFromUrl(url: string, name: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const filename = createMenuFileName(name, "pdf");

        const result = await this.lunchbot.client.files.upload({
          filename,
          file: Buffer.from(buffer),
        });

        if (!result.ok) {
          reject(new Error(`Failed to upload file: ${result.error}`));
        }

        resolve(result.file!.permalink!);
      } catch (error) {
        reject(new Error(`Failed to upload file: ${error}`));
      }
    });
  }

  async uploadFileToSlack(
    file: Buffer,
    name: string,
    filetype: string
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const filename = createMenuFileName(name, filetype);

      try {
        const result = await this.lunchbot.client.files.upload({
          file: file,
          filename: filename,
          filetype: filetype,
        });

        if (!result.ok) {
          reject(new Error(`Failed to upload file: ${result.error}`));
        }

        resolve(result.file!.permalink!);
      } catch (error) {
        reject(new Error(`Failed to upload file: ${error}`));
      }
    });
  }
}
