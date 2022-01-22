import inquirer from 'inquirer';
import axios from 'axios';
import crypto from 'crypto';

async function verifyPassword(password?: string) {
    let _password;
    if (!password) {
        _password = (
            await inquirer.prompt({
                type: 'password',
                name: 'password',
                message: 'Type your password',
                mask: '*',
            })
        ).password;
    } else {
        _password = password;
    }

    const passwordHash = crypto
        .createHash('sha1')
        .update(_password)
        .digest('hex');

    const rangeHash = passwordHash.substring(0, 5);
    const hash = passwordHash.substring(5).toUpperCase();

    const { data: response } = await axios.get<string>(
        `https://api.pwnedpasswords.com/range/${rangeHash}`
    );

    const lines = response.split('\r\n');

    for (const line of lines) {
        const lineSplitted = line.split(':');

        if (lineSplitted[0] === hash) {
            return {
                found: lineSplitted[1],
            };
        }
    }

    return null;
}

export default verifyPassword;
