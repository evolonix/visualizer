---
lang: en
title: Git Appendix - Commit Conventions
tags: git, commit, message, guidelines, conventions
description:
---

# GitOps - Contributing Changes

We would love for you to contribute to our project and help make it even better than it is today! As a contributor, here are the guidelines we would like you to follow:

- **[Commit Conventions](#Commit-Conventions)**
- **GitFlow Feature Branches**
- **Pull Requests**
  - Squashing and Rebasing
- **Code Reviews**
  - Code Reviews
  - Branch Rules
  - Merging (types)

<br>

---

## Commit Conventions

We have very precise rules over how our Git commit messages must be formatted. So WHY are specific commit conventions necessary?

With clean, consistent commit conventions projects can auto-generate **Release ChangeLog** documentation. Generating changelogs quickly and consistently is a critical part of each release.

> @see the Google's [Angular Changelog](https://urldefense.com/v3/__https://github.com/angular/angular/blob/main/CHANGELOG.md*1325-2022-03-02__;Iw!!BZ50a36bapWJ!pk3Klh-Hfs2m2OQA2fAVJ4YZpUPdxxuaxmXgETbH2QzQYyzVF-A6bePNGjZjRohetcnpe-LnWmdabQKE83jKrC7lkzV4$)

Good commit formats ensures **clarity and readable messages** that are easy to follow when looking through the **project history**.

![](https://i.imgur.com/rQ7bYh4.png)

<br>

:::danger
To enforce _commit conventions_, the following tooling may be used [Husky Pre-commit Hooks](https://github.com/typicode/husky), and [Commitizen CLI](https://github.com/commitizen/cz-cli). Watch the Egghead [Video: Using Commitizen](https://egghead.io/lessons/javascript-writing-conventional-commits-with-commitizen) for details.
:::

<br>

#### Commit Message Format

```xml
<type>(<scope>): <summary>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Each commit message consists of a **header**, a **body** and a **footer**.

- The header has a special format that includes a **type**, a **scope** and a **summary**. The **header** is mandatory and the **scope** of the header is optional.
- The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

<br>

![](https://i.imgur.com/Oofm4gu.png)

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

:::success
:tada: We use the git commit messages to generate **release notes**: [CHANGELOG.md](https://github.com/angular/flex-layout/blob/master/CHANGELOG.md)
:::

<br>

#### Message Parts

```xml
<type>(<scope>): <summary>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The `header` is mandatory and must conform to the [Commit Message Header](#commit-message-header) format.

The `body` is mandatory for all commits except for those of type "docs".
When the body is present it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-message-body) format.

The `footer` is optional. The [Commit Message Footer](#commit-message-footer) format describes what the footer is used for and the structure it must have.

### Commit Message Header

```text
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end. No JIRA #.
  │       │
  │       └─⫸ Commit Scope: survey|consent|ui|
  │                          i18n|tools|upgrade|
  │                          packaging|forms|styles
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test|chore
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

##### `<Type>`

Must be one of the following:

| Option       |     | Description                                                                                                         |
| ------------ | --- | ------------------------------------------------------------------------------------------------------------------- |
| **build**    | 💎  | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)                 |
| **ci**       | 🙌  | Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)                 |
| **docs**     | 📚  | Documentation only changes                                                                                          |
| **feat**     | 🎉  | A new feature                                                                                                       |
| **fix**      | 🦂  | A bug fix                                                                                                           |
| **perf**     | ⏳  | A code change that improves performance                                                                             |
| **refactor** |     | A code change that neither fixes a bug nor adds a feature                                                           |
| **test**     |     | Adding missing tests or correcting existing tests                                                                   |
| **chore**    |     | Changes to project organization, packages, tooling, infrastructure; these changes should NOT show in the changelong |
| **style**    |     | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)              |

<br>

##### `<Scope>`

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages).

The following is the list of supported scopes for this _use package name_ rule:

- `survey`
- `conset`
- `proxy`
- `ui`
- `i18n`
- `tools`
- `upgrade`
- `packaging`
- `forms`
- `styles`

There are currently a few exceptions to the _use package name_ rule:

- **packaging**: used for changes that change the npm package layout in all of our packages,
  - e.g. public path changes,
  - package.json changes done to all packages,
  - d.ts file/format changes,
  - changes to bundles,
  - etc.
- **changelog**: used for updating the release notes in [CHANGELOG.md](https://github.com/angular/flex-layout/blob/master/CHANGELOG.md)[target=_blank]
  :::info
- **none/empty string**: useful for `style`, `test` and `refactor` changes that are done across all packages, and for docs changes that are not related to a specific package.
  - `style: add missing semicolons`
  - `docs: fix typo in tutorial`
    :::

<br>

##### `<Summary>` (aka Subject)

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

<br>

##### `<Body>`

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

:::info
**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message body is then used for this information.
:::
<br>

##### `<Footer>`

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

<br>

---

#### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

<br>

For example:

```text
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

or

```text
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Closes #<pr number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with "DEPRECATED: " followed by a short description of what is deprecated, a blank line, and a detailed description of the deprecation that also mentions the recommended update path.
