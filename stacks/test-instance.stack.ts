import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../utils/user-data';
import { VpcStack } from './base/vpc.stack';

export class TestInstanceStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        vpc: VpcStack,
        cfg: { name?: string; instanceNumber?: string; diskSize: number },
    ) {
        super(scope, id);

        const name = `${cfg.name ?? 'test'}-${cfg.instanceNumber ?? '01'}`;

        new Instance(scope, `ec2-instance-${name}`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3.small'),
            keyName: env.defaultKeyName,
            tags: {
                Name: name,
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: cfg.diskSize ?? 30,
                tags: {
                    Name: name,
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                services: [{ name }],
            }),
        });
    }
}
