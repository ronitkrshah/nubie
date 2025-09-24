import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Nubie",
  description: "A Simple Typescript WebAPI Framework",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      {
        text: "v0.2.2-alpha",
        items: [{ text: "Changelogs", link: "/changelogs" }],
      },
    ],

    sidebar: [
      {
        text: "Basics",
        items: [
          { text: "Gettings Started", link: "/getting-started" },
          { text: "Hello Nubie", link: "/hello-nubie" },
          { text: "Configuration", link: "/configuration" },
        ],
      },
      {
        text: "Concepts",
        items: [
          { text: "Api Controller", link: "/concepts/api-controller" },
          { text: "Routing", link: "/concepts/routing" },
          {
            text: "Validation & Parameters",
            link: "/concepts/validation-parameteres",
          },
          { text: "Versioning", link: "/concepts/versioning" },
          { text: "File Upload", link: "/concepts/file-upload" },
          { text: "Other Decorators", link: "/concepts/other-decorators" },
          { text: "Authentication", link: "/concepts/authentication" },
          { text: "Dependency Injection", link: "/concepts/di" },
          { text: "Error Handling", link: "/concepts/error-handling" },
          { text: "Rate Limit", link: "/concepts/rate-limit" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/ronitkrshah/nubie.git" },
    ],
  },
  srcDir: "./src",
  base: "/nubie-docs/",
});
