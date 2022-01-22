import path from 'path';
import inquirer from 'inquirer';
import { existsSync, mkdirSync } from 'fs';
import { APPDATA } from '../../utils/paths';
import { getPasswordfromPasswordlist } from '../passwordlist';

type IGetPassword = {
    passwordlist?: string;
    name: string;
};

async function getPassword(passwordlist: string, options: IGetPassword) {
    const passwordsPath = path.join(APPDATA, 'passwordlist');
    mkdirSync(passwordsPath, { recursive: true });

    if (!existsSync(path.join(passwordsPath, passwordlist))) {
        throw new Error('This passwordlist does not exist');
    }

    let pwPasswordlist: string;

    if (!options.passwordlist) {
        pwPasswordlist = (
            await inquirer.prompt({
                type: 'password',
                message: 'Password of password list',
                name: 'password',
                mask: '*',
            })
        ).password;
    } else {
        pwPasswordlist = options.passwordlist;
    }

    return getPasswordfromPasswordlist(
        passwordlist,
        options.name,
        pwPasswordlist
    );
}

export default getPassword;
