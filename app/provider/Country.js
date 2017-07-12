class Country {
    constructor(name, capital, population) {
        this.name = name;
        this.capital = capital;
        this.population = population;
    }
    //
    // static fromJson(data) {
    //     return new Country(data.name, data.capital, data.population);
    // }

}

module.exports = Country;
