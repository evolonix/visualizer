/**
 * This script copies the Engage app to the MVC project.
 * It is intended to be run after the build has completed.
 *
 * Running `nx build app-engage --configuration=lxp` will run this script after the build.
 *
 * The files are copied to the Degreed.Web project in the Degreed repo so that it can be run within the LXP, by way of the Razor page, at the /engage/{orgId} route.
 */
const path = require('path');
const shell = require('shelljs');

const engageSrc = path.join(__dirname, '../dist/apps/engage/spa');
const tinyMCESrc = path.join(engageSrc, 'tinymce');

const lxpDest = path.join(__dirname, '../../Degreed/trunk/Degreed.Web');
const engageDest = path.join(lxpDest, 'engage');
const tinyMCEDest = path.join(lxpDest, 'tinymce');

console.log("Preparing to copy Engage to LXP's Degreed.Web...");
console.log();

console.log('Cleaning up old Engage files...');
shell.rm('-rf', `${engageDest}/*`);
console.log('Cleaning up old TinyMCE files...');
shell.rm('-rf', `${tinyMCEDest}/*`);
shell.mkdir('-p', engageDest);
shell.mkdir('-p', tinyMCEDest);

console.log();
console.log('Copying new Engage files...');
shell.cp('-R', `${engageSrc}/!(tinymce)`, engageDest);
console.log('Copying new TinyMCE files...');
shell.cp('-R', `${tinyMCESrc}/*`, tinyMCEDest);

console.log();
console.log("Finished copying Engage to LXP's Degreed.Web!");
