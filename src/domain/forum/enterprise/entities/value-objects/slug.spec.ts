import { Slug } from "./slug";

describe("Slug value-object", () => {
  it("should create a slug from a string", () => {
    const slug = Slug.createFromText("Hello World");
    expect(slug.value).toBe("hello-world");
  });
});

