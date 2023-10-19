import { Construct } from 'constructs';
import { EbsEncryptionByDefault } from '@cdktf/provider-aws/lib/ebs-encryption-by-default';
import { SecretsmanagerSecret } from '@cdktf/provider-aws/lib/secretsmanager-secret';


export class SecurityStack extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new EbsEncryptionByDefault(scope, 'aws-ebs-encryption', { enabled: true });




        new SecretsmanagerSecret(scope, 'rds-proxy-secret', {});
    }
}
