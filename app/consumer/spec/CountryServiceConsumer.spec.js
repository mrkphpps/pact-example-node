const path = require('path');
const chai = require('chai');
const Pact = require('pact');
const chaiAsPromised = require('chai-as-promised');
const pactWrapper = require('@pact-foundation/pact-node');
const CountryServiceConsumer = require('../CountryServiceConsumer');
const Country = require('../Country');

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
            provider = Pact({consumer: 'My Consumer', provider: 'Country Provider', port: 1234});

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