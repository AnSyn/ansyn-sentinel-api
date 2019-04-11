'use strict';
const express = require('express');
const cors = require('cors');
const request = require('request');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const { stringify, parse } = require('wellknown');
const { api, port,sentinelhub } = require('./config/config');
const { generateSearchQuery, KEYWORDS } = require('./searchQuery');
const parseString = require('xml2js').parseString;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello Sentinel');
});

app.route('/api/search')
    .get((req, res) => {
        const id = req.query.id;
        rp.get({
            uri: `${api.url}/odata/v1/Products('${id}')/?$expand=Attributes&$format=json`,
            json: true,
            headers: {
                'Authorization': api.Auth
            }
        }).then(data => {
            res.json({ results: genreateProduct(data) });
        });
    })
    .post((req, res) => {
        req.connection.setTimeout(10 * 60 * 1000);
        const { region, start, end, plate } = req.body;
        const q1 = stringify(region);
        const q2 = [start, end];
        const q3 = { 'platformname': plate };
        const url = `${api.url}/search?rows=${api.max_page}&q=${generateSearchQuery(KEYWORDS.FOOTPRINT, q1)} AND ${generateSearchQuery(KEYWORDS.DATE, q2)} AND ${generateSearchQuery(KEYWORDS.PRODUCT, q3)}`;
        rp.get({
            uri: url,
            headers: {
                'Authorization': api.Auth
            }
        }).then((xml) => {
            parseString(xml, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    const geojson = { type: 'FeatureCollection', features: [] };
                    result.feed.entry.forEach((overlay, i) => {
                        geojson.features.push(createGeoJsonOverlay(overlay, i));
                    });
                    res.json(geojson);
                }
            });
        }).catch((err) => {
            res.status(err.statusCode).json({ error: err.message });
        });
    });


app.get('/api/thumbnail/:id', (req, res) => {
    const id = req.params.id;
    request.get(`http://scihub.copernicus.eu/dhus/odata/v1/Products('${id}')/Products('Quicklook')/$value`, {
        'auth': {
            'user': api.user,
            'pass': api.pass,
            'sendImmediately': false
        }
    }).pipe(res);
});

app.get('/api/wms', (req, res) => {
    const params = req.query;
    let url = `${sentinelhub.url}?`;
    Object.entries(params).forEach( param => {
        url += `${param[0]}=${param[1]}&`;
    });
    request.get(url).pipe(res);
});

app.listen(port, () => console.log('cool ' + api.user + ' ' + api.pass));

function createGeoJsonOverlay(overlay, i) {
    correctOverlay(overlay);
    const GJoverlay = { id: i, type: 'Feature' };
    GJoverlay.geometry = parse(overlay.data.footprint);
    GJoverlay.properties = overlay.data;
    return GJoverlay;
}

function correctOverlay(o) {
    o.data = {};
    const arr2obj = (a) => o.data[a.$.name] = a._;
    o.date.forEach(arr2obj);
    o.int.forEach(arr2obj);
    o.double.forEach(arr2obj);
    o.str.forEach(arr2obj);
    o.link.forEach(link => o.data[`link${link.$.rel ? `_${link.$.rel}` : ''}`] = link.$.href);
    o.data.id = o.id[0];
    o.data.summary = o.summary[0];
    o.data.title = o.title[0];
}


function genreateProduct({ d: data }) {
    const product = {
        properties: {
            id: data.Id,
            title: data.Name,
        }
    };
    data.Attributes.results.forEach(attr => {
        const name = attr.Name.toLowerCase().replace(/[ ]/g, '');
        let val = +attr.Value;
        val = isNaN(val) ? attr.Value : val;
        product.properties[name] = val;
    });

    product.geometry = parse(product.properties.jtsfootprint);
    return product;
}
