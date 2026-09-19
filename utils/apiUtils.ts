import { APIRequestContext } from '@playwright/test';

export async function getOrangeHrmSessionToken(apiRequest: APIRequestContext, username: string, password: string): Promise<string | null> {
  const res = await apiRequest.post('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/auth/login', {
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
