import inquirer from 'inquirer';
import Clipboard from 'clipboardy';
import { program } from 'commander';
import { getPassword } from '../modules/password';
import { getPasswordlist } from '../utils/getPasswordlist';

export default program
    .command('get <name> [passwordlist]')
    .description('Get your password')
    .option('-pl, --passwordlist <password>', 'Password of password list')
    .option('-n, --name <name>', 'Password name.')
    .option('-h, --hidden', 'Hide password when get')
    .action(async (name, passwordlist, args) => {
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
                    if (answer.clipboard === 'Yes') Clipboard.writeSync(result);
                });
        } else {
            console.log('Cannot get password, try use another password name.');
        }
    });
