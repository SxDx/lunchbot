export interface Menu {
  /**
   * The name of the restaurant
   */
  readonly name: string;
  /**
   * The direct url to the uploaded menu on slack
   */
  readonly shareableUrl: string | undefined;
}
