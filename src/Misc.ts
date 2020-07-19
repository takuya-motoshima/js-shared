/**
 * Miscellaneous utility.
 */
export default class {
  
  private static fallbackGlobalObject: {} = {};

  /**
   * Returns false if the operating environment is a browser and true if it is Node.js
   * 
   * @return {boolean}
   */
  public static isNodeEnvironment(): boolean {
    return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
  }

  /**
   * Returns a window object for browsers and a global object for Node.js
   *
   * @return {any}
   */
  public static getGlobal<T>(): T {
    return (this.isNodeEnvironment()
      ? global
      : typeof window !== 'undefined'
      ? window
      : typeof self !== 'undefined'
      ? self
      : this.fallbackGlobalObject) as T;
  }
}
