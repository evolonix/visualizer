# Degreed Skills

This web application implements the shell for the Degreed Skills product. Note: the applications features and Cx are **pending**!

---

### Testing the SPA

You can run the SPA in a few different ways. The most common way is to run it in a development environment. This is the way you should use when you are developing new features or fixing bugs. The development environment accesses Docker containers for the API. The SPA is started by running the following command in the root folder of the `fe-workspace`.

```bash
npx nx serve app-skills-platform
```

You can also build the SPA for the LXP development environment. The SPA's build output is copied to the `../Degreed/trunk/Degreed.Web/skills-platform` directory. The SPA is built and copied by running the following command in the root folder of the `fe-workspace`.

```bash
npx nx build app-skills-platform --configuration=lxp
```

or

```bash
npx nx run app-skills-platform:build:lxp
```

The build output's files are referenced in the Skills Platform razor page. The razor page is located at `../Degreed/trunk/Degreed.Web/Views/Nx/SkillsPlatform.cshtml`.

The files are referenced in the following format:

```html
<script type="module" crossorigin src="@Url.BlobContent("~/skills-platform/assets/index.js")"></script>
<link rel="stylesheet" crossorigin href="@Url.BlobContent("~/skills-platform/assets/index.css")" />
```

The build output DOES NOT include a hash in the filenames because of the razor page's manual references. The files on the CDN are appended with a cache buster query string for hosted environments using a Redis cache to keep track of the cache bust value. This value is updated during the DevOps pipeline deployment process.

As build output files change, the razor page must be updated to reflect the changes.
