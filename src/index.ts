#!/usr/bin/env node
import inquirer from 'inquirer';
import clipboard from 'clipboardy';
import chalk from 'chalk';
import ora from 'ora';
import packageJson from '../package.json';
import { APPDATA } from './utils/paths';
import { program } from 'commander';
import { mkdirSync } from 'fs';
import { requestPassword } from './utils/requestPassword';
import { getPasswordlist } from './utils/getPasswordlist';

import {
    generatePassword,
    getPassword,
    savePassword,
    verifyPassword,
} from './modules/password';

import {
    createPasswordlist,
    deletePasswordlist,
    listAllPasswordlist,
} from './modules/passwordlist';

program.name('password-cli');
program.version(packageJson.version);

program
    .command('generate')
    .alias('gen')
    .option('-s, --symbols', 'Include symbols')
    .option('-n, --numbers', 'Include numbers')
    .option('-l, --length <length>', 'Password length', '20')
    .option('-p, --preset <path>', 'Load a password preset') // TODO
    .option('--save', "Save password when it's generated") // TODO
    .option('--hidden', "Hide password when it's generated")
    .description('Generate a secure password')
    .action((args) => {
        const password = generatePassword(args);
        console.log(chalk.green('Your password has been generated'));

        if (!args.hidden) console.log(`Your password: ${password}`);

        inquirer
            .prompt({
                type: 'list',
                message: 'Copy password to Clipboard?',
                name: 'clipboard',
                choices: ['Yes', 'No'],
            })
            .then((answer) => {
                if (answer.clipboard === 'Yes') clipboard.writeSync(password);
            });
    });

program
    .command('verify')
    .description('Verifies your password')
    .option('-p, --password <password>', 'Your password')
    .action(async (args) => {
        let _password: string;

        if (!args.password) {
            _password = await requestPassword();
        } else {
            _password = args.password;
        }
        const spinner = ora('Verifying...');
        spinner.start();

        const result = await verifyPassword(_password);

        if (result) {
            spinner.fail('Found');
            console.error(
                `Your password has been leaked ${result.found} times.`
            );
            console.log(
                chalk.red('It is recommended not to use this password!')
            );
        } else {
            spinner.succeed('Not found');
            console.log('This password was never leaked!');
        }
    });

program
    .command('save [passwordlist] <name>')
    .description('Save your password in safe place')
    .option('-p, --password <password>', 'Password to save')
    .option(
        '-pl, --passwordlistPassword <password>',
        'Password of password list'
    )
    .option('--noverify', 'Does not verify your password before saving')
    .action(async (passwordlist, name, args) => {
        let _passwordlist: string;
        if (!passwordlist) {
            _passwordlist = await getPasswordlist();
        } else {
            _passwordlist = passwordlist;
        }

        if (!args.password)
            args.password = await requestPassword('Password to save');
        if (!args.passwordlistPassword)
            args.passwordlistPassword = await requestPassword(
                'Password of passwordlist'
            );

        await savePassword(_passwordlist, name, args);
        console.log(chalk.green('Successfully saved!'));
    });

program
    .command('get [passwordlist] <name>')
    .description('Get your password')
    .option('-pl, --passwordlist <password>', 'Password of password list')
    .option('-n, --name <name>', 'Password name.')
    .option('-h, --hidden', 'Hide password when get')
    .action(async (passwordlist, name, args) => {
        let _passwordlist: string;
        if (!passwordlist) {
            _passwordlist = await getPasswordlist();
        } else {
            _passwordlist = passwordlist;
        }

        const result = await getPassword(_passwordlist, name, args);

        if (result) {
            if (!args.hidden) console.log(`Password: ${result}`);

            inquirer
                .prompt({
                    type: 'list',
                    message: 'Copy password to Clipboard?',
                    name: 'clipboard',
                    choices: ['Yes', 'No'],
                })
                .then((answer) => {
                    if (answer.clipboard === 'Yes') clipboard.writeSync(result);
                });
        } else {
            console.log('Cannot get password, try use another password name.');
        }
    });

// passwordlist's subcommands
const createSubCmd = program
    .command('create <name>')
    .description('Create a new passwordlist')
    .option('-h, --hidden', "Hide password when it's generated")
    .action((name, args) => {
        const spinner = ora('Creating...');
        spinner.start();
        const password = createPasswordlist(name);
        spinner.succeed('Done!');

        if (!args.hidden)
            console.log(
                `Here is your new password for your password list: ${password}`
            );

        console.log(chalk.red.bold('Save this password in a safe place!'));
        console.log(chalk.red.bold('Never lose this password'));
        inquirer
            .prompt({
                type: 'list',
                message: 'Copy password to Clipboard?',
                name: 'clipboard',
                choices: ['Yes', 'No'],
            })
            .then((answer) => {
                if (answer.clipboard === 'Yes') clipboard.writeSync(password);
            });
    });

const deleteSubCmd = program
    .command('delete [passwordlist]')
    .description('Delete a passwordlist')
    .option('--force', 'Force delete passwordlist')
    .action(async (passwordlist, args) => {
        let _passwordlist: string;
        if (!passwordlist) {
            _passwordlist = await getPasswordlist();
        } else {
            _passwordlist = passwordlist;
        }

        if (!args.force) {
            console.log(chalk.red('Danger zone!'));

            const sure = (
                await inquirer.prompt({
                    message:
                        'Are you sure, this will delete all your passwords in your passwordlist!',
                    name: 'sure',
                    type: 'list',
                    choices: ['Yes', 'No'],
                })
            ).sure;

            if (sure === 'No') {
                console.log(chalk.red('aborted'));
                return;
            }
        }

        const spinner = ora('Deleting...');
        spinner.start();
        await deletePasswordlist(_passwordlist);
        spinner.succeed(`${_passwordlist} deleted!`);
    });

program
    .command('passwordlist')
    .description('List all passwordlist')
    .addCommand(createSubCmd)
    .addCommand(deleteSubCmd)
    .action(() => {
        const passwordlists = listAllPasswordlist();

        if (passwordlists.length < 1)
            return console.log('There is no passwordlist');

        for (let i = 0; i < passwordlists.length; i++) {
            const passwordlist = passwordlists[i];

            console.log(chalk.white(`[${i + 1}] `, chalk.green(passwordlist)));
        }
    });

function main(args: string[]) {
    mkdirSync(APPDATA, { recursive: true });

    program.parse(args);
}

main(process.argv);
