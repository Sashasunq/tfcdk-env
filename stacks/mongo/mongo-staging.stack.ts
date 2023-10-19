import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class MongoStagingStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-staging-mongo`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.large'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: `staging-mongo`,
                'map-migrated': 'd-server-02guyzx9n89e3r',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 100,
                tags: {
                    Name: `staging-mongo`,
                    'map-migrated': 'd-server-02guyzx9n89e3r',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['mongodb'],
                services: [
                    { name: 'staging-mongo', global: true },
                    { name: 'mongo-rs3-01', global: true },
                    { name: 'offerai-1054-mongo-rs3-01', global: true },
                    { name: 'suite-1098-mongo-rs3-01', global: true },
                    { name: 'm2pslots-1103-mongo', global: true },
                ],
            }),
            ebsBlockDevice: [
                {
                    deviceName: '/dev/xvdb',
                    volumeType: 'gp3',
                    volumeSize: 100,
                    tags: {
                        Name: `staging-mongo-data`,
                        'map-migrated': 'd-server-02guyzx9n89e3r',
                    },
                },
            ],
        });
    }
}
