(() => {
    'use strict'
    class MainContent extends HTMLElement {
        beforeRegister() {
            this.is = 'main-content'
            this.properties = {
                isAdmin : {
                    type: Boolean,
                    value: false
                }
            }
        }
        get behaviors() {
            return [Polymer.AppLocalizeBehavior]
        }
        attached() {
            this.loadResources(this.resolveUrl('i18n/main-content.json'));
            VASSPolymer.Services._AuthService.getAuthorities().then((res) => {
                if (res.indexOf('ROLE_ADMIN')>0) {
                    this.isAdmin = true;
                } else {
                    this.isAdmin = false;
                }
            });
        }

        scrollPageToTop() {
            this.$.headerPanelMain.scrollToTop(true);
        }
        closeDrawer() {
            this.$.paperDrawerPanel.closeDrawer();
        }
        isAdmin() {
        }
    }
    Polymer(MainContent);
})();