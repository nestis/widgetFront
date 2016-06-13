'use strict';

// Function that creates a custom XMLHttpRequest Object
var createXHRObject = (resolve, reject) => {
    var client = new XMLHttpRequest();
    client.onload = (event) => {
        let res = event.target;
        if (res.status == 200) {
            resolve(res.response);
        } else {
            reject(res.statusText);
        }
    };
    client.onerror = (event) => {
        let res = event.target;
        reject(res.target.statusText);
    };
    return client;
}

// Ajax Service Definition
class AjaxService {
    constructor() {
        this.authToken = null;
        if (localStorage.authenticationToken) {
            this.authToken = localStorage.authenticationToken;
        } else if (sessionStorage.authenticationToken) {
            this.authToken = sessionStorage.authenticationToken;
        }
    }
    
    doRequest(obj) {
        let url = obj.url;
        let method = obj.method;
        let data = obj.data;
        let request = new Promise((resolve, reject) => {
            let client = createXHRObject(resolve, reject);
            client.open(method, url);
            if(this.authToken !== null) {
                client.setRequestHeader('Authorization', 'Bearer ' + this.authToken);
            }
            client.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            client.send(JSON.stringify(data));
        });
        return request;
    }
}