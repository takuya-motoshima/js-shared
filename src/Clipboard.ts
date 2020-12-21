import * as clipboard from "clipboard-polyfill/text";

/**
 * Save the clipboard.
 */
export default class {

  /**
   * Copy the string to the clipboard.
   * 
   * @param  {string}        str
   * @return {Promise<void>}
   */
  public static async save(str: string): Promise<void> {
    return clipboard.writeText(str);
  }
}