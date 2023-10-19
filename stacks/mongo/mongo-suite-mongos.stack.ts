import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class MongoSuiteMongosStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack, securityGroups: SecurityGroupsStack) {
        super(scope, id);

        for (let i = 0; i < 4; i++) {
            const instanceNumber = String(i + 1).padStart(2, '0');

            new Instance(scope, `ec2-instance-suite-98-mongos-${instanceNumber}`, {
                ami: env.amiDebian11,
                subnetId: vpc.privateSubnets[i % 3],
                instanceType: env.instanceType('r5.2xlarge'),
                keyName: env.defaultKeyName,
                iamInstanceProfile: env.defaultEc2InstanceProfile,
                disableApiTermination: true,
                vpcSecurityGroupIds: [securityGroups.get('default'), securityGroups.get('data-dept-mongodb')],
                tags: {
                    Name: `suite-98-mongos-${instanceNumber}`,
                    'map-migrated': 'd-server-03gzbh4tcgtcwp',
                },
                rootBlockDevice: {
                    volumeType: 'gp3',
                    volumeSize: 30,
                    tags: {
                        Name: `suite-98-mongos-${instanceNumber}`,
                        'map-migrated': 'd-server-03gzbh4tcgtcwp',
                    },
                },
                lifecycle: {
                    ignoreChanges: env.defaultLifecycleIgnoreChanges,
                },
                userData: UserDataUtil.generateBootstrap({
                    launchConfig: 'mongo-suite-mongos',
                    services: [{ name: `suite-98-mongos-${instanceNumber}`, global: true }],
                }),
            });
        }
    }
}
