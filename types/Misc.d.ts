/**
 * Miscellaneous utility.
 */
export default class {
    private static fallbackGlobalObject;
    /**
     * Returns false if the operating environment is a browser and true if it is Node.js
     *
     * @return {boolean}
     */
    static isNodeEnvironment(): boolean;
    /**
     * Returns a window object for browsers and a global object for Node.js
     *
     * @return {any}
     */
    static getGlobal<T>(): T;
}
