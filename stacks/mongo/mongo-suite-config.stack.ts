import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class MongoSuiteConfigStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        for (let i = 0; i < 3; i++) {
            const instanceNumber = String(i + 1).padStart(2, '0');

            new Instance(scope, `ec2-instance-suite-98-mongo-config-${instanceNumber}`, {
                ami: env.amiDebian11,
                subnetId: vpc.privateSubnets[i],
                instanceType: env.instanceType('m5.large'),
                keyName: env.defaultKeyName,
                iamInstanceProfile: env.defaultEc2InstanceProfile,
                disableApiTermination: true,
                tags: {
                    Name: `suite-98-mongo-config-${instanceNumber}`,
                    'map-migrated': 'd-server-03gzbh4tcgtcwp',
                },
                rootBlockDevice: {
                    volumeType: 'gp3',
                    volumeSize: 30,
                    tags: {
                        Name: `suite-98-mongo-config-${instanceNumber}`,
                        'map-migrated': 'd-server-03gzbh4tcgtcwp',
                    },
                },
                lifecycle: {
                    ignoreChanges: env.defaultLifecycleIgnoreChanges,
                },
                userData: UserDataUtil.generateBootstrap({
                    launchConfig: 'mongo-suite-config',
                    services: [{ name: `suite-98-mongo-config-${instanceNumber}`, global: true }],
                }),
                ebsBlockDevice: [
                    {
                        deviceName: '/dev/xvdb',
                        volumeType: 'gp3',
                        volumeSize: 30,
                        tags: {
                            Name: `suite-98-mongo-config-${instanceNumber}-data`,
                            'map-migrated': 'd-server-03gzbh4tcgtcwp',
                        },
                    },
                ],
            });
        }
    }
}
