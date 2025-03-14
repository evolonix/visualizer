# Testing the Engage SPA

You can run the Engage SPA in a few different ways. The most common way is to run it in a development environment. This is the way you should use when you are developing new features or fixing bugs. The development environment uses a JSON Server for the API. The SPA and API are started by running the following command in the root folder of the `fe-workspace`.

```bash
nx serve app-engage
```

You can also build the Engage SPA for the API development environment. This is the way you should use when you are testing the Engage SPA against API development changes. The SPA's build output is copied to the `../Degreed/trunk/Degreed.Web/engage` directory and the TinyMCE assets are copied to the `../Degreed/trunk/Degreed.Web/tinymce` directory. The SPA is built and copied by running the following command in the root folder of the `fe-workspace`.

```bash
nx build app-engage --configuration=lxp
```

or

```bash
nx run app-engage:build:lxp
```
