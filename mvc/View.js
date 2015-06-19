/* global Ajax */

/**
 * Used as a wrapper for the view abstraction in
 * ittalentsmvc  
 * @param {Application} application
 * @returns {View}
 */
function View(application) {
    this.application = application;
    this.cache = {};
}

View.prototype.getView = function(template, reload) {
    var url = this.application.config.templatePath + '/' + template;
    if (!reload && url in this.cache) {
        return this.cache[url];
    }

    var request = Ajax.getRequest(url, null, false);
    if (request.status === 200) {
        this.cache[url] = request.responseText;
    } else {
        throw new Error(request.responseText);
    }

    return this.cache[url];

}