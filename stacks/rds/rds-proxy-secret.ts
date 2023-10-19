import { Construct } from 'constructs';
import { SecretsmanagerSecret, SecretsmanagerSecretVersion } from '@cdktf/provider-aws';

export class RdsSecret extends Construct {
    public readonly secret: SecretsmanagerSecret;

    constructor(scope: Construct, id: string, smId: string, adminPassword: string) {
        super(scope, id);

        this.secret = new SecretsmanagerSecret(this, smId, {
            name: smId,
            description: "Secret for RDS Proxy Authentication"
        });

        new SecretsmanagerSecretVersion(this, `${id}-version`, {
            secretId: this.secret.name,
            secretString: JSON.stringify({
                username: 'admin',
                password: adminPassword
            })
        });
    }
}
