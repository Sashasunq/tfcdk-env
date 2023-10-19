import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';
import { LbTargetGroup } from '@cdktf/provider-aws/lib/lb-target-group';
import { LbTargetGroupAttachment } from '@cdktf/provider-aws/lib/lb-target-group-attachment';

export class GrafanaStack extends Construct {
    public lbTarget: LbTargetGroup;

    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        this.lbTarget = new LbTargetGroup(scope, `alb-target-grafana-pub`, {
            name: 'tgt-grafana-pub',
            vpcId: vpc.vpcId,
            targetType: 'instance',
            port: 8080,
            protocol: 'HTTP',
        });

        const instance = new Instance(scope, `ec2-instance-grafana`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('m5a.4xlarge'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'grafana',
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 1000,
                tags: {
                    Name: 'grafana',
                    'map-migrated': 'd-server-03dzumw9gsnx0k',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['grafana', 'influxdb', 'mysql', 'webserver'],
                services: [{ name: 'grafana' }, { name: 'influxdb' }],
            }),
        });

        new LbTargetGroupAttachment(scope, 'alb-attachement-grafana-pub', {
            targetGroupArn: this.lbTarget.arn,
            targetId: instance.id,
        });
    }
}
