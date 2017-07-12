const request = require('request');
const Country = require('./Country');

class CountryServiceConsumer {

    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    getCountryByName(name) {
        return new Promise((resolve, reject) => {

            const options = {
                url: this.endpoint + '/name/' + name,
                headers: {'Accept': 'application/json'}
            };

            request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(error);
                }
            });
        });
    }
}


module.exports = CountryServiceConsumer;
