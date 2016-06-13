// Login Form Polymer Script
(() => {
    'use strict';
    // Creates the component as an ES6 class
    class LoginForm extends HTMLElement {
        static get LOCALSTORAGE_KEY() {
            return 'VASSPolymerPet.Lang';
        }

        // Constructor
        beforeRegister() {
            // is's value has to be the id used in dom-module.
            this.is = 'login-form';
            this.properties = {
                username: {
                    type: String
                },
                password: {
                    type: String
                },
                // Try to obtain the language from localStorage, if not found english will be the default
                language: {
                    value: localStorage.getItem(LoginForm.LOCALSTORAGE_KEY) || 'en'
                }
            }
        }
        
        // Defines the i18n behavior... https://elements.polymer-project.org/elements/app-localize-behavior
        get behaviors() {
            return [Polymer.AppLocalizeBehavior];
        }
        
        // Polymer Events
        ready() {
            this._AuthService = VASSPolymer.Services._AuthService;
            if (this.language === 'es') {
                this.$.switch.checked = true;
            }
        }
        attached() {
            this.loadResources(this.resolveUrl('i18n/login-form.json'));
        }
        
        // Member functions
        _doLogin() {
            // Call to AuthService
            let promise = this._AuthService.doLogin(this.username, this.password, this.rememberMe);
            promise.then((res) => {
                // If we are on the JHipster app, try to get angular $rootScope
                if (window.angular !== undefined) {
                    $('body[ng-app]').scope().$broadcast('authenticationSuccess');
                // Otherwise, redirect to /
                } else {
                    window.location.href = '/';
                }
            }, (err) => {
                this.$.modalDialog.open();
            });
        }
        _rememberMe() {
            this.rememberMe = document.getElementById('rememberMe').checked;
        }
        _toggle() {
            this.language = this.$.switch.checked ? 'es' : 'en';
            localStorage.setItem(LoginForm.LOCALSTORAGE_KEY, this.language);
        }
    }
    // Register the component
    Polymer(LoginForm);
})();