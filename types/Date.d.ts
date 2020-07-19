export default class {
    /**
     * Format current date
     *
     * @param  {string[]} ...args
     * @return {string}
     */
    static format(...args: string[]): string;
    /**
     * Returns an array of times
     *
     * @param  {string[]} ...args
     * @return {string[]}
     */
    static timesOneDay(...args: string[]): string[];
    /**
     * Returns the day of the month
     *
     * @param  {string[]} ...args
     * @return {string[]}
     */
    static daysInMonth(...args: string[]): string[];
    /**
     * Returns consecutive dates at regular intervals
     *
     * @param  {number}                                                      step
     * @param  {'years'|'months'|'weeks'|'days'|'hours'|'minutes'|'seconds'} unit
     * @param  {string}                                                      start
     * @param  {string}                                                      end
     * @param  {string}                                                      format = 'YYYY-MM-DDTHH:mm:ssZ'
     * @return {string[]}
     */
    static range(step: number, unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds', start: string, end: string, format?: string): string[];
    /**
     * Date addition
     *
     * @param  {string}                                                      date
     * @param  {number}                                                      step
     * @param  {'years'|'months'|'weeks'|'days'|'hours'|'minutes'|'seconds'} unit
     * @param  {ssZ'}                                                        format = 'YYYY-MM-DDTHH:mm:ssZ'
     * @return {string}
     */
    static add(date: string, step: number, unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds', format?: string): string;
    /**
     * Date validation
     *
     * @param  {string}           date
     * @param  {string|undefined} format
     * @return {boolean}
     */
    static isValid(date: string, format?: string | undefined): boolean;
}
