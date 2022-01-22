#!/usr/bin/env node
import inquirer from 'inquirer';
import clipboard from 'clipboardy';
import chalk from 'chalk';
import ora from 'ora';
import { program } from 'commander';
import { mkdirSync } from 'fs';
import { APPDATA } from './utils/paths';
import packageJson from '../package.json';

import {
    generatePassword,
    getPassword,
    savePassword,
    verifyPassword,
} from './modules/password';

import {
    createPasswordlist,
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
        const spinner = ora('Verifying...');
        spinner.start();
        const result = await verifyPassword(args.password);

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
    .command('save <passwordlist>')
    .description('Save your password in safe place')
    .option('-p, --password <password>', 'Password to save')
    .option('-pl, --passwordlist <password>', 'Password of password list')
    .option('-n, --name <name>', 'Password name.')
    .option('--noverify', 'Does not verify your password before saving')
    .action((passwordlist, args) => {
        if (!args.name)
            return console.log(
                chalk.red(
                    `The parameter "name" is required. Try use: "password-cli save --help"`
                )
            );

        savePassword(passwordlist, args);
    });

program
    .command('get <passwordlist>')
    .description('Get your password')
    .option('-pl, --passwordlist <password>', 'Password of password list')
    .option('-n, --name <name>', 'Password name.')
    .option('-h, --hidden', 'Hide password when get')
    .action(async (passwordlist, args) => {
        if (!args.name)
            return console.log(
                chalk.red(
                    `The parameter "name" is required. Try use: "password-cli get --help"`
                )
            );
        const result = await getPassword(passwordlist, args);

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
const create = program
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

program
    .command('passwordlist')
    .description('List all passwordlist')
    .addCommand(create)
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
