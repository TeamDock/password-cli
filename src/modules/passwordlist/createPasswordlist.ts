import path from 'path';
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { APPDATA } from '../../utils/paths';
import { generatePassword } from '../password';
import { encrypt } from '../../utils/encrypt';
import { PasswordList } from '../../@types/passwordlist';

function createPasswordlist(name: string) {
    const passwordsPath = path.join(APPDATA, 'passwordlist');
    mkdirSync(passwordsPath, { recursive: true });

    if (name && existsSync(path.join(passwordsPath, name))) {
        throw new Error('There is already a password list with that name');
    }

    const defaultSettings = [] as PasswordList[];

    const password = generatePassword({
        length: '32',
        numbers: true,
        symbols: true,
    });

    const encryptedData = encrypt(JSON.stringify(defaultSettings), password);
    appendFileSync(path.join(passwordsPath, name), encryptedData, {
        mode: 0o700,
    });

    return password;
}

export default createPasswordlist;
