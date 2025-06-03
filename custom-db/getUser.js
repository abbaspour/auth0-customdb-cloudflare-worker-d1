// noinspection DuplicatedCode,JSUnusedGlobalSymbols

async function getUser(identifierValue, context, callback) {
    // noinspection JSUnresolvedReference
    const identifierType = context.identifierType || 'email';

    console.log(`invoked getUser ${identifierType}: ${identifierValue}, context: ${JSON.stringify(context)}`);

    const API_TOKEN = configuration.API_TOKEN;
    const API_URL = `${configuration.API_BASE_URL}/find/${identifierType}`;

    //console.log(`getUser URL: ${API_URL}, token: ${API_TOKEN}`);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept-Encoding': 'gzip, deflate, compress'
    };

    const axios = require('axios');

    let response;
    try {
        response = await axios.get(`${API_URL}/${identifierValue}`, {headers});
    } catch (error) {
        console.log(`error axios get, ${JSON.stringify(error)}`);
        if (error.response) { // server responded with a status code out of the range of 2xx
            return callback(null);
        } else { // Something happened in setting up the request that triggered an Error
            return callback(error);
        }
    }

    if (response.status !== 200 || !response.data) {
        console.log(`getUser result empty. no user found ${identifierType}: ${identifierValue}`)
        return callback(null);
    }

    const profile = response.data;

    if (!profile.user_id) {
        console.log(`no user found ${identifierType}: ${identifierValue}`);
        return callback(null);
    }

    console.log(`found user ${identifierType}: ${identifierValue}, profile: ${JSON.stringify(profile)}`);

    return callback(null, profile);
}