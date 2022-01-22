import crypto from 'crypto';

function decrypt(content: string, secretKey: string) {
    const splitedContent = content.split('$.');

    const iv = splitedContent[0];
    const authTag = splitedContent[1];
    const _content = splitedContent[2];

    const decipher = crypto.createDecipheriv('aes-256-gcm', secretKey, iv);

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let str = decipher.update(_content, 'hex', 'utf8');
    str += decipher.final('utf8');

    return str;
}

export { decrypt };
