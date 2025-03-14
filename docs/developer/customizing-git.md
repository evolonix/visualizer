---
lang: en
title: Git Appendix - Customized Logs
tags: git, logs, terminal
description: How to enhance Bash and `.gitconfig` for compact, colorized git logs
---

# GitOps - Customized Git

Normal `git logs` commands will output a full log detail to the console:

![](https://i.imgur.com/foFNikr.png)

Often developers want to see compacted, colorized log outputs. To generate the compact logs, use a custom `git lg` command.

Developers should create a **git alias** in their git configuration file:

#### `~/.gitconfig`

```bash
[alias]
  plog = log --color --graph --pretty=format:'%C(red)%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

Developers can also specify a **bash** command `glog` for the Terminal:

#### `~/.bashrc`

```bash
function glog() {
  git plog
}
```

Then in the terminal window, just type `log` to see the compacted git log output:

[![](https://i.imgur.com/Z7uHhrg.png)](https://i.imgur.com/Z7uHhrg.png)

<br>

---

<br>
<br>

### Customized Terminal Prompt

To easily navigate your Git repositories from the terminal, let's modify the standard terminal prompt to show:

- the Git branch, if the current working directory is a git repository
- use a **red** color-code for the branch name, if the repo contains uncommitted changes

##### Before

![](https://i.imgur.com/X7GqE8H.png)

##### After

![](https://i.imgur.com/B0xydnC.png)

![](https://i.imgur.com/0bjijXi.png)

<br>
<br>

Simply modify your Bash settings within the configuration `bashrc`:

### Terminal Customizations

##### File: `~/.bashrc`

```bash
# Text color variables
txtUnd=$(tput sgr 0 1) # Underline
txtBold=$(tput bold) # Bold
bldred=${txtBold}$(tput setaf 1) # red
bldblue=${txtBold}$(tput setaf 4) # blue
bldwhite=${txtBold}$(tput setaf 7) # white
txtReset=$(tput sgr0) # Reset
c_red=`tput setaf 1`
c_green=`tput setaf 2`
c_yellow=`tput setaf 3`
c_blue=`tput setaf 4`
c_purple=`tput setaf 5`
c_cyan=`tput setaf 6`
c_white=`tput setaf 7`

# Determine branch name if CWD is part of a git repository
parse_git_branch ()
{
if git rev-parse --git-dir >/dev/null 2>&1
then
  gitver=$(git branch 2>/dev/null| sed -n '/^\*/s/^\* //p')
else
  return 0
fi
echo -e $gitver
}

# Highlight branch name in `red` color if the repo contains uncommitted changes
branch_color ()
{
if git rev-parse --git-dir >/dev/null 2>&1
then
  color=""
if git diff --quiet 2>/dev/null >&2
then
  color="${c_green}"
else
  color=${c_red}
fi
else
return 0
fi
echo -ne $color
}

# Update command prompt to show `<cwd> [<git branch name>]`
PS1='\[${c_green}\]\W\[${txtReset}\] [\[$(branch_color)\]$(parse_git_branch)\[${txtReset}\]]: '

function cls() {
 clear
}

# Silently amend all changes to the HEAD commit; without message changes

function branches() {
 git branch --list --column
}


function amend() {
 git add -A && git commit --amend --no-edit
}

function rebase() {
if
  $1
then
  git pull --rebase origin $1
else
  git pull --rebase origin master
fi
}

function fetch() {
 git fetch --all --tag
}

function commit() {
if
  $1
then
  git add . && git commit -am "$1"
else
  return 0
fi
}

function log() {
  git plog $1
}

alias ls='ls -la'
alias cls='clear'
alias g='git '
alias npm-exec='PATH=$(npm bin):$PATH'

alias gl='git log --color --graph --pretty=format:"%C(red)%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset" --abbrev-commit'
alias gf='git fetch'
alias gco='git checkout $@'
alias gst='git status -s'
alias gcp='git cherry-pick'
alias gcm='git checkout master'
alias gcd='git checkout develop'
alias ga='git add .'
alias gfp='git push --force-with-lease origin $1'
alias gprd='git pull --rebase origin master'
alias gca='git commit -a'

# @see https://haacked.com/archive/2014/07/28/github-flow-aliases/

alias rebase-i='git rebase -i HEAD~$@'
alias abort='git rebase --abort'
alias continue='git add . && git rebase --continue'

alias amend='git add . && git commit --amend --no-edit'
alias commit='git add . && git commit -m $@'

alias save='git add -A && git commit -m "SAVEPOINT"'
alias undo='git reset HEAD~1 --mixed'
alias wipe="git add -A && git commit -qm 'WIPE SAVEPOINT' && git reset HEAD~1 --hard"
```

> Don't forget to run `source ~/.bashrc` so you can see these changes in your terminal.

##### File: `~/.gitconfig`

<br>
<br>

### GitConfig

And update your global gitConfig settings with improved 'aliases'.

> `plog` is the most important!

```bash=
[alias]
    plog = !git log --color --graph --pretty=format:\"%C(red)%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset\" --abbrev-commit
    recent = !git for-each-ref --sort=-committerdate refs/heads --format='%(HEAD)%(color:yellow)%(refname:short)|%(color:bold green)%(committerdate:relative)|%(color:blue)%(subject)|%(color:magenta)%(authorname)%(color:reset)' --color=always | column -ts'|'
    wipe = !git add -A && git commit -qm 'WIPE SAVEPOINT' && git reset HEAD~1 --hard
    f = fetch
    co = checkout
    st = status -s
    cp = cherry-pick
    cm = checkout master
    ri = rebase -i
    cam = commit --amend
    a = add .
    pf = push --force-with-lease orign $(current_branch)
    prm = pull --rebase origin master
    pr = pull --rebase
    ca = commit -a
    pom = push origin master
    pog = push origin gh-pages
    prb = "git fetch -f origin refs/pull/$1/head:pr/$1"
    pr = "!f(){ git fetch -fu ${2:-origin} refs/pull/$1/head:pr/$1 && git checkout pr/$1; }; f"
    pr-clean = "!f() { git checkout master; git for-each-ref refs/heads/pr/* --format='%(refname)' | while read ref; do branch=${ref#refs/heads/}; git branch -D $branch; done; }; f"
    pr-upstream = '!f() { git fetch -fu ${2:-upstream} refs/pull/$1/head:pr/$1 && git checkout pr/$1; }; f'
    fp = push --force-with-lease origin
```
