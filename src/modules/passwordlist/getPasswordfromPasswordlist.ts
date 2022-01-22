import { readPasswordlist } from '.';
import { PasswordList } from '../../@types/passwordlist';

function getPasswordfromPasswordlist(
    passwordlist: string,
    passwordname: string,
    password: string // password of passwordlist
) {
    const decryptedPasswordList = JSON.parse(
        readPasswordlist(passwordlist, password)
    ) as PasswordList[];

    for (const passwordElement of decryptedPasswordList) {
        if (passwordElement.name === passwordname) {
            return passwordElement.password;
        }
    }

    return null;
}

export default getPasswordfromPasswordlist;
