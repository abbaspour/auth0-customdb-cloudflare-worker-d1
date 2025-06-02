// noinspection SqlDialectInspection,SqlNoDataSourceInspection

import {Context, Hono} from 'hono';
import {bearerAuth} from 'hono/bearer-auth';
import {D1Result} from "@cloudflare/workers-types";

export interface Env {
    DB: D1Database;
    API_TOKEN: string;
}

const app = new Hono<{ Bindings: Env }>();

/**
 * Represents a user created event from Auth0
 */
interface User {
    user_id: string;
    email?: string;
    created_at?: string;
}

app.use('/*', async (c, next) => {
    const auth = bearerAuth({
        token: c.env.API_TOKEN,
    });
    return auth(c, next);
});

// Handle POST requests to the /create endpoint
app.post('/create', async (c) => {
    try {
        // Parse the JSON body from the request
        const eventData = await c.req.json();

        // Log the received webhook data
        console.log('Received Auth0 custom-db create webhook:', JSON.stringify(eventData, null, 2));

        const identifierType = 'email'; // TODO: dynamic

        const {[identifierType]: identifierValue} = eventData;

        const user_id = await handleUserCreated(identifierType, identifierValue, c);

        return c.json({user_id: `${user_id}`}, 201);
    } catch (error) {
        console.error('Error processing webhook:', error);
        return c.json({error: 'Invalid JSON payload'}, 400);
    }
});

app.get('/find/:identifierType/:identifierValue', async (c) => {
    const {identifierType, identifierValue} = c.req.param();

    console.log(`Received Auth0 custom-db find by identifier ${identifierType}: ${identifierValue}`);

    const user = await findByIdentifier(identifierType, identifierValue, c);
    return c.json(user || {}, 200);
});

// Handle all other routes with a 404
app.notFound((c: { text: (arg0: string, arg1: number) => any }) => c.text('Not Found', 404));

// Export default fetch handler for the worker
// noinspection JSUnusedGlobalSymbols
export default {
    fetch: app.fetch,
};

/*
async function handleUserDeleted(user: User, c: Context) {
    const {user_id} = user;

    try {
        // Use D1 database binding to execute the query with REPLACE INTO for upsert
        await c.env.DB.prepare(
            `
            DELETE
            FROM users
            where user_id = $1`,
        )
            .bind(user_id)
            .run();
    } catch (err: any) {
        console.error(`Database error while deleting user_id=${user_id}:`, err);
        throw err;
    }
}
*/

async function handleUserCreated(identifierType: string, identifierValue: string, c: Context): Promise<number> {
    try {
        // Use D1 database binding to execute the query with REPLACE INTO for upsert
        // language=SQL format=false
        const result: D1Result = await c.env.DB.prepare(`INSERT INTO users(${identifierType}) VALUES (?)`)
            .bind(identifierValue)
            .run();

        const user_id = result.meta.last_row_id;

        console.log(`User ${identifierType}/${identifierValue} successfully inserted into database with user_id: ${user_id}`);

        return user_id;
    } catch (err: any) {
        console.error(`Database error while inserting user ${identifierType}/${identifierValue}`, err);
        throw err;
    }
}


async function findByIdentifier(identifierType: string, identifierValue: string, c: Context): Promise<User> {
    try {
        // Use D1 database binding to execute the query with REPLACE INTO for upsert
        // language=SQL format=false
        const result: User = await c.env.DB.prepare(`SELECT * FROM users WHERE ${identifierType} = ? LIMIT 1`)
            .bind(identifierValue)
            .first();

        console.log(`result of search for ${identifierType} with value ${identifierValue}: ${JSON.stringify(result)}`);

        return result;
    } catch (err: any) {
        console.error(`Database error while finding for ${identifierType} with value ${identifierValue}:`, err);
        throw err;
    }
}
