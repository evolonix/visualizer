# CDN-Based i18n

## Source Code

This modules contains two simple `async` utilities to determine/load the most recent localizations for a specified `locale` and `bundle` pair:

- `resolveUrl()`: resolve the URL using the remote registry lookups
- `loadJson()`: resolve the URL and load the JSON key-value pairs

## Summary

Degreed CDN-based i18n are localization strings stored on the CDN (Azure Blob Storage) and organized as key-value pairs within JSON files. The files are stored in a directory structure based on a versioning algorithm to facilitate browser cache busting.

The storage structure uses

- publishes a 'registry' of all available bundles, areas, and locales.
- caculates and uses hash keys as 'versions'.

## Versioning

Each time the CDN is updated a new 'version' folder is created for each affected area and bundle. This version key is then updated within the i18n registry.

> The registry always refers to the latest version-hash for each area and bundle

##### Registry `index.json`

```json
{
  "bundles": {
    "account": "v_F893EF0BB6FE70BDEAB9D765CC19FC13",
    "channel": "v_E48D7ECED0790FD7268645587B841AA9",
    "extensions": "v_0D57A9215B49B777583E0B40F5E72E7F",
    "input-page": "v_AC03DD5CC1B17C81FD3FF91F1251DC2D",
    "marketing": "v_DB5F9D058004A7FA3E9B6781B79C05DE",
    "msteams": "v_443578D3F68BB3200F01EBA481664C4F",
    "public": "v_2E29D10EB158761250A623B2966AA58F",
    "reporting-in-app": "v_6A9499CDACD4956B56B5CD941D20DB2D",
    "web-app": "v_2F5733082A3F564F183EE0F26E131F5A"
  },
  "locales": ["", "ar", "cs", "de", "el", "en", "en-gb", "en-jm", "en-tt", "es", "es-es", "es-la"]
}
```

## Directory Structure

The Localization CDN directory `/content/i18n` is formatted as follows:

```text
 index.json            <--- registry of all available bundles, areas, and locales

 A11y/              <--- individual areas; key-values for specific 'areas' of the app
   <version-hash>/     <--- cache buster storage; new version for any change in THIS area
     <locale>.json     <--  ALL key-values for THIS area only; in THIS locale
     default.json      <--- default/en locale in specified locale is not found
 <area-name>/
   <version-hash>/
     <locale>.json

bundles/               <--- aggregate of all areas into a bundle; ALL strings
  web-app/             <--- default bundle if bundleName is not found
    <version-hash>/    <--- cache buster storage, new version for ANY change in entire group of areas
      <locale>.json    <--  ALL key-values for all areas; in THIS locale
  <bundle-name>/
    <version-hash>/
      <locale>.json
```

<br/>
