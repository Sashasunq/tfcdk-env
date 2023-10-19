import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class LoadStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-load`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.nano'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            tags: {
                Name: 'load',
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 10,
                tags: {
                    Name: 'load',
                    'map-migrated': 'd-server-03dzumw9gsnx0k',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['webserver'],
                services: [{ name: 'load', global: true }],
            }),
        });
    }
}
