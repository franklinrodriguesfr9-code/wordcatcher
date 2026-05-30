import { expect, test } from "@playwright/test";

test("small mobile viewport does not create horizontal scroll", async ({ page }) => {
  await page.goto("/wordcatcher/");

  await page.getByLabel("English word").fill("supercalifragilisticexpialidocious");
  await page.getByLabel("Portuguese translation").fill("a very long translation that should wrap inside the card without breaking the screen");
  await page.getByRole("button", { name: /save word/i }).click();
  await page.getByRole("button", { name: /word list/i }).click();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
