import chalk from 'chalk';
import { program } from 'commander';
import inquirer from 'inquirer';
import Clipboard from 'clipboardy';
import ora from 'ora';
import {
    createPasswordlist,
    deletePasswordlist,
    listAllPasswordlist,
} from '../modules/passwordlist';
import { getPasswordlist } from '../utils/getPasswordlist';

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
                if (answer.clipboard === 'Yes') Clipboard.writeSync(password);
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

export default program
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
