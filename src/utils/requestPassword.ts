import inquirer from 'inquirer';

async function requestPassword(message?: string) {
    return (
        await inquirer.prompt({
            type: 'password',
            message: message || "What's your password?",
            mask: '*',
            name: 'password',
        })
    ).password;
}

export { requestPassword };
