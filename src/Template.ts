/**
 * Template engine.
 * 
 * A template language that can generate HTML markup with JS.
 */
import Handlebars from 'handlebars';
import moment from 'moment';

/**
 * Embedded JavaScript templates
 */
export default class Template {

  private static _compiler: typeof Handlebars|undefined = undefined;

  /**
   * Returns a reusable template
   * 
   * @param {string} source
   */
  public static compile(source: string): HandlebarsTemplateDelegate<any> {
    return Template.compiler.compile<any>(source);
    // return Handlebars.create().compile<any>(source);
  }

  /**
   *
   * Return Handlebars class containing helper functions
   * 
   * @return {Handlebars}
   */
  private static get compiler(): typeof Handlebars {
    if (!Template._compiler) {

      /**
       * Shift operation
       * 
       * @param {number}  number
       * @param {number}  precision
       * @param {boolean} reverseShift
       */
      function shift(number: number, precision: number, reverseShift: boolean): number {
        if (reverseShift) precision = -precision;
        const numArray = ('' + number).split('e');
        return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + precision) : precision));
      }

      // Get the `Math.ceil()` of the given value.
      Handlebars.registerHelper('ceil', (...args: any[]) => {
        let number: number;
        let precision: number = 0;
        if (args.length === 2) number = args[0];
        else if (args.length === 3) [ precision, number ] = args;
        else throw new Error('Invalid argument');
        return shift(Math.ceil(shift(number, precision, false)), precision, true);
      });

      // Get the `Math.floor()` of the given value.
      Handlebars.registerHelper('floor', (...args: any[]) => {
        let number: number;
        let precision: number = 0;
        if (args.length === 2) number = args[0];
        else if (args.length === 3) [ precision, number ] = args;
        else throw new Error('Invalid argument');
        return shift(Math.floor(shift(number, precision, false)), precision, true);
      });

      // Round the given number.
      Handlebars.registerHelper('round', (...args: any[]) => {
        let number: number;
        let precision: number = 0;
        if (args.length === 2) number = args[0];
        else if (args.length === 3) [ precision, number ] = args;
        else throw new Error('Invalid argument');
        return shift(Math.round(shift(number, precision, false)), precision, true);
      });

      // Equal to
      Handlebars.registerHelper('eq', (value1: any, value2: any): boolean => value1 == value2);

      // Not equal to
      Handlebars.registerHelper('ne', (value1: any, value2: any): boolean => value1 != value2);

      // Less than
      Handlebars.registerHelper('lt', (value1: any, value2: any): boolean => value1 < value2);

      // Greater than
      Handlebars.registerHelper('gt', (value1: any, value2: any): boolean => value1 > value2);

      // Less than or equal to
      Handlebars.registerHelper('le', (value1: any, value2: any): boolean => value1 <= value2);

      // Greater than or equal to
      Handlebars.registerHelper('ge', (value1: any, value2: any): boolean => value1 >= value2);

      // And operator
      Handlebars.registerHelper('and', (...args: any): boolean => Array.prototype.slice.call(args).every(Boolean));

      // Or operator
      Handlebars.registerHelper('or', (...args: any): boolean => Array.prototype.slice.call(args, 0, -1).some(Boolean));

      // Date utility moment
      Handlebars.registerHelper('moment', (...args: any): any => {
        function marshallDate(date: any, unix: any) {
          if (typeof date === 'string' && date.match(/^\d+(\.\d+){0,1}$/)) date = +date;
          if (unix && typeof date === 'number') date = date * 1000;
          return date;
        }
        function manipulateMoment(momentObj: any, method: string): void {
          const arg = params[method];
          if (arg) {
            let argParam = params[method + 'param'];
            if (argParam === undefined) argParam = params.amount;
            let args = arg;
            if (argParam) {
              const addNum = +arg;
              args = {};
              if (isNaN(addNum)) args[arg] = +argParam;
              else args[argParam] = addNum;
            }
            momentObj[method](args);
          }
        }
        const FORMAT: { [key: string]: string } = { dates: 'date', months: 'month', years: 'year', isoweekday: 'isoWeekday', dayofyear: 'dayOfYear', isoweek: 'isoWeek', isoweeks: 'isoWeek', weekyear: 'weekYear', isoweekyear: 'isoWeekYear', zoneabbr: 'zoneAbbr', zonename: 'zoneName', tostring: 'toString', string: 'toString', str: 'toString', valueof: 'valueOf', value: 'valueOf', val: 'valueOf', fromnow: 'fromNow', daysinmonth: 'daysInMonth', todate: 'toDate', toarray: 'toArray', array: 'toArray', tojson: 'toJSON', json: 'toJSON', toisostring: 'toISOString', isostring: 'toISOString' };
        const WEEKDAY: { [key: string]: string } = { L: 'dddd', S: 'ddd', XS: 'dd' };
        const options = args.pop();
        let date = args.shift();
        let format = args.shift();
        let formatParams = args.shift();
        let formatParams1 = args.shift();
        let formatParams2 = args.shift();
        if (options.hash && options.hash.params) {
          options.hash = Object.assign({}, options.hash.params, options.hash);
          delete options.hash.params;
        }
        const params = options.hash;
        if (!date) date = params.date;
        date = marshallDate(date, params.unix);
        const max = marshallDate(params.max, params.unixmax);
        const min = marshallDate(params.min, params.unixmin);
        if (!format) format = params.format || params.fn;
        if (FORMAT[format]) format = FORMAT[format];
        if (format === 'weekday') {
          params.type = params.type ? params.type.toUpperCase() : null;
          if (params.type !== 'NUMBER') {
            if (WEEKDAY[params.type]) format = WEEKDAY[params.type];
            else　format = WEEKDAY.L;
          }
        }
        let ofMethod = 'start';
        let ofType = params.startOf || params.startof;
        if (!ofType) {
          ofType = params.endOf || params.endof;
          if (ofType) ofMethod = 'end';
        }
        let momentObj: any;
        if (moment.isMoment(date)) momentObj = date.clone();
        else momentObj = (params.utc ? moment.utc : moment)(date, params.input);
        if (params.lang) momentObj.lang(params.lang);
        if (max) momentObj = moment.max(moment(max), momentObj);
        if (min) momentObj = moment.min(moment(min), momentObj);
        if (ofType) momentObj = momentObj[ofMethod + 'Of'](ofType);
        if (params.nosuffix === undefined && params.suffix !== undefined) params.nosuffix = !params.suffix;
        if (params.from) {
          format = 'from';
          formatParams = marshallDate(params.from, params.unixfrom);
        }
        if (format === 'fromNow' && formatParams === undefined) formatParams = params.nosuffix;
        if (format === 'from' && formatParams1 === undefined) formatParams1 = params.nosuffix;
        if (params.diff) {
          format = 'diff';
          formatParams = marshallDate(params.diff, params.unixdiff);
        }
        if (format === 'diff') {
          if (formatParams1 === undefined) formatParams1 = params.unitdiff;
          if (formatParams2 === undefined) formatParams2 = params.nosuffix;
        }
        manipulateMoment(momentObj, 'add');
        manipulateMoment(momentObj, 'subtract');
        if (params.local) momentObj.local();
        else if (params.utc) momentObj.utc();
        return momentObj[format] ? momentObj[format](formatParams, formatParams1, formatParams2) : momentObj.format(format);
      });

      Template._compiler = Handlebars;
    }
    return Template._compiler;
  }
}
