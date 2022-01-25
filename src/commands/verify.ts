import chalk from 'chalk';
import ora from 'ora';
import { program } from 'commander';
import { verifyPassword } from '../modules/password';
import { requestPassword } from '../utils/requestPassword';

export default program
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
