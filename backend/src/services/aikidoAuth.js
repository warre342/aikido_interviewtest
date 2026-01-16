import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const AIKIDO_TOKEN_URL = 'https://app.aikido.dev/api/oauth/token';

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

// Base64 encoded for Basic Auth
const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Store token in memory for reuse
let accessToken = null;

/**
 * Client Credentials token (server-to-server)
 */
async function getClientCredentialsToken() {
    if (accessToken) return accessToken;

    const response = await axios.post(
        AIKIDO_TOKEN_URL,
        'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${basicAuth}`,
            },
        }
    );

    accessToken = response.data.access_token;
    return accessToken;
}

/**
 * Refresh token
 * @param {string} refreshToken - refresh token from previous authorization
 */
async function refreshToken(refreshToken) {
    const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    });

    const response = await axios.post(AIKIDO_TOKEN_URL, params.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`,
        },
    });

    accessToken = response.data.access_token;
    return accessToken;
}

/**
 * Axios instance for future API requests
 * Automatically attaches Bearer token
 */
export async function aikidoApi() {
    console.log("aikidoApi function called")
    const token = await getClientCredentialsToken(); // default to client credentials
    const instance = axios.create({
        baseURL: 'https://app.aikido.dev/api/',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return instance;
}
