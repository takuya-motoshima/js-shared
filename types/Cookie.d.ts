export default class {
    /**
     *  Set cookie
     *
     * @param {string} key
     * @param {string} value
     */
    static set(key: string, value: string): void;
    /**
     *  Get cookie
     *
     * @param {string} key
     */
    static get(key: string): string | undefined;
    /**
     *  Remove cookie
     *
     * @param {string} key
     */
    static remove(key: string): void;
}
