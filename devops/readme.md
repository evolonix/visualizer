## Setup a new app

Copy the two workflow files (located in `.github/workflows`) from an existing app. For example, you can copy all the `skills-platform-*.yml` files

- `skills-platform-main.yml` builds and deploys from the main branch to Staging
- `skills-platform-release.yml` builds and deploys from release/\* branches to release, betas, and prods

Once the files have been copied, update their names to match the new app's name. Also do a find/replace within the files to update the name of the copied app to match the new name.

NX scripts should exist in each new app so that the \_build-and-test and \_deploy shared workflows can work out of the box as long as the new app name is passed to them as a parameter.

The directory structure of the new app will also match, so that new workflows should "just work" after copy/paste + find/replace. If they do not, then the paths should be adjusted rather than making adjustments to shared workflows.

## Storage containers for deployment

A new storage container will need to be created so that the build outputs can be deployed.
The new storage container should be named the same as the app. To deploy the new storage container, do the following:

1. Add a new storage container resource [here](https://github.com/degreed/infrastructure/blob/main/terraform/modules/app/main.tf#L252)
2. Not all of our CDN origin storage accounts are controlled by Terraform today so these storage accounts will need to have containers created manually:

   1. Staging - [degreedstaging](https://portal.azure.com/#@degreed.com/resource/subscriptions/23820159-9b8d-4284-b28d-23ee46f291e1/resourceGroups/Default-Storage-SouthCentralUS/providers/Microsoft.Storage/storageAccounts/degreedstaging/containersList)
   2. US Beta - [degreedbeta](https://portal.azure.com/#@degreed.com/resource/subscriptions/23820159-9b8d-4284-b28d-23ee46f291e1/resourceGroups/Default-Storage-SouthCentralUS/providers/Microsoft.Storage/storageAccounts/degreedbeta/containersList)
   3. US Prod - [degreed](https://portal.azure.com/#@degreed.com/resource/subscriptions/23820159-9b8d-4284-b28d-23ee46f291e1/resourceGroups/Default-Storage-SouthCentralUS/providers/Microsoft.Storage/storageAccounts/degreed/containersList)
