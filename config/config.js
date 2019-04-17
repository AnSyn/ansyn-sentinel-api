module.exports = {
    port: 10846,
    api: {
        url: process.env.ANSYN_SENTINELAPIURL || 'https://scihub.copernicus.eu/apihub',
        Auth: `Basic ${Buffer.from(`${process.env.ANSYN_SENTINELAPIUSER || 'guest'}:${process.env.ANSYN_SENTINELAPIPASS || 'guest'}`).toString('base64')}`,
        user: process.env.ANSYN_SENTINELAPIUSER,
        pass: process.env.ANSYN_SENTINELAPIPASS,
        max_page: 100,
    },
    sentinelhub: {
        url: process.env.ANSYN_SENTINELAPIWMS	 + process.env.ANSYN_SENTINELAPITOKEN
    }
};
