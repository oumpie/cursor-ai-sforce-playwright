import { BasePage } from '../base/BasePage';

export class LoginPage extends BasePage {
    private readonly usernameInput = '#username';
    private readonly passwordInput = '#password';
    private readonly loginButton = '#Login';

    async login(username: string, password: string) {
        await this.fillAndWait(this.usernameInput, username);
        await this.fillAndWait(this.passwordInput, password);
        await this.clickAndWait(this.loginButton);
    }
    clickAndWait(loginButton: string) {
        throw new Error('Method not implemented.');
    }
    fillAndWait(passwordInput: string, password: string) {
        throw new Error('Method not implemented.');
    }

    async loginAsUser(username: string) {
        await this.page.goto(`/impersonate?user=${username}`);
        await this.waitForLoad();
    }
    waitForLoad() {
        throw new Error('Method not implemented.');
    }
} 