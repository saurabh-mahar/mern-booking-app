import {test,  expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
 await page.goto(UI_URL);

  // Expect a title "to contain" a substring.
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading",{ name: "Sign In"})).toBeVisible();

  await page.locator("[name=email]").fill("virat@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button",{ name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
}) 

test("should allow user to add a hotel", async ({ page }) => {
    await page.goto(`${UI_URL}add-hotel`);

    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("This is a description for the Test Hotel");
    await page.locator('[name="pricePerNight"]').fill("4");
    await page.selectOption('select[name="starRating"]', "3");
    await page.getByText("Budget").click();
    await page.getByText("Free Wifi").click();
    await page.getByLabel("Parking").check();

    await page.locator('[name="adultCount"]').fill("2")
    await page.locator('[name="childCount"]').fill("2")

   await page.setInputFiles('[name="imageFiles"]', [
  path.join(__dirname, "files", "1.jpg"),
  path.join(__dirname, "files", "2.jpg"),
])

    await page.getByRole("button",{ name: "Save" }).click();
    await expect(page.getByText("Hotel Saved!")).toBeVisible({ timeout: 10000 });
})

test("should display hotels",async ({page}) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("new hotel")).toBeVisible();
  await expect(page.getByText("my new hotel in haldwani")).toBeVisible();

  await expect(page.getByText("haldwani, India")).toBeVisible();
  await expect(page.getByText("Self Catering")).toBeVisible();
  await expect(page.getByText("₹998 per night")).toBeVisible();
  await expect(page.getByText("8 adults, 9 children")).toBeVisible();
  await expect(page.getByText("4 Star Rating")).toBeVisible();

  await expect(page.getByRole("link",{ name: "View Details"})).toBeVisible();
  await expect(page.getByRole("link",{ name: "Add Hotel"})).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("virat hotel");
  await page.locator('[name="name"]').fill("virat hotel updated");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue(
    "virat hotel updated"
  );
  await page.locator('[name="name"]').fill("virat hotel");
  await page.getByRole("button", { name: "Save" }).click();
});