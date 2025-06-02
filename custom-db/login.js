// noinspection DuplicatedCode

async function login(identifierValue, password, context, callback) {

    // noinspection JSUnresolvedReference
    const identifierType = context.identifierType || 'email';

    console.log(`login custom-db ${identifierType}: ${identifierValue}, password: ${password}, context: ${JSON.stringify(context)}`);

    const API_TOKEN = configuration.API_TOKEN;
    const API_URL = `${configuration.API_BASE_URL}/login`;

    console.log(`login URL: ${API_URL}, token: ${API_TOKEN}`);

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

    console.log('User data found successfully. worker response:', response.data);
    const {user_id} = response.data;

    const profile = {[identifierType]: identifierValue, user_id: `${user_id}`};

    console.log(`login found user with ID: ${user_id}, identifierType: ${identifierType}, profile: ${JSON.stringify(profile)}`);

    if (!user_id) {
        return callback(null);
    }

    return callback(null, profile);

}
