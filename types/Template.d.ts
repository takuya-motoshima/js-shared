/**
 * Embedded JavaScript templates
 */
export default class Template {
    private static _compiler;
    /**
     * Returns a reusable template
     *
     * @param {string} source
     */
    static compile(source: string): HandlebarsTemplateDelegate<any>;
    /**
     *
     * Return Handlebars class containing helper functions
     *
     * @return {Handlebars}
     */
    private static get compiler();
}
