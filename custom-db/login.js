// noinspection DuplicatedCode

async function login(identifierValue, password, context, callback) {

    console.log(`login custom-db identifierValue: ${identifierValue}, password: ${password}, context: ${context}`);

    const API_TOKEN = configuration.API_TOKEN;
    const API_URL = `${configuration.API_BASE_URL}/find/email`;

    console.log(`getUser URL: ${API_URL}, token: ${API_TOKEN}`);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
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
        return callback(null);
    }

    console.log('User data found successfully. worker response:', response.data);
    const {user_id} = response.data;

    // noinspection JSUnresolvedReference
    const identifierType = context.identifierType || 'email';

    const profile = {[identifierType]: identifierValue, user_id: `${user_id}`};

    console.log(`login found user with ID: ${user_id}, identifierType: ${identifierType}, profile: ${JSON.stringify(profile)}`);

    if (!user_id) {
        return callback(null);
    }

    return callback(null, profile);

}
