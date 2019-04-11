module.exports = {
    port: 10846,
    api: {
        url: process.env.SENTINELAPIURL ||  'https://scihub.copernicus.eu/apihub',
        Auth: `Basic ${Buffer.from(`${process.env.SENTINELAPIUSER || 'guest'}:${process.env.SENTINELAPIPASS || 'guest'}`).toString('base64')}`,
        user: process.env.SENTINELAPIUSER,
        pass: process.env.SENTINELAPIPASS,
        max_page: 100,
    },
    sentinelhub: {
        url: process.env.SENTINELAPIWMS	 + process.env.SENTINELAPITOKEN
    }
};
