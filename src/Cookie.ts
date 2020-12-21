/**
 * Cookie utility
 */
import Cookies from 'js-cookie';

export default class {

  /**
   *  Set cookie
   *  
   * @param {string} key
   * @param {string} value
   */
  static set(key: string, value: string): void {
    Cookies.set(key, value);
  }

  /**
   *  Get cookie
   *  
   * @param {string} key
   */
  static get(key: string): string|undefined {
    return Cookies.get(key);
  }

  /**
   *  Remove cookie
   *  
   * @param {string} key
   */
  static remove(key: string): void {
    Cookies.remove(key);
  }
}