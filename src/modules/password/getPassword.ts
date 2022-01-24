import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { APPDATA } from '../../utils/paths';
import { getPasswordfromPasswordlist } from '../passwordlist';
import { requestPassword } from '../../utils/requestPassword';

type IGetPassword = {
    passwordlist?: string;
};

async function getPassword(
    passwordlist: string,
    name: string,
    options: IGetPassword
) {
    const passwordsPath = path.join(APPDATA, 'passwordlist');
    mkdirSync(passwordsPath, { recursive: true });

    if (!existsSync(path.join(passwordsPath, passwordlist))) {
        throw new Error('This passwordlist does not exist');
    }

    let pwPasswordlist: string;

    if (!options.passwordlist) {
        pwPasswordlist = await requestPassword('Password of password list');
    } else {
        pwPasswordlist = options.passwordlist;
    }

    return getPasswordfromPasswordlist(passwordlist, name, pwPasswordlist);
}

export default getPassword;
