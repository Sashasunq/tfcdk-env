import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { KeyPair } from '@cdktf/provider-aws/lib/key-pair';

export class KeypairStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment) {
        super(scope, id);

        for (const pair of env.keypairs) {
            new KeyPair(this, env.name, {
                keyName: pair.name,
                publicKey: pair.publicKey,
            });
        }
    }
}
