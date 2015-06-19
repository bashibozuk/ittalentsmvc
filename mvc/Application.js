/**
 * The abstraction for application
 * loads a configuration
 * listens for window.onhashchange event
 * creates controller and renders template by given 
 * configuration options
 * @type  Function|Application_L8.ApplicationAnonym$0
 */
var Application = (function(config){


    function Application(config) {
        this.config = config;
        this.view = new View(this);
    }

    Application.prototype.start = function() {
        var _this= this;
        if ('addEventListener' in window) {
            window.addEventListener('hashchange', function() {
                _this.dispatch();
            }, false);
        } else {
            window.attachEvent('onhashchange', function() {
                _this.dispatch();
            });
        }

        _this.dispatch();
    }
    /**
     * Dispatches the hashchange event
     * reads the new hash, creates a controller and 
     * loads the template which will be loaded in the visible area
     *
     * @returns {undefined}
     */
    Application.prototype.dispatch = function() {

        // get the hash from the url
        var hash = window.location.hash.replace('#', '');

        // get the container element(the one with attribute app-container, there should be only one in the master page)
        var container = document.querySelector('[data-role="app-container"]');
        // if we have valid route set up in the configuration
        if (this.config.routes[hash]) {
            // loading the thext content for the view
            var view = this.view.getView(this.config.routes[hash].template);
            // find the controller id
            var controllerID = this.config.routes[hash].controller;
            // initialize variable holding the controller constructor function
            var controllerClass = this.config.controllers[controllerID];
            // create instance of the controller
            var controller = new controllerClass();

            // wrap the view in a DocumentFragment
            var fragment = document.createDocumentFragment();
            var viewContainer = document.createElement('div');
            viewContainer.className = 'view-container';
            viewContainer.innerHTML = view;
            // decorate the fragment with event handlers and extra content;
            controller.onCreateView(viewContainer);

            // show the view as content of the container
            container.innerHTML = '';

            fragment.appendChild(viewContainer);
            container.appendChild(fragment);
        }
    };

    var app = null;
    return {
      start: function () {
          app.start();
      },
      createApp: function(config) {
          app = new Application(config)
          return this;
      },
      getConfigValue: function(name) {
          return app.config[name];
      }
    };
})();
