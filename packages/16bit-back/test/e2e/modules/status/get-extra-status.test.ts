import { AxiosError, AxiosRequestConfig } from 'axios';

import { ApiClient } from '@test/e2e/common/ApiClient';
import { RestErrorResponse } from '@app/api/rest/interfaces';
import { ServerExtraStatusResp } from '@app/api/rest/controllers/status/endpoints/getExtraStatus';
import { config } from '@app/config';

const testingURL = '/api/status/extra';

describe(`GET ${testingURL}`, () => {
  const apiClient = ApiClient.new();

  test('when not using secretKey, expect 401 status', async () => {
    try {
      await apiClient.get<ServerExtraStatusResp>(testingURL);
      throw new Error('this should not be reached');
    } catch (error) {
      const axiosError = error as AxiosError<RestErrorResponse>;
      if (!axiosError.response) throw new Error('axios response not found');
      expect(axiosError.response.status).toEqual(401);
    }
  });

  test('when using bad secretKey, expect 401 status', async () => {
    const reqConfig: AxiosRequestConfig = {
      headers: {
        Authorization: 'Secret badSecretKey',
      },
    };
    try {
      await apiClient.get<ServerExtraStatusResp>(testingURL, reqConfig);
      throw new Error('this should not be reached');
    } catch (error) {
      const axiosError = error as AxiosError<RestErrorResponse>;
      if (!axiosError.response) throw new Error('axios response not found');
      expect(axiosError.response.status).toEqual(401);
    }
  });

  test('when rest server is up, expect 200 status', async () => {
    const reqConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Secret ${config.auth.secretKey}`,
      },
    };
    const resp = await apiClient.get<ServerExtraStatusResp>(testingURL, reqConfig);
    expect(resp.status).toEqual(200);
    expect(resp.data.timestampMs).toBeGreaterThan(0);
  });

  test('when calling an non-existent endpoint, expect 404 status', async () => {
    try {
      await apiClient.get('/non-existent');
      throw new Error('this should not be reached');
    } catch (error) {
      const axiosError = error as AxiosError<RestErrorResponse>;
      if (!axiosError.response) throw new Error('axios response not found');
      expect(axiosError.response.status).toEqual(404);
    }
  });
});
