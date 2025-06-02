// noinspection JSUnusedLocalSymbols
// noinspection DuplicatedCode

async function create(user, context, callback) {

    // noinspection JSUnresolvedReference
    const identifierType = context.identifierType || 'email';

    console.log(`create custom-db user: ${JSON.stringify(user)}, context: ${JSON.stringify(context)}`);

    const API_TOKEN= configuration.API_TOKEN;
    const API_URL = `${configuration.API_BASE_URL}/create`;

    console.log(`create URL: ${API_URL}, token: ${API_TOKEN}`);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
    };

    const axios = require('axios');

    let response;
    try {
        response = await axios.post(API_URL, user, { headers });
    } catch (error) {
        console.log(`error axios POST in create, ${JSON.stringify(error)}`);
        return callback(error);
    }

    if (response.status !== 201 || !response.data) {
        return callback(`Failed to store user data. Status: ${response.status}. Message: ${response.data.message || 'Unknown error.'}`);
    }

    console.log('User data stored successfully. worker response:', response.data);

    const { user_id } = response.data;


    console.log(`Stored user with ID: ${user_id}, identifierType: ${identifierType}, user[${identifierType}]: ${user[identifierType]}`);

    const profile = {'email': user.email, user_id: user_id};

    return callback(null, profile);
}

