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
            let str = '';
            const keys = Object.keys(value);
            keys.forEach( key => {
                if(Array.isArray(value[key])){
                    let tmpStr = ''
                    value[key].forEach( (val, i, arr) => {
                        tmpStr += `${key}: ${val} ${arr.length - 1 > i? 'OR' : ''}`
                    })
                    str += tmpStr.length? `(${tmpStr})` : '';
                }
                else{
                    str += `(${key}: ${value[key]}) AND `;
                }
            })
            return `(${str.substring(0, str.lastIndexOf(' AND '))})`;
        }
        default:
            return '';
    }
};


module.exports = {
    KEYWORDS,
    generateSearchQuery,
};
