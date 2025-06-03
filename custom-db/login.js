// noinspection DuplicatedCode,JSUnusedGlobalSymbols
async function login(identifierValue, password, context, callback) {

    // noinspection JSUnresolvedReference
    const identifierType = context.identifierType || 'email';

    console.log(`login custom-db ${identifierType}: ${identifierValue}, password: ${password}, context: ${JSON.stringify(context)}`);

    const API_TOKEN = configuration.API_TOKEN;
    const API_URL = `${configuration.API_BASE_URL}/login`;

    //console.log(`login URL: ${API_URL}, token: ${API_TOKEN}`);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept-Encoding': 'gzip, deflate, compress'
    };

    const data = {
        password,
        [identifierType]: identifierValue
    }

    const axios = require('axios');

    let response;
    try {
        response = await axios.post(API_URL, data, {headers});
    } catch (error) {
        console.log(`error axios POST in login, ${JSON.stringify(error)}`);
        if (error.response) { // server responded with a status code out of the range of 2xx
            return callback(null);
        } else { // Something happened in setting up the request that triggered an Error
            return callback(error);
        }
    }

    if (response.status !== 200 || !response.data) {
        return callback(null);
    }

    console.log('login worker response:', response.data);
    const profile = response.data;

    if (!profile.user_id) {
        console.log(`login failed. no user_id for ${identifierType}: ${identifierType} with password: ${password}`);
        return callback(null);
    }

    console.log(`login found user with ${identifierType}: ${identifierType}, profile: ${JSON.stringify(profile)}`);

    return callback(null, profile);

}
