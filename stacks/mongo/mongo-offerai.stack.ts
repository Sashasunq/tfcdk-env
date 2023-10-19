import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class MongoOfferaiStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        const instanceNumber = '01';

        new Instance(scope, `ec2-instance-offerai-54-mongo-${instanceNumber}`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('m6a.large'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: `offerai-54-mongo-${instanceNumber}`,
                'map-migrated': 'd-server-03gzbh4tcgtcwp',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 30,
                tags: {
                    Name: `offerai-54-mongo-${instanceNumber}`,
                    'map-migrated': 'd-server-03gzbh4tcgtcwp',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                launchConfig: 'mongo-offerai',
                services: [{ name: `offerai-54-mongo-${instanceNumber}`, global: true }],
            }),
            ebsBlockDevice: [
                {
                    deviceName: '/dev/xvdb',
                    volumeType: 'gp3',
                    volumeSize: 30,
                    tags: {
                        Name: `offerai-54-mongo-${instanceNumber}-data`,
                        'map-migrated': 'd-server-03gzbh4tcgtcwp',
                    },
                },
            ],
        });
    }
}
