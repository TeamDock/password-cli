import inquirer from 'inquirer';
import { listAllPasswordlist } from '../modules/passwordlist';

async function getPasswordlist() {
    return (
        await inquirer.prompt({
            type: 'list',
            message: 'Select passwordlist',
            name: 'passwordlist',
            choices: listAllPasswordlist(),
        })
    ).passwordlist;
}

export { getPasswordlist };
