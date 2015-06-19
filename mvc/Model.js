/**
 * 
 * Abstract class for all data entities in the applications
 * can be 
 * 1) applied to form
 * 2) loaded from form
 * 3) validated with custom validators
 * 3) can show it's errors to form fields 
 * Must be extended like this 
 * function ChildClass () {
 *  this.propertyOne = null;
 *  this.propertyTwo = null;
 *  Model.appli(this, arguments);
 * }
 *   
 * @returns {Model}
 */
function Model() {
    this.initErrors();
    this.validators = [];
}
/**
 * initializes object with own props 
 * @returns {undefined}
 */
Model.prototype.initErrors = function() {
    this.errors = {};
    for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
            this.errors[prop] = [];
        }
    }
}
/**
 * Adds an error to custom property
 * @param {type} field
 * @param {type} error
 * @returns {undefined}
 */
Model.prototype.addError = function(field, error) {
    if (!this.errors[field]) {
        throw new Error('Invalid field "' + field + '"');
    }

    this.errors[field].push(error);
}

/**
 * Adds validator
 * @param {String} field
 * @param {function} validator
 * @returns {undefined}
 */
Model.prototype.addValidator = function (field, validator) {
    this.validators.push({
        field : field,
        validator: validator
    });
};

/**
 * executes validator functions set with 
 * addValidator function
 * @returns {Boolean}
 */
Model.prototype.validate = function () {
    this.initErrors();
    for (var i = 0; i < this.validators.length;i++) {
        var  validator = this.validators[i];
        if (this.hasOwnProperty(validator.field) && typeof validator.validator == 'function') {
            validator.validator(validator.field, this[validator.field]);
        }
    }

    var valid = true;
    for (var i in this.errors) {
        if (!this.errors[i].length == 0) {
            valid = false;
        }
    }

    return valid;
}
/**
 * loads the allready existing own properties of the object
 * from form fields if there are fields in the form with the 
 * same name as the object property
 * @param {HmlForm} form
 * @returns {undefined}
 */
Model.prototype.loadFromForm = function (form) {
    for (var field in this) {
        if (this.hasOwnProperty(field)) {
            var fields = form.querySelectorAll('[name=' + field + ']');
            if (fields.length > 1 && (fields[0].type == 'checkbox' ||fields[0].type == 'radio')) {
                var isArray = typeof this[field] == 'object';
                this[field] = isArray ? [] : null;
                for (var i = 0; i < fields.length; i++) {
                    if (fields[i].checked) {
                        if (isArray) {
                            this[field].push(fields[i].value);
                        } else {
                            this[field] = fields[i].value;
                            break;
                        }
                    }
                }
            } else if (fields.length == 1) {
                this[field] = fields[0].value;
            }
        }
    }
}
/**
 * loads the allready existing own properties of the object
 * to form fields if there are fields in the form with the 
 * same name as the object property
 *  
 * @param {HtmlForm} form
 * @returns {undefined}
 */
Model.prototype.applyToForm = function (form) {
    for (var field in this) {
        if (!this.hasOwnProperty(field)) {
            continue;
        }

        var formFields = form.querySelectorAll('[name=' + field + ']');
        if (formFields.length == 1) {
            formFields[0].value = this[field];

        } else if (formFields.length > 1) {
            var isArray = typeof this[field] == 'object';
            for (var i = 0; i < formFields.length;i++) {
                formFields[i].checked = this[field].indexOf(formFields[i].value) > -1;
            }
        }
    }
}
/**
 * adds error messages to error containers for each field which has errors
 * error container HTML must be placed right after the input and the must ve but in 
 * separate parent element like this
 * <container>
 *  <label></label>
 *  <input></inpunt>
 *  <error_container></error_container>
 * </container> 
 * @param {HtmlForm} form
 * @returns {undefined}
 */
Model.prototype.applyErrorsToForm = function (form) {
    for (var field in this) {
        if (!this.hasOwnProperty(field)) {
            continue;
        }

        if (this.errors[field] && this.errors[field].length) {
            var error = this.errors[field].join('<br>');
            var fields = form.querySelectorAll('[name=' + field + ']');
            if (fields.length > 1) {
                var parent = fields[0].parentNode;
                var errorContainer = parent.nextSibling;
                errorContainer.innerHTML = this.errors[field].join('<br>');
            }
        }
    }
};
/**
 * Used as a factory for creation of the objects from JSON
 * @param {type} fields
 * @param {type} klass
 * @returns {undefined}
 */
Model.prototype.modelFactory = function (fields, klass) {
    fields = typeof fields == 'object' ? fields : {};
    klass = typeof klass == 'function' ? klass : Model;
    var object = new klass();
    for (var field in fields) {
        // set only own data properties of the object to avoid rewriting
        // a method or a prototype property
        if (object.hasOwnProperty(field) && typeof object[field] !== 'function') {
            object[field] = fields[field];
        }
    }
};