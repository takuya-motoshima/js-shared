/**
 * Date utility.
 */
import moment from 'moment';

export default class {

  /**
   * Format current date
   * 
   * @param  {string[]} ...args
   * @return {string}
   */
  public static format(...args: string[]): string {
    let format = 'YYYY-MM-DDTHH:mm:ssZ';
    let date = moment();
    if (args.length === 1) {
      if (moment(args[0]).isValid()) {
        date = moment(args[0]);
      } else {
        format = args[0];
      }
    } else if (args.length === 2) {
      if (moment(args[0]).isValid()) {
        date = moment(args[0]);
        format = args[1];
      } else {
        throw new Error('Invalid argument');
      }
    }
    return date.format(format);
  }

  /**
   * Returns an array of times
   * 
   * @param  {string[]} ...args
   * @return {string[]}
   */

  public static timesOneDay(...args: string[]): string[] {
    let format = 'HH:mm';
    let startHour = 0;
    if (args.length === 1) {
      if (moment(args[0], 'H').isValid()) {
        startHour = parseInt(args[0], 10);
      } else {
        format = args[0];
      }
    } else if (args.length === 2) {
      if (moment(args[0], 'H').isValid()) {
        startHour = parseInt(args[0], 10);
        format = args[1];
      } else {
        throw new Error('Invalid argument');
      }
    }
    const date = moment({ hour: startHour, minute: 0});
    return Array
      .from({ length: 25 }, (_, i) => i)
      .reduce((acc: string[], addHours: number) => {
        acc.push(moment({ hour: (startHour + addHours) % 24, minute: 0 }).format(format));
        return acc;
      }, []);
  }

  /**
   * Returns the day of the month
   *
   * @param  {string[]} ...args
   * @return {string[]}
   */
  public static daysInMonth(...args: string[]): string[] {
    let month = moment().format('YYYY-MM');
    let format = 'D';
    if (args.length === 1) {
      if (moment(args[0], 'YYYY-MM').isValid()) {
        month = args[0];
      } else {
        format = args[0];
      }
    } else if (args.length === 2) {
      if (moment(args[0], 'YYYY-MM').isValid()) {
        month = args[0];
        format = args[1];
      } else {
        throw new Error('Invalid argument');
      }
    }
    const date = moment(month, 'YYYY-MM');
    return Array
      .from({ length: date.daysInMonth() }, (_, i) => i)
      .reduce((acc: string[], day: number) => {
        const addDays = day === 0 ? 0 : 1;
        acc.push(date.add(addDays, 'days').format(format));
        return acc;
      }, []);
  }

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
  public static range(
    step: number,
    unit: 'years'|'months'|'weeks'|'days'|'hours'|'minutes'|'seconds',
    start: string,
    end: string,
    format = 'YYYY-MM-DDTHH:mm:ssZ'
  ): string[] {
    const range = [];
    for (let target=moment(start).clone(); target.isSameOrBefore(moment(end)); target.add(step, unit)) {
      range.push(target.format(format));
    }
    return range;
  }

  /**
   * Date addition
   *
   * @param  {string}                                                      date
   * @param  {number}                                                      step
   * @param  {'years'|'months'|'weeks'|'days'|'hours'|'minutes'|'seconds'} unit
   * @param  {ssZ'}                                                        format = 'YYYY-MM-DDTHH:mm:ssZ'
   * @return {string}
   */
  public static add(date: string, step: number, unit: 'years'|'months'|'weeks'|'days'|'hours'|'minutes'|'seconds', format = 'YYYY-MM-DDTHH:mm:ssZ'): string {
    return moment(date).add(step, unit).format(format);
  }

  /**
   * Date validation
   *
   * @param  {string}           date
   * @param  {string|undefined} format
   * @return {boolean}
   */
  public static isValid(date: string, format: string|undefined = undefined): boolean {
    if (format !== undefined) {
      return moment(date, format, true).isValid();
    } else {
      return moment(date).isValid();
    }
  }
}
