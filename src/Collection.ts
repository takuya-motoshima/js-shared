/**
 * Collection utility.
 */
export default class {

  /**
   * Remove duplicates from an array
   *  
   * @param  {any[]} items
   * @return {any}
   */
  public static unique(items: any[]): any {
    return items.filter((element, index, items) => items.indexOf(element) === index);
  }
}