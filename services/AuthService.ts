import axios from 'axios';
import { AuthConfig, OAuthResponse } from '../types/auth.types';
import { authConfig } from '../utils/authConfig';

export class AuthService {
  private static instance: AuthService;
  private currentEnv: string;
  private config: AuthConfig;
  private tokenData?: OAuthResponse;

  private constructor(env: string = 'dev') {
    this.currentEnv = env;
    this.config = authConfig[env];
  }

  static getInstance(env?: string): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(env);
    }
    return AuthService.instance;
  }

  async authenticate(username: string, password: string): Promise<OAuthResponse> {
    try {
      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        username: username,
        password: password
      });

      const response = await axios.post<OAuthResponse>(
        `${this.config.loginUrl}/services/oauth2/token`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.tokenData = response.data;
      return response.data;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with Salesforce');
    }
  }

  async loginAs(targetUsername: string): Promise<OAuthResponse> {
    if (!this.tokenData) {
      throw new Error('No active session. Please authenticate first.');
    }

    try {
      const response = await axios.post<OAuthResponse>(
        `${this.tokenData.instance_url}/services/oauth2/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.tokenData.refresh_token,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          target_username: targetUsername
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${this.tokenData.access_token}`
          }
        }
      );

      this.tokenData = response.data;
      return response.data;
    } catch (error) {
      console.error('Login As failed:', error);
      throw new Error('Failed to perform Login As operation');
    }
  }

  getAccessToken(): string {
    if (!this.tokenData) {
      throw new Error('No active session. Please authenticate first.');
    }
    return this.tokenData.access_token;
  }

  getInstanceUrl(): string {
    if (!this.tokenData) {
      throw new Error('No active session. Please authenticate first.');
    }
    return this.tokenData.instance_url;
  }
} 