import { test, expect, type Page } from "@playwright/test";

const API = "http://localhost:3000";

const FAKE_PRODUCT = {
  id: "1",
  title: "Test Product",
  description: "A product used in E2E tests",
  base_price: 99.9,
  main_image: "test.webp",
};

async function mockBackend(page: Page) {
  await page.route(`${API}/products**`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: [FAKE_PRODUCT], rows: [FAKE_PRODUCT] }),
    }),
  );
  await page.route(`${API}/uploads**`, (route) =>
    route.fulfill({ status: 200, contentType: "image/webp", body: Buffer.from([]) }),
  );
}

test.describe("E-commerce E2E", () => {
  test("home page renders header and main content", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/");

    await expect(page.getByRole("img", { name: "Logo" }).first()).toBeVisible();
    await expect(page.getByText(FAKE_PRODUCT.title).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(`R$ ${FAKE_PRODUCT.base_price}`).first()).toBeVisible();
  });

  test("login page shows error alert on failed login", async ({ page }) => {
    await page.route(`${API}/auth/login`, (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ error: "Invalid credentials" }) }),
    );

    await page.goto("/auth/login");

    await expect(page.getByLabel("Email")).toBeVisible({ timeout: 10_000 });
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Something's going wrong.")).toBeVisible({ timeout: 10_000 });
  });

  test("login page navigates to home on success", async ({ page }) => {
    await mockBackend(page);
    await page.route(`${API}/auth/login`, (route) =>
      route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ message: "User logged successfully", name: "Alice", accessToken: "fake-access-token" }),
      }),
    );

    await page.goto("/auth/login");
    await expect(page.getByLabel("Email")).toBeVisible({ timeout: 10_000 });
    await page.getByLabel("Email").fill("user@example.com");
    await page.getByLabel("Password").fill("secret123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/.*\/$/, { timeout: 10_000 });
  });

  test("register page navigates to home on success", async ({ page }) => {
    await mockBackend(page);
    await page.route(`${API}/auth/register`, (route) =>
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ message: "User registered successfully", name: "Bob", accessToken: "fake-access-token" }),
      }),
    );

    await page.goto("/auth/register");
    await expect(page.getByLabel("Full Name")).toBeVisible({ timeout: 10_000 });
    await page.getByLabel("Full Name").fill("Bob Builder");
    await page.getByLabel("Email").fill("bob@example.com");
    await page.getByLabel("Password", { exact: true }).fill("secret123");
    await page.getByLabel("Confirm Password").fill("secret123");
    await page.getByRole("button", { name: /Create Account/ }).click();

    await expect(page).toHaveURL(/.*\/$/, { timeout: 10_000 });
  });

  test("product page renders without error", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/product/1");
    await expect(page).toHaveURL(/\/product\/1/, { timeout: 10_000 });
    await expect(page.getByText("Error 404")).toBeHidden();
  });

  test("unknown route shows the error page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByText("Error 404")).toBeVisible({ timeout: 10_000 });
  });

  test("theme toggle switches to dark mode", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/");

    const html = page.locator("html");
    const wasDark = await html.evaluate((el) => el.classList.contains("dark"));

    await page.getByRole("button", { name: /Toggle theme/ }).first().click();
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await page.waitForTimeout(300);

    const isDark = await html.evaluate((el) => el.classList.contains("dark"));
    expect(isDark).toBe(!wasDark);
  });
});