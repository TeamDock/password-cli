import { generatePassword } from '../../../src/modules/password';

test('testing generatePassword', () => {
    const generatedPassword = generatePassword({
        symbols: true,
        numbers: true,
        length: '50',
    });

    expect(generatedPassword).toHaveLength(50);
});
