import { Construct } from 'constructs';
import { DbInstance } from '@cdktf/provider-aws/lib/db-instance';
import { DbProxy } from '@cdktf/provider-aws/lib/db-proxy';
import { VpcStack } from '../base/vpc.stack';
import { IamRole } from '@cdktf/provider-aws/lib/iam-role';
import { RdsSecret } from './rds-proxy-secret';
import { RdsBaseStack } from './rds-base.stack';

export class RdsProxyInstanceStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        vpcStack: VpcStack,
        rdsBaseStack: RdsBaseStack,
        dbInstance: DbInstance,
        iamRole: IamRole
    ) {
        super(scope, id);

        const rdsSecret = new RdsSecret(this, 'proxy-secret-'+dbInstance.id,'proxy-secret', rdsBaseStack.adminPassword.value);

        new DbProxy(this,
            id,
            {
                engineFamily: 'MYSQL',
                name: 'proxy-'+dbInstance.id,
                roleArn: iamRole.arn,
                auth: [
                    {
                        authScheme: "SECRETS",
                        iamAuth: "DISABLED",
                        secretArn: rdsSecret.secret.arn,
                    }
                ],
                vpcSubnetIds: vpcStack.privateSubnets,
            });
    }
}
