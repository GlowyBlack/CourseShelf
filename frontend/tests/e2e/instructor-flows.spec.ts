import { expect, test } from "@playwright/test";

test("Instructor creates a course and sees it on the dashboard", async ({ page }) => {
  const courses = [
    { id: 1, name: "Data Structures", department: "CS", term: "2026W1" },
  ];

  await page.route("**/courses", async (route) => {
    const method = route.request().method();

    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(courses),
      });
      return;
    }

    if (method === "POST") {
      const payload = route.request().postDataJSON();
      const created = {
        id: 2,
        name: payload.name,
        department: payload.department,
        term: `${payload.year}${payload.termSeason}${payload.semester}`,
      };
      courses.unshift(created);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(created),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto("/");
  await expect(page.getByText("Data Structures")).toBeVisible();

  await page.getByRole("button", { name: "Add Course +" }).click();
  await page.getByPlaceholder("Course name").fill("Algorithms");
  await page.getByPlaceholder("Department").fill("CS");
  await page.locator('input[type="number"]').last().fill("2027");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Algorithms")).toBeVisible();
});

test("Instructor opens course, adds material, then deletes it", async ({ page }) => {
  const courses = [
    { id: 1, name: "Data Structures & Algorithm", department: "CS", term: "2026W1" },
  ];
  const materials = [
    {
      id: 11,
      title: "Week 1 Slides",
      type: "Lecture Notes",
      description: "Intro slides",
      link: "https://example.com/slides",
      courseId: 1,
    },
  ];

  await page.route("**/courses", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(courses),
      });
      return;
    }

    await route.fallback();
  });

  await page.route("**/courses/1/materials", async (route) => {
    const method = route.request().method();

    if (method === "POST") {
      const payload = route.request().postDataJSON();
      const created = {
        id: 12,
        title: payload.title,
        type: payload.type,
        description: payload.description,
        link: payload.link,
        courseId: 1,
      };
      materials.unshift(created);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(created),
      });
      return;
    }

    if (method === "DELETE") {
      const payload = route.request().postDataJSON();
      const idx = materials.findIndex((item) => item.id === payload.materialId);
      if (idx >= 0) {
        materials.splice(idx, 1);
      }
      await route.fulfill({ status: 204, body: "" });
      return;
    }

    await route.fallback();
  });

  await page.route("**/courses/1", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        name: "Data Structures & Algorithm",
        department: "CS",
        term: "2026W1",
        materials,
      }),
    });
  });

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await page.goto("/");
  await page.getByText("Data Structures & Algorithm").click();
  await expect(page.getByText("Data Structures & Algorithm")).toBeVisible();
  await expect(page.getByText("Week 1 Slides")).toBeVisible();

  await page.getByRole("button", { name: "Add Material +" }).click();
  await page.getByPlaceholder("Title").fill("Practice Final Exam");
  await page.getByPlaceholder("Description").fill("Exam prep questions");
  await page.getByPlaceholder("Link").fill("google.com");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Practice Final Exam")).toBeVisible();

  await page.getByRole("button", { name: "Material actions" }).first().click();
  await page.getByRole("button", { name: "Delete" }).click();

  await expect(page.getByText("Practice Final Exam")).not.toBeVisible();
});
