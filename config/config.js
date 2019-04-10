module.exports = {
    port: 10846,
    dhus: {
        url: process.env.SENTINELAPIURL || 'https://scihub.copernicus.eu/dhus/',
        Auth: `Basic ${Buffer.from(`${process.env.SENTINELAPIUSER || 'guest'}:${process.env.SENTINELAPIPASS || 'guest'}`).toString('base64')}`,
        user: process.env.SENTINELAPIUSER,
        pass: process.env.SENTINELAPIPASS,
        max_page: 100,
    },
    sentinelhub: {
        url: process.env.SENTINELAPIWMS	 + process.env.SENTINELAPITOKEN
    }
};