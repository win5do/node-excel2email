let xlsx = require('node-xlsx').default;

class excel {
    constructor (file) {
        this.name = file.originalname;
        this.data = xlsx.parse(file.buffer)[0].data;
    }
}

module.exports = excel;