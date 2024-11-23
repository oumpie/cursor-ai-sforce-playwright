export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  loginUrl: string;
}

export interface OAuthResponse {
  access_token: string;
  instance_url: string;
  refresh_token: string;
  token_type: string;
} 