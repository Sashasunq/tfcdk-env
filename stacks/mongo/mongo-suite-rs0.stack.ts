import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class MongoSuiteRs0Stack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        for (let i = 0; i < 3; i++) {
            const instanceNumber = String(i + 1).padStart(2, '0');

            new Instance(scope, `ec2-instance-suite-98-mongo-rs0-${instanceNumber}`, {
                ami: env.amiDebian11,
                subnetId: vpc.privateSubnets[i],
                // TWO INSTANCES ARE FULL SCALE, ONE HAS LESS POWER
                instanceType: i === 2 ? env.instanceType('r6i.2xlarge') : env.instanceType('r6i.12xlarge'),
                keyName: env.defaultKeyName,
                iamInstanceProfile: env.defaultEc2InstanceProfile,
                disableApiTermination: true,
                tags: {
                    Name: `suite-98-mongo-rs0-${instanceNumber}`,
                    'map-migrated': 'd-server-03gzbh4tcgtcwp',
                },
                rootBlockDevice: {
                    volumeType: 'gp3',
                    volumeSize: 500,
                    throughput: 250,
                    iops: 4000,
                    tags: {
                        Name: `suite-98-mongo-rs0-${instanceNumber}`,
                        'map-migrated': 'd-server-03gzbh4tcgtcwp',
                    },
                },
                lifecycle: {
                    ignoreChanges: env.defaultLifecycleIgnoreChanges,
                },
                userData: UserDataUtil.generateBootstrap({
                    launchConfig: 'mongo-suite-rs0',
                    services: [{ name: `suite-98-mongo-rs0-${instanceNumber}`, global: true }],
                }),
                ebsBlockDevice: [
                    {
                        deviceName: '/dev/xvdb',
                        volumeType: 'gp3',
                        volumeSize: 500,
                        throughput: 250,
                        iops: 4000,
                        tags: {
                            Name: `suite-98-mongo-rs0-${instanceNumber}-data`,
                            'map-migrated': 'd-server-03gzbh4tcgtcwp',
                        },
                    },
                ],
            });
        }
    }
}
