import { BaseEnvironment, M2pSlotConfig } from '../../environments/base-environment';

import { Construct } from 'constructs';
import { DataAwsSubnets } from '@cdktf/provider-aws/lib/data-aws-subnets';
import { DataAwsVpc } from '@cdktf/provider-aws/lib/data-aws-vpc';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { LbTargetGroup } from '@cdktf/provider-aws/lib/lb-target-group';
import { LbTargetGroupAttachment } from '@cdktf/provider-aws/lib/lb-target-group-attachment';
import { UserDataUtil } from '../../utils/user-data';
import { randomFnValue } from '../../utils/random-value';

export class M2pSlotStack extends Construct {
    public lbTarget: LbTargetGroup;

    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        config: M2pSlotConfig,
        data: { vpc: DataAwsVpc; privateSubnets: DataAwsSubnets },
    ) {
        super(scope, id);

        const project = `m2pslots-${config.name.replace('m2pslots-', '').match(/\d/g)?.join('')}`;

        this.lbTarget = new LbTargetGroup(scope, `alb-target-${config.name}`, {
            name: `tgt-${config.name}`,
            vpcId: data.vpc.id,
            targetType: 'instance',
            port: 8080,
            protocol: 'HTTP',
            healthCheck: {
                enabled: true,
                protocol: 'HTTP',
                port: '8080',
                path: '/op/check',
            },
            tags: {
                Project: project,
            },
        });

        // default to 1 instance
        for (let i = 1; i < 2; i++) {
            const instanceNumber = String(i).padStart(2, '0');

            const instance = new Instance(scope, `ec2-instance-${config.name}-${instanceNumber}`, {
                ami: env.amiDebian11,
                subnetId: randomFnValue(data.privateSubnets.ids, env.vpcConfig.privateSubnets.length),
                instanceType: config.instanceType,
                keyName: env.defaultKeyName,
                iamInstanceProfile: env.defaultEc2InstanceProfile,
                disableApiTermination: true,
                tags: {
                    Name: `${config.name}-${instanceNumber}`,
                    Project: project,
                    'map-migrated': 'd-server-00v60q4dn8lkye',
                },
                rootBlockDevice: {
                    volumeType: 'gp3',
                    volumeSize: 30,
                    tags: {
                        Name: `${config.name}-${instanceNumber}`,
                        Project: project,
                        'map-migrated': 'd-server-00v60q4dn8lkye',
                    },
                },
                lifecycle: {
                    ignoreChanges: env.defaultLifecycleIgnoreChanges,
                },
                userData: UserDataUtil.generateBootstrap({
                    services: [{ name: `${config.name}-${instanceNumber}`, global: false }],
                }),
            });

            new LbTargetGroupAttachment(scope, `alb-attachment-${config.name}-${instanceNumber}`, {
                targetGroupArn: this.lbTarget.arn,
                targetId: instance.id,
            });
        }
    }
}
