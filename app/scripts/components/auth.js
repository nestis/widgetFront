// Auth Service Definition
'use strict';
class AuthService {
    constructor(AjaxService) {
        this._AjaxService = AjaxService;
        this.identity = null;
        this.authenticated = false;
        this.getIdentity();
    }

    getIdentity() {
        this.promise = new Promise((resolve, reject) => {
            if (this.identity === null) {
                this._AjaxService.doRequest({url:'http://jhipsterback.cfapps.io/api/account', method: 'GET'}).then((res) => {
                    this.identity = JSON.parse(res);
                    this.authenticated = true;
                    resolve(this.identity);
                }, (err) => {
                    reject();
                });
            } else {
                resolve(this.identity);
            }
         });
         return this.promise;
    }

    isAuthenticated() {
        let promise = new Promise((resolve, reject) => {
            // If there is no identity yet, obtain it
            if (this.identity === null) {
                // There are only two cases, a successful request, then the user is authenticated,
                // and a failed request, the user is not authenticated
                this.getIdentity().then((res)=> {
                    resolve(this.authenticated);
                }, (err) => {
                    resolve(false)
                });
            } else {
                resolve(this.authenticated);
            }
        });
        return promise;
    }

    getAuthorities() {
        let promise = new Promise((resolve, reject) => {
            if (this.identity === null) {
                this.getIdentity().then((res)=> {
                    resolve(this.identity.authorities);
                });
            } else {
                resolve(this.identity.authorities);
            }
        });
        return promise;
    }
    
    doLogin(username, password, rememberMe) {
        let AuthPromise = new Promise((resolve, reject) => {
            rememberMe = rememberMe || false;
            let data = {
                username, password, rememberMe
            };

            this._AjaxService.doRequest({ url: 'http://jhipsterback.cfapps.io/api/authenticate', method: 'POST', data }).then((res) => {
                console.log('Login successful');
                let jwt = JSON.parse(res);
                if(rememberMe){
                    localStorage.setItem('authenticationToken', jwt.id_token);
                } else {
                    sessionStorage.setItem('authenticationToken', jwt.id_token);
                }

                // Obtains the user identity
                if (this.getIdentity() !== null) {
                    resolve();
                } else {
                    reject();
                }
            }, (err) => {
                console.log('Login error');
                reject();
            });
        });
        return AuthPromise;
    }

    doLogout() {
        localStorage.removeItem('authenticationToken');
        sessionStorage.removeItem('authenticationToken');
        this._AjaxService.doRequest({url: 'http://jhipsterback.cfapps.io/api/logout', method:'GET'});
    }
}