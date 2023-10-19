import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class RedisRetrocasinoStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-retrocasino-redis`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.small'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'retrocasino-105-redis',
                'map-migrated': 'd-server-007g7pg1t4duty',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 50,
                tags: {
                    Name: 'retrocasino-105-redis',
                    'map-migrated': 'd-server-007g7pg1t4duty',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['redis'],
                services: [{ name: `retrocasino-105-redis`, global: true }],
            }),
        });
    }
}
