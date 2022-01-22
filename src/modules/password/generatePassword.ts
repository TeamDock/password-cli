import chalk from 'chalk';
import crypto from 'crypto';

type IGeneratePassword = {
    save?: boolean;
    length: string;
    symbols?: boolean;
    numbers?: boolean;
    preset?: string;
};

function generatePassword(options: IGeneratePassword) {
    const length = Math.abs(parseInt(options.length));

    if (isNaN(length)) throw new Error('Please type a valid length.');

    if (length < 8)
        console.log(
            chalk.yellow(
                'Warning: It is recommended that the password be at least 8 characters long.'
            )
        );

    let template = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    if (options.numbers) template += '12345678901234567890';
    if (options.symbols) template += '!@#$%&*()<>:;~`{}\'"';

    const templateLength = template.length;

    let result = '';
    for (let i = 0; i < length; i++) {
        result += template.charAt(
            Math.floor((crypto.randomInt(100) / 100) * templateLength)
        );
    }

    return result;
}

export default generatePassword;
