import { BaseEnvironment, RedisConfig } from '../../environments/base-environment';

import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class RedisInstanceStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, config: RedisConfig, vpc: VpcStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-${config.name}`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType(config.instanceType),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: config.name,
                'map-migrated': 'd-server-01kw06z06wbxxd',
            },
            rootBlockDevice: {
                volumeType: config.diskType,
                volumeSize: config.diskSize,
                throughput: config.diskThroughput,
                tags: {
                    Name: config.name,
                    'map-migrated': 'd-server-01kw06z06wbxxd',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['redis'],
                services: [{ name: config.name, global: true }],
            }),
        });
    }
}
