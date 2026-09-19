import { APIRequestContext } from '@playwright/test';

const defaultOrangeHrmBaseUrl = 'https://opensource-demo.orangehrmlive.com';

export async function getOrangeHrmSessionToken(
  apiRequest: APIRequestContext,
  username: string,
  password: string,
  baseUrl = process.env.ORANGEHRM_BASE_URL || defaultOrangeHrmBaseUrl,
): Promise<string | null> {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const res = await apiRequest.post(`${normalizedBaseUrl}/web/index.php/api/v2/auth/login`, {
    data: {
      username,
      password,
    },
  });

  if (!res.ok()) {
    return null;
  }

  const body = await res.json();
  return body.data?.token ?? null;
}
