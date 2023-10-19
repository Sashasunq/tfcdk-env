import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class RedisM2pslotsStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-m2pslots-103-redis`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('m5a.4xlarge'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'm2pslots-103-redis',
                'map-migrated': 'd-server-00v60q4dn8lkye',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 200,
                tags: {
                    Name: 'm2pslots-103-redis',
                    'map-migrated': 'd-server-00v60q4dn8lkye',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['redis'],
                services: [{ name: `m2pslots-103-redis`, global: true }],
            }),
        });

        new Instance(scope, `ec2-instance-m2pslots-104-redis`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.small'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'm2pslots-104-redis',
                'map-migrated': 'd-server-00v60q4dn8lkye',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 50,
                tags: {
                    Name: 'm2pslots-104-redis',
                    'map-migrated': 'd-server-00v60q4dn8lkye',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['redis'],
                services: [{ name: `m2pslots-104-redis`, global: true }],
            }),
        });
    }
}
