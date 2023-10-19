import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class GitlabRunnerStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        for (let i = 0; i < 2; i++) {
            const instanceNumber = String(i + 1).padStart(2, '0');

            new Instance(scope, `ec2-instance-gitlab-runner-${instanceNumber}`, {
                ami: env.amiDebian11,
                subnetId: vpc.randomPrivateSubnet,
                instanceType: env.instanceType('t3a.medium'),
                keyName: env.defaultKeyName,
                iamInstanceProfile: env.defaultEc2InstanceProfile,
                tags: {
                    Name: `gitlab-runner-${instanceNumber}`,
                },
                rootBlockDevice: {
                    volumeType: 'gp3',
                    volumeSize: 100,
                    tags: {
                        Name: `gitlab-runner-${instanceNumber}`,
                        'map-migrated': 'd-server-03dzumw9gsnx0k',
                    },
                },
                lifecycle: {
                    ignoreChanges: env.defaultLifecycleIgnoreChanges,
                },
                userData: UserDataUtil.generateBootstrap({
                    services: [{ name: `gitlab-runner-${instanceNumber}`, global: true }],
                }),
            });
        }
    }
}
