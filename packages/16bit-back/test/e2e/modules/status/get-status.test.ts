import { AxiosError } from 'axios';

import { ApiClient } from '@test/e2e/common/ApiClient';
import { ServerStatusResp } from '@app/api/rest/controllers/status/endpoints/getStatus';
import { RestErrorResponse } from '@app/api/rest/interfaces';

const testingURL = '/api/status';

describe(`GET ${testingURL}`, () => {
  const apiClient = ApiClient.new();

  test('when rest server is up, expect 200 status', async () => {
    const resp = await apiClient.get<ServerStatusResp>(testingURL);
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
