(() => {
    'use strict';
    class MenuDrawer extends HTMLElement {
        beforeRegister() {
            this.is = 'menu-drawer';
            this.properties = {
                isAdmin: {
                type: Boolean,
                value: true
                }
            }
        }

        // Implements AppLocalizeBehaviour. https://elements.polymer-project.org/elements/app-localize-behavior
        // We don't need to create a language variable because we already have it.
        // <menu-drawer language=[[language]]> 
        get behaviors() {
            return [Polymer.AppLocalizeBehavior];
        }
        ready() {
            VASSPolymer.Services._AuthService.getAuthorities().then((res) => {
                this.set('isAdmin', res.indexOf('ROLE_ADMIN') > 0);
            });
        }
        attached() {
            this.loadResources(this.resolveUrl('i18n/menu-drawer.json'));
        }
    }
    Polymer(MenuDrawer);
    })();