# Git Standards

## Commitizen

Commitizen is release management tool designed for teams.

Commitizen assumes your team uses a standard way of committing rules and from that foundation, it works with an Nx workspace/monorepo friendly version of [semantic-release](https://github.com/TheUnderScorer/nx-semantic-release) to bump your project's version, create the changelog, and update files.

Our implementation of commitizen uses [conventional commits](https://www.conventionalcommits.org/).

Using a standardized set of rules to write commits, makes commits easier to read, and enforces writing descriptive commits.

To be prompted with Commitizen's form, use the `git commit` command instead of `git commit -m`.

```bash
git commit
```

## Commitlint

Commitlint is a tool that checks if your commit messages meet the conventional commit format.

Commitlint is used by commitizen to validate your commit messages.

## Husky

Husky is a tool that allows you to run scripts before git commands are executed.

Husky is used by commitizen to run commitlint before a commit is created.

## Lint Staged

Lint Staged is a tool that allows you to run scripts on staged files.

Lint Staged is used by commitizen to run prettier on staged files before a commit is created.
