import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { Api } from '../../_generated_/api';

class AxiosService {
  private static instance: AxiosService;
  public axios: AxiosInstance;
  public generatedAxios: Api<void>;

  private constructor() {
    // Use environment variable if available, otherwise fallback to localhost for development
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://error.no-env';
    
    const axiosConfig: CreateAxiosDefaults = {
      withCredentials: true,
      baseURL: apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl,
    };    

    this.axios = axios.create(axiosConfig);

    this.generatedAxios = new Api({
      baseURL: this.axios.defaults.baseURL,
    });

    this.generatedAxios.instance = this.axios;
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }
    return AxiosService.instance;
  }

  public setBaseURL(baseURL: string): void {
    this.axios.defaults.baseURL = baseURL;
    this.generatedAxios = new Api({
      baseURL: baseURL,
    });

    this.generatedAxios.instance = this.axios;
  }
}

export const axiosServiceInstance = AxiosService.getInstance();
export default AxiosService;