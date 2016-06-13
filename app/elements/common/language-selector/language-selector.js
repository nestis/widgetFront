(() => {
    'use strict';
    class LanguageSelector extends HTMLElement {
        static get LOCALSTORAGE_KEY() {
            return 'VASSPolymerPet.Lang';
        }

        beforeRegister() {
            this.is = 'language-selector';
            this.properties = {
                language: {
                    notify: true
                }
            }
        }
        get behaviors() {
            return [Polymer.AppLocalizeBehavior];
        }

        ready() {
            if (this.language === 'es') {
                this.$.switch.checked = true;
            }
        }
        _toggle() {
            // Change the language. Since language is inherited from index.html and configured as two-way binding,
            // all the application will know the new language to use.
            // It could also be done by changing app.language directly, but this way we are using Polymer bindings. 
            this.language = this.$.switch.checked ? 'es' : 'en';
            // More direct approach -> app.language = this.$.switch.checked ? 'es' : 'en';
            localStorage.setItem(LanguageSelector.LOCALSTORAGE_KEY, this.language);
        }
    }
    Polymer(LanguageSelector);
})();