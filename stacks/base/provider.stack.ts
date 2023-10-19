import { AwsProvider } from '@cdktf/provider-aws/lib/provider';
import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';

export class ProviderStack extends Construct {
    public awsDefault: AwsProvider;
    public awsUsEast1: AwsProvider;

    constructor(scope: Construct, id: string, env: BaseEnvironment) {
        super(scope, id);

        this.awsDefault = new AwsProvider(this, 'aws', {
            region: 'eu-central-1',
            allowedAccountIds: [env.awsAccountId],
        });

        this.awsUsEast1 = new AwsProvider(this, 'aws-us-east-1', {
            region: 'us-east-1',
            allowedAccountIds: [env.awsAccountId],
            alias: 'aws-us-east-1',
        });
    }
}
