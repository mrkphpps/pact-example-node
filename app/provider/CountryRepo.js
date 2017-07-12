class CountryRepo {

    constructor() {
        this.country = [];
    }

    getByName(name) {
        return this.country.find((country) => name == country.name);
    }

    insert(country) {
        this.country.push(country);
    }

    clear() {
        this.country = [];
    }
}

module.exports = CountryRepo;
