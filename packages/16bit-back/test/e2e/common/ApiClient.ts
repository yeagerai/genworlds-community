import axios, { AxiosInstance } from 'axios';

export class ApiClient {
  public static new(): AxiosInstance {
    const httpClient = axios.create({
      baseURL: 'http://localhost:5000',
      timeout: 120000, // in milliseconds
    });
    return httpClient;
  }
}
