import fs from 'fs';
import { join } from 'path';

const filePath = join(__dirname, 'assets/database/users.json');
const userdb = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));

/**
 * Data Service to interact with user Database
 */
export class UserService {
  // Check if the user exists in database
  public isAuthenticated(userName, password, ignorePassword = false): [boolean, string] {
    const matchUser = (user) => user.userName.toLowerCase() === userName.toLowerCase();
    const matchPassword = (user) => ignorePassword || user.password === password;

    const user = userdb.users.find((user) => matchUser(user));
    return !user ? [false, 'Unknown user'] : !matchPassword(user) ? [false, 'Invalid password'] : [true, ''];
  }
}
