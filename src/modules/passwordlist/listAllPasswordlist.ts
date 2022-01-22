import path from 'path';
import { readdirSync } from 'fs';
import { APPDATA } from '../../utils/paths';

function listAllPasswordlist() {
    const passwordlistsPath = path.join(APPDATA, 'passwordlist');

    return readdirSync(passwordlistsPath);
}

export default listAllPasswordlist;
