import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class MongoRetrocasinoStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack, securityGroups: SecurityGroupsStack) {
        super(scope, id);

        const instanceNumber = '01';

        new Instance(scope, `ec2-instance-retrocasino-105-mongo-${instanceNumber}`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.small'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: `retrocasino-105-mongo-${instanceNumber}`,
                'map-migrated': 'd-server-007g7pg1t4duty',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 100,
                tags: {
                    Name: `retrocasino-105-mongo-${instanceNumber}`,
                    'map-migrated': 'd-server-007g7pg1t4duty',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                launchConfig: 'mongo-retrocasino',
                services: [{ name: `retrocasino-105-mongo-${instanceNumber}`, global: true }],
            }),
            ebsBlockDevice: [
                {
                    deviceName: '/dev/xvdb',
                    volumeType: 'gp3',
                    volumeSize: 50,
                    tags: {
                        Name: `retrocasino-105-mongo-${instanceNumber}-data`,
                        'map-migrated': 'd-server-007g7pg1t4duty',
                    },
                },
            ],
            vpcSecurityGroupIds: [securityGroups.get('default'), securityGroups.get('data-dept-mongodb')],
        });
    }
}
