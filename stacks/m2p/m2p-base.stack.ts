import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsSubnets } from '@cdktf/provider-aws/lib/data-aws-subnets';
import { DataAwsVpc } from '@cdktf/provider-aws/lib/data-aws-vpc';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { LbTargetGroup } from '@cdktf/provider-aws/lib/lb-target-group';
import { LbTargetGroupAttachment } from '@cdktf/provider-aws/lib/lb-target-group-attachment';
import { UserDataUtil } from '../../utils/user-data';
import { randomFnValue } from '../../utils/random-value';

export class M2pBaseStack extends Construct {
    public bookkeeperTargetProduction: LbTargetGroup;
    public bookkeeperTargetRetroProduction: LbTargetGroup;
    public bookkeeperTargetStaging: LbTargetGroup;

    constructor(scope: Construct, id: string, env: BaseEnvironment, data: { vpc: DataAwsVpc; privateSubnets: DataAwsSubnets }) {
        super(scope, id);

        // PRODUCTION
        this.bookkeeperTargetProduction = new LbTargetGroup(scope, `alb-target-m2pslots-103-bookkeeper`, {
            name: 'tgt-m2pslots-103-bookkeeper',
            vpcId: data.vpc.id,
            targetType: 'instance',
            port: 8080,
            protocol: 'HTTP',
            healthCheck: {
                enabled: true,
                protocol: 'HTTP',
                port: '8080',
                path: '/status',
            },
            tags: {
                Project: 'm2pslots-103',
            },
        });

        for (let i = 1; i < 3; i++) {
            const instanceNumber = String(i).padStart(2, '0');

            const instance = new Instance(scope, `ec2-instance-m2pslots-103-bookkeeper-${instanceNumber}`, {
                ami: env.amiDebian11,
                subnetId: randomFnValue(data.privateSubnets.ids, env.vpcConfig.privateSubnets.length),
                instanceType: env.instanceType('t3a.xlarge'),
                keyName: env.defaultKeyName,
                iamInstanceProfile: env.defaultEc2InstanceProfile,
                disableApiTermination: true,
                tags: {
                    Name: `m2pslots-103-bookkeeper-${instanceNumber}`,
                    Project: 'm2pslots-103',
                    'map-migrated': 'd-server-00v60q4dn8lkye',
                },
                rootBlockDevice: {
                    volumeType: 'gp3',
                    volumeSize: 30,
                    tags: {
                        Name: `m2pslots-103-bookkeeper-${instanceNumber}`,
                        Project: 'm2pslots-103',
                        'map-migrated': 'd-server-00v60q4dn8lkye',
                    },
                },
                lifecycle: {
                    ignoreChanges: env.defaultLifecycleIgnoreChanges,
                },
                userData: UserDataUtil.generateBootstrap({
                    roles: ['nodejs'],
                    services: [{ name: `m2pslots-103-bookkeeper-${instanceNumber}`, global: false }],
                }),
            });

            new LbTargetGroupAttachment(scope, `alb-attachment-m2pslots-103-bookkeper-${instanceNumber}`, {
                targetGroupArn: this.bookkeeperTargetProduction.arn,
                targetId: instance.id,
            });
        }

        // RETROCASINO PRODUCTION
        this.bookkeeperTargetRetroProduction = new LbTargetGroup(scope, `alb-target-m2pslots-104-bookkeeper`, {
            name: 'tgt-m2pslots-104-bookkeeper',
            vpcId: data.vpc.id,
            targetType: 'instance',
            port: 8080,
            protocol: 'HTTP',
            healthCheck: {
                enabled: true,
                protocol: 'HTTP',
                port: '8080',
                path: '/status',
            },
            tags: {
                Project: 'm2pslots-104',
            },
        });

        const instanceRetro = new Instance(scope, `ec2-instance-m2pslots-104-bookkeeper-01`, {
            ami: env.amiDebian11,
            subnetId: randomFnValue(data.privateSubnets.ids, env.vpcConfig.privateSubnets.length),
            instanceType: env.instanceType('t3a.micro'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: `m2pslots-104-bookkeeper-01`,
                Project: 'm2pslots-104',
                'map-migrated': 'd-server-00v60q4dn8lkye',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 30,
                tags: {
                    Name: `m2pslots-104-bookkeeper-01`,
                    Project: 'm2pslots-104',
                    'map-migrated': 'd-server-00v60q4dn8lkye',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['nodejs'],
                services: [{ name: `m2pslots-104-bookkeeper-01`, global: false }],
            }),
        });

        new LbTargetGroupAttachment(scope, `alb-attachment-m2pslots-104-bookkeper-01`, {
            targetGroupArn: this.bookkeeperTargetRetroProduction.arn,
            targetId: instanceRetro.id,
        });

        // STAGING
        this.bookkeeperTargetStaging = new LbTargetGroup(scope, `alb-target-m2pslots-1103-bookkeeper`, {
            name: 'tgt-m2pslots-1103-bookkeeper',
            vpcId: data.vpc.id,
            targetType: 'instance',
            port: 8080,
            protocol: 'HTTP',
            healthCheck: {
                enabled: true,
                protocol: 'HTTP',
                port: '8080',
                path: '/status',
            },
            tags: {
                Project: 'm2pslots-1103',
            },
        });

        const instanceStaging = new Instance(scope, `ec2-instance-m2pslots-1103-bookkeeper-01`, {
            ami: env.amiDebian11,
            subnetId: randomFnValue(data.privateSubnets.ids, env.vpcConfig.privateSubnets.length),
            instanceType: env.instanceType('t3a.medium'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: `m2pslots-1103-bookkeeper-01`,
                Project: 'm2pslots-1103',
                'map-migrated': 'd-server-00v60q4dn8lkye',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 30,
                tags: {
                    Name: `m2pslots-1103-bookkeeper-01`,
                    Project: 'm2pslots-1103',
                    'map-migrated': 'd-server-00v60q4dn8lkye',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['nodejs'],
                services: [{ name: `m2pslots-1103-bookkeeper-01`, global: false }],
            }),
        });

        new LbTargetGroupAttachment(scope, `alb-attachment-m2pslots-1103-bookkeper-01`, {
            targetGroupArn: this.bookkeeperTargetStaging.arn,
            targetId: instanceStaging.id,
        });
    }
}
