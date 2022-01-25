import path from 'path';
import { readFileSync } from 'fs';
import { APPDATA } from '../../utils/paths';

function loadPreset(name: string) {
    const presetPath = path.join(APPDATA, 'presets', name + '.preset');

    return readFileSync(presetPath).toString();
}

export { loadPreset };
