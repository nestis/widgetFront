 (() => {
    'use strict';
    class HeaderDrawer extends HTMLElement {
        beforeRegister() {
            this.is = 'header-drawer';
            // Define the notify flag to language variable obtained from the parent. This
            // way the two-way binding is properly configured.
            // https://www.polymer-project.org/1.0/docs/devguide/data-binding#property-notification
            this.properties = {
                language: {
                    notify: true
                }
            }
        }
        get behaviors() {
            return [Polymer.AppLocalizeBehavior]
        }
        ready() {
            VASSPolymer.Services._AuthService.getIdentity().then((res) => {
                this.account = res;
            });
        }
        attached() {
            this.loadResources(this.resolveUrl('i18n/header-drawer.json'));
        }

        _doLogout() {
            VASSPolymer.Services._AuthService.doLogout();
            window.location.href = 'login.html';
        }
    }
    Polymer(HeaderDrawer);
})();