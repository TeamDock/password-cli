import crypto from 'crypto';

function encrypt(content: string, secretKey: string) {
    const iv = crypto.randomBytes(16).toString('hex');

    const cipher = crypto.createCipheriv('aes-256-gcm', secretKey, iv);

    let enc = cipher.update(content, 'utf8', 'hex');
    enc += cipher.final('hex');

    return `${iv}$.${cipher.getAuthTag().toString('hex')}$.${enc}`;
}

export { encrypt };
