import { Page } from '@playwright/test';
import { AuthService } from '../services/AuthService';

export class LoginPage {
  private page: Page;
  private authService: AuthService;

  constructor(page: Page, environment: string = 'dev') {
    this.page = page;
    this.authService = AuthService.getInstance(environment);
  }

  async login(username: string, password: string) {
    const authResponse = await this.authService.authenticate(username, password);
    await this.page.goto(authResponse.instance_url);
    
    // Set the access token in localStorage
    await this.page.evaluate((token) => {
      localStorage.setItem('access_token', token);
    }, authResponse.access_token);

    // Wait for the home page to load
    await this.page.waitForSelector('span.slds-page-header__title');
  }

  async loginAsUser(targetUsername: string) {
    // Verify the user is a LookSee user before proceeding
    if (!targetUsername.includes('@looksee.com')) {
      throw new Error('Invalid LookSee user format. Email should be @looksee.com');
    }

    const authResponse = await this.authService.loginAs(targetUsername);
    await this.page.goto(authResponse.instance_url);
    
    // Set the new access token
    await this.page.evaluate((token) => {
      localStorage.setItem('access_token', token);
    }, authResponse.access_token);

    // Wait for the login as process to complete
    await this.page.waitForSelector('span.slds-page-header__title');
    
    // Verify we're logged in as the correct LookSee user
    const userNavLabel = await this.page.textContent('span.uiOutputText[title="User"]');
    if (!userNavLabel?.includes(targetUsername)) {
      throw new Error(`Failed to login as LookSee user ${targetUsername}`);
    }

    // Verify user has correct LookSee profile
    const userProfile = await this.page.textContent('span.uiOutputText[title="Profile"]');
    if (!userProfile?.includes('LookSee User')) {
      throw new Error(`User ${targetUsername} does not have the required LookSee User profile`);
    }
  }
} 