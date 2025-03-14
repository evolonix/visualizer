# Git Editor with VS Code

From the terminal, instead of using the VIM or Nano editors, developers can use VS Code.

- Make sure you have GitLens installed as a VS Code extension.
- Configure Git to use VS Code as its editor:
  - `git config --global core.editor "code --wait"`

Now you can use terminal commands like `git rebase -i HEAD~6` and see something like this:

[![Git Rebasing in VS Code](https://user-images.githubusercontent.com/210413/176776118-e1f00269-8067-47e4-a5dd-85a43c119732.png)](https://user-images.githubusercontent.com/210413/176776118-e1f00269-8067-47e4-a5dd-85a43c119732.png)
