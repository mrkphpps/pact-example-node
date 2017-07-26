var pact = require('@pact-foundation/pact-node');
var path = require('path');
const CountryServiceProvider = require('../CountryServiceProvider');

var opts = {
    provider: 'CountryConsumer',
    tags: [],
    providerBaseUrl: 'http://localhost:8081',
    // providerStatesUrl: 'http://localhost:8081/states',
    providerStatesSetupUrl: 'http://localhost:8081/setup',
    pactBrokerUrl: 'http://ec2-54-89-227-183.compute-1.amazonaws.com/',
    publishVerificationResult:true,
    providerVersion: '4.5.7'
    // pactUrls: [path.resolve(__dirname, '../../../pacts/countryconsumer-countriesprovider.json')]
};

pact.verifyPacts(opts).then(() => {
    console.log('success');
    //publishResults(true);

    process.exit(0);

}).catch((error) => {
    console.log('failed', error);
    // publish the failure result back to the broker
    //publishResults(false);
    process.exit(1);
});


