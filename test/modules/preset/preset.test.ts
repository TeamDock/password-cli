import { rmSync } from 'fs';
import path from 'path';
import { loadPreset } from '../../../src/modules/preset/loadPreset';
import { setPreset } from '../../../src/modules/preset/setPreset';
import { APPDATA } from '../../../src/utils/paths';

test('testing loadPreset and setPreset', () => {
    const presetName = 'preset-test';
    setPreset(presetName, 'test');

    expect(loadPreset(presetName)).toBe('test');

    // Clean up
    const presetPath = path.join(APPDATA, 'presets', `${presetName}.preset`);
    rmSync(presetPath);
});
