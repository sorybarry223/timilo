import axios from 'axios';

export async function getAccessToken(tokenUrl: string, basicToken: string): Promise<string> {
  const body = new URLSearchParams({ grant_type: 'client_credentials' });

  const response = await axios.post(tokenUrl, body.toString(), {
    headers: {
      Authorization: `Basic ${basicToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.data?.access_token) {
    throw new Error('No access token found in response');
  }

  return response.data.access_token;
}
