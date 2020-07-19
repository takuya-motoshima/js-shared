export default class {
    /**
     * Returns one randomly between two specified numbers
     *
     * @param  {number} start
     * @param  {number} stop
     * @return {number}
     */
    static randInt(start: number, stop: number): number;
    /**
     * Randomly return one element from an array
     *
     * @param  {any[]} collection
     * @return {any}
     */
    static sample(collection: any[]): any;
    /**
     * Returns HSL color (hue, saturation, lightness) at random
     *
     * @param  {number} options.hmax Maximum allowed value for Hue in the HSL color model.
     * @param  {number} options.hmin Minimum allowed value for Hue in the HSL color model.
     * @param  {number} options.smax Maximum allowed value for Saturation in the HSL color model.
     * @param  {number} options.smin Minimum allowed value for Saturation in the HSL color model.
     * @param  {number} options.lmax Maximum allowed value for lightnessMax in the HSL color model.
     * @param  {number} options.lmin Minimum allowed value for lightnessMax in the HSL color model.
     * @return {string}
     */
    static randHSL({ hmax, hmin, smax, smin, lmax, lmin }: {
        hmax?: number;
        hmin?: number;
        smax?: number;
        smin?: number;
        lmax?: number;
        lmin?: number;
    }): string;
}
