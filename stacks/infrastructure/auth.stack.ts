import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { LbTargetGroup } from '@cdktf/provider-aws/lib/lb-target-group';
import { LbTargetGroupAttachment } from '@cdktf/provider-aws/lib/lb-target-group-attachment';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class AuthStack extends Construct {
    public lbTarget: LbTargetGroup;

    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        this.lbTarget = new LbTargetGroup(scope, `alb-target-auth`, {
            name: 'tgt-auth',
            vpcId: vpc.vpcId,
            targetType: 'instance',
            port: 80,
            protocol: 'HTTP',
        });

        const instance = new Instance(scope, `ec2-instance-auth`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.small'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'auth',
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 30,
                tags: {
                    Name: 'auth',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['webserver'],
                services: [{ name: 'auth', global: true }, { name: 'auth-11-cron-01' }, { name: 'auth-11-www' }],
            }),
        });

        new LbTargetGroupAttachment(scope, 'alb-attachement-auth', {
            targetGroupArn: this.lbTarget.arn,
            targetId: instance.id,
        });
    }
}
