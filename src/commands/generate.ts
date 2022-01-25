import chalk from 'chalk';
import inquirer from 'inquirer';
import Clipboard from 'clipboardy';
import { program } from 'commander';
import { generatePassword } from '../modules/password';
import { loadPreset } from '../modules/preset/loadPreset';

export default program
    .command('generate')
    .alias('gen')
    .option('-s, --symbols', 'Include symbols')
    .option('-n, --numbers', 'Include numbers')
    .option('-l, --length <length>', 'Password length', '20')
    .option('-p, --preset <name>', 'Load a password preset')
    .option('--hidden', "Hide password when it's generated")
    .description('Generate a secure password')
    .action((args) => {
        if (args.preset) {
            args = JSON.parse(loadPreset(args.preset));
        }
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
                if (answer.clipboard === 'Yes') Clipboard.writeSync(password);
            });
    });
