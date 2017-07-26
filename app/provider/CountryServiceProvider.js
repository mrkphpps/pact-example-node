const CountryRepo = require('./CountryRepo');
const Country = require('./Country');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const countryRepo = new CountryRepo();

app.use(bodyParser.json());

app.get('/name/:name', function (req, res) {
    const response = {
        country: countryRepo.getByName(req.params.name)
    };

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(response));
});

app.get('/states', function (req, res) {
    const response = {
        'My Consumer': ['Has Estonia information']
    };

    res.end(JSON.stringify(response));
});

app.post('/setup', function (req, res) {
    const state = req.body.state;

    countryRepo.clear();
    switch (state) {
        case 'Has Estonia information': {
            countryRepo.insert(new Country('Estonia', 'Tallin', 1315944));
            break;
        }
    }

    res.end();
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});