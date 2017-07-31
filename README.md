#Testing of Micro-services Using Pact for Consumer Driven Contract Testing in Node.js

A simple example based on a GET to /name/Estonia to return basic country information

## Installation
Clone repo, run

```
npm install
```

## To use
In order to run the consumer tests and generate the pact file:

```
mocha app/consumer/spec/CountryServiceConsumer.spec.js
```

NB: currently the above command will also publish changes to the pact file created in the previous run to the 
pact-broker, and always publish the pact if it exists on each run since the Publish code is there by way of an example

A temporary (example/demo) Pact broker is available (and in use in the example) at http://ec2-54-89-227-183.compute-1.amazonaws.com

And to run provider-side tests to verify provider conforms to contract:

```
node app/provider/spec/CountryServiceProvider.spec.js
```