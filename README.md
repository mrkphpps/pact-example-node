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

And to run provider-side tests to verify provider conforms to contract:

```
node app/provider/spec/CountryServiceProvider.spec.js
```