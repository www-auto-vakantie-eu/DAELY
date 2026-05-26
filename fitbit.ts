import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.FITBIT_CLIENT_ID!;
const clientSecret = process.env.FITBIT_CLIENT_SECRET!;
const redirectUri = process.env.FITBIT_REDIRECT_URI!;

// 1. Genereer de autorisatie-URL voor de gebruiker
export function getFitbitAuthUrl() {
  const scope = 'activity heartrate sleep';
  return `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
}

// 2. Wissel de authorization code om voor een access token
export async function getFitbitAccessToken(code: string) {
  const tokenUrl = 'https://api.fitbit.com/oauth2/token';
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code,
  });

  const response = await axios.post(tokenUrl, params, {
    headers: {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
}

// 3. Haal stappen-data op
export async function getFitbitSteps(accessToken: string, date = 'today') {
  const url = `https://api.fitbit.com/1/user/-/activities/steps/date/${date}/1d.json`;
  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
