/**
 * Type utility.
 * 
 * Utility for type determination and type related processing.
 */
export default class {

  /**
   * Returns whether it is an Async function
   * 
   * @example
   * import { Types } from 'js-shared';
   *
   * function myFunction() {}
   * function async myAsyncFunction {}
   *
   * Types.isAsync(myFunction);// false
   * Types.isAsync(myAsyncFunction);// true
   * 
   * @param  {Function} value
   * @return {boolean}
   */
  public static isAsync(value: Function): boolean {
    return value && value.constructor && value.constructor === Object.getPrototypeOf(async function(){}).constructor
  }
}
