class LoginPage {

    constructor(page) {
        this.page = page;

        this.username = page.locator('#username');
        this.password = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
        this.flashMessage = page.locator('#flash');
        this.logoutLink = page.locator('a[href="/logout"]');
    }

    async goto() {
        await this.page.goto('/login');
    }

    async login(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async logout() {
        await this.logoutLink.click();
    }
}

module.exports = { LoginPage };