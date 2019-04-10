'use strict'
const KEYWORDS = {
    DATE: 'ingestiondate',
    PRODUCT: 'product',
    FOOTPRINT: 'footprint'
}

const generateSearchQuery = (keyword, value) => {
    switch (keyword) {
        case KEYWORDS.DATE: {
            const start = value[0] || 'NOW-30DAYS';
            const end = value[1] || 'NOW'
            return `ingestiondate:[${start} TO ${end}]`;
        }
        case KEYWORDS.FOOTPRINT: {
            return `footprint:"Intersects(${value})"`;
        }
        case KEYWORDS.PRODUCT: {
            const kv = Object.entries(value);
            let str = ''
            kv.forEach( p => {
                str += `${p[0]}:${p[1]} AND`;
            });
            return `(${str.substring(0, str.lastIndexOf(' AND'))})`;
        }
        default:
            return '';
    }
};


module.exports = {
    KEYWORDS,
    generateSearchQuery,
};