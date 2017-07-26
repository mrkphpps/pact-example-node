const path = require('path');
const chai = require('chai');
const Pact = require('pact');
const chaiAsPromised = require('chai-as-promised');
const pactWrapper = require('@pact-foundation/pact-node');
const CountryServiceConsumer = require('../CountryServiceConsumer');
const Country = require('../Country');
const fs = require('fs');
const request = require('request');

// TODO this needs to be run only after a success...
// alternative pact publisher...
// NB: where we publish an unchanged pact we get successful publish response but the pact is NOT updated in the broker
var PactPublisher = require('node-pact-publisher');

var config = {
    // Version of your application to be published
    appVersion: '1.1.0',
    // Url of the remote pact broker
    brokerBaseUrl: 'http://ec2-54-89-227-183.compute-1.amazonaws.com',
    // Path containing JSON pact contracts (optional)
    pacts: [path.resolve(process.cwd(), 'pacts') + '/countryconsumer-countriesprovider.json'],
    tag: 'prod'
};
var myPublisher = new PactPublisher(config);
myPublisher.publish().then(function (numberOfPactsPublished) {
    console.info('Congrats! ' + numberOfPactsPublished + ' pacts were published!');
}, function (numberOfPactsPublished) {
    console.error('Not all pacts were published, but ' + numberOfPactsPublished + ' were');
});
// eof pact publisher

const expect = chai.expect;

chai.use(chaiAsPromised);

describe('Pact', () => {
    let provider;

    // Configure the mock server
    const mockServer = pactWrapper.createServer({
        port: 1234,
        log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        spec: 2
    });

    // Define expected responses
    const eestiPayload = {
        country: {
            name: "Estonia",
            capital: "Tallinn",
            population: 1315944
        }
    };

    before((done) => {
        // Start the mock server
        mockServer.start().then(() => {
            provider = Pact({consumer: 'CountryConsumer', provider: 'CountriesProvider', port: 1234});

            // add an interaction
            provider.addInteraction({
                state: 'Has Estonia information',
                uponReceiving: 'a request for Estonia info',
                withRequest: {
                    method: 'GET',
                    path: '/name/Estonia',
                    headers: {'Accept': 'application/json'}
                },
                willRespondWith: {
                    status: 200,
                    headers: {'Content-Type': 'application/json'},
                    body: eestiPayload
                }
            }).then(() => done())
        })
    });

    it('successfully receives Estonia information', (done) => {
        const countryServiceClient = new CountryServiceConsumer('http://localhost:1234');
        const verificationPromise = countryServiceClient.getCountryByName("Estonia");
        const expectedCountry = eestiPayload;
        expect(verificationPromise).to.eventually.eql(expectedCountry).notify(done);
    });

    after(() => {

    // Write pact file
        provider.finalize().then(() => {
            pactWrapper.removeAllServers()
        })
    });
});