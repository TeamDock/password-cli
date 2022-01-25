import chalk from 'chalk';
import { program } from 'commander';
import { savePassword } from '../modules/password';
import { getPasswordlist } from '../utils/getPasswordlist';
import { requestPassword } from '../utils/requestPassword';

export default program
    .command('save <name> [passwordlist]')
    .description('Save your password in safe place')
    .option('-p, --password <password>', 'Password to save')
    .option(
        '-pl, --passwordlistPassword <password>',
        'Password of password list'
    )
    .option('--noverify', 'Does not verify your password before saving')
    .action(async (name, passwordlist, args) => {
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
