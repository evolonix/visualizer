terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 5.0"
    }
  }

  cloud {
    organization = "degreed"

    workspaces {
      name = "fe-workspace-repository"
    }
  }
}

provider "github" {
  owner = "Degreed"
}

data "github_repository" "fe-workspace" {
  full_name = "degreed/fe-workspace"
}

locals {
  environments = toset([
    "Staging",
    "Release",
    "Beta",
    "Production",
    "EuropeBeta",
    "Europe",
    "Canada"
  ])
}

data "github_team" "devops" {
  slug = "devops"
}

data "github_team" "admin_experience" {
  slug = "admin-experience"
}

resource "github_repository_environment" "engage" {
  for_each    = local.environments
  repository  = data.github_repository.fe-workspace.name
  environment = "${each.key}-engage"
  reviewers {
    teams = each.key == "Staging" ? [] : [data.github_team.devops.id, data.github_team.admin_experience.id]
  }
}

data "github_team" "skills_platform" {
  slug = "skills-platform"
}

resource "github_repository_environment" "skills-platform" {
  for_each    = local.environments
  repository  = data.github_repository.fe-workspace.name
  environment = "${each.key}-skills-platform"
  reviewers {
    teams = each.key == "Staging" ? [] : [data.github_team.devops.id, data.github_team.skills_platform.id]
  }
}
