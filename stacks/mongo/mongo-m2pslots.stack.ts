import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class MongoM2pSlotsStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-m2pslots-mongo`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('m5a.xlarge'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'm2pslots-103-mongo',
                'map-migrated': 'd-server-00v60q4dn8lkye',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 50,
                tags: {
                    Name: 'm2pslots-mongo',
                    'map-migrated': 'd-server-00v60q4dn8lkye',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['mongodb'],
                services: [
                    { name: 'm2pslots-103-mongo', global: true },
                    { name: 'm2pslots-104-mongo', global: true },
                ],
            }),
            ebsBlockDevice: [
                {
                    deviceName: '/dev/xvdb',
                    volumeType: 'gp3',
                    volumeSize: 50,
                    tags: {
                        Name: 'm2pslots-103-mongo-data',
                    },
                },
            ],
        });
    }
}
