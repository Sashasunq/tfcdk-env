import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class JusyncStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-jusync`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('r6a.4xlarge'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: `jusync`,
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 1000,
                tags: {
                    Name: `jusync`,
                    'map-migrated': 'd-server-03dzumw9gsnx0k',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['mongodb', 'webserver'],
                services: [
                    { name: 'jusync', global: true },
                    { name: 'jusync-4-cron-01' },
                    { name: 'jusync-4-mongo-01' },
                    { name: 'jusync-4-www' },
                ],
            }),
            ebsBlockDevice: [
                {
                    deviceName: '/dev/xvdb',
                    volumeType: 'gp3',
                    volumeSize: 500,
                    tags: {
                        Name: `jusync-data`,
                        'map-migrated': 'd-server-03dzumw9gsnx0k',
                    },
                },
            ],
        });
    }
}
