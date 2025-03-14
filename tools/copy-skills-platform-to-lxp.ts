/**
 * This script copies Degreed Skills app to the MVC project.
 * It is intended to be run after the build has completed.
 *
 * Running `nx build app-skills-platform --configuration=lxp` will run this script after the build.
 *
 * The files are copied to the Degreed.Web project in the Degreed repo so that it can be run within the LXP, by way of the Razor page, at the /skills-platform route.
 */
import path from 'path';
import shell from 'shelljs';

const skillsPlatformSrc = path.join(__dirname, '../dist/apps/skills-platform/spa');
const lxpDest = path.join(__dirname, '../../Degreed/trunk/Degreed.Web');
const skillsPlatformDest = path.join(lxpDest, 'skills-platform');

console.log("Preparing to copy Degreed Skills to LXP's Degreed.Web...");
console.log();

console.log('Cleaning up old Degreed Skills files...');
shell.rm('-rf', `${skillsPlatformDest}/*`);
shell.mkdir('-p', skillsPlatformDest);

console.log();
console.log('Copying new Degreed Skills files...');
shell.cp('-R', `${skillsPlatformSrc}/*`, skillsPlatformDest);

console.log();
console.log("Finished copying Degreed Skills to LXP's Degreed.Web!");
