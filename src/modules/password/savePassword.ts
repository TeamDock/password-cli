import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { existsSync, mkdirSync } from 'fs';
import { APPDATA } from '../../utils/paths';
import { verifyPassword } from '.';
import { readPasswordlist, writePasswordlist } from '../passwordlist';
import { PasswordList } from '../../@types/passwordlist';

type ISavePassword = {
    password?: string;
    noverify: boolean;
    passwordlist?: string;
    name: string;
};

async function savePassword(passwordlist: string, options: ISavePassword) {
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

    let passwordToSave: string;

    if (!options.password) {
        passwordToSave = (
            await inquirer.prompt({
                type: 'password',
                message: 'Password to save',
                name: 'password',
                mask: '*',
            })
        ).password;
    } else {
        passwordToSave = options.password;
    }

    if (!options.noverify) {
        console.log('Verifying your password...');
        const result = await verifyPassword(passwordToSave);

        if (result) {
            console.error(chalk.red(`Found: ${result.found}`));

            const answer = await inquirer.prompt({
                type: 'list',
                name: 'continue',
                choices: ['Yes', 'No'],
                message:
                    'Your password has already been leaked! Continue anyway?',
            });

            if (answer.continue === 'No') {
                console.log(chalk.red('aborted'));
                return;
            }
        } else {
            console.log(chalk.green(`Not found`));
        }
    }

    let decryptedPasswordList: PasswordList[];

    try {
        decryptedPasswordList = JSON.parse(
            readPasswordlist(passwordlist, pwPasswordlist)
        ) as PasswordList[];
    } catch (error) {
        throw new Error('Incorrect password.');
    }

    decryptedPasswordList.push({
        password: passwordToSave,
        name: options.name,
    });

    writePasswordlist(
        JSON.stringify(decryptedPasswordList),
        pwPasswordlist,
        passwordlist
    );

    console.log(chalk.green('Successfully saved!'));
}

export default savePassword;
