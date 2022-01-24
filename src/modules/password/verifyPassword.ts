import axios from 'axios';
import crypto from 'crypto';
import { requestPassword } from '../../utils/requestPassword';

async function verifyPassword(password?: string) {
    let _password;
    if (!password) {
        _password = await requestPassword();
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
