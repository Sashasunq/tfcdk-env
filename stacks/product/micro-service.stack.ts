import { BaseEnvironment, MicroServiceConfig } from '../../environments/base-environment';

import { Construct } from 'constructs';
import { Eip } from '@cdktf/provider-aws/lib/eip';
import { EipAssociation } from '@cdktf/provider-aws/lib/eip-association';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { LbTargetGroup } from '@cdktf/provider-aws/lib/lb-target-group';
import { LbTargetGroupAttachment } from '@cdktf/provider-aws/lib/lb-target-group-attachment';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class MicroServiceStack extends Construct {
    public lbTarget?: LbTargetGroup;

    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        config: MicroServiceConfig,
        vpc: VpcStack,
        securityGroups: SecurityGroupsStack,
    ) {
        super(scope, id);

        let number = 0;

        const bootstrapOptions = config.bootstrap ?? {
            roles: ['haproxy', 'nodejs'],
            services: [
                {
                    name: `${config.name}-{{instanceNumber}}`,
                    global: true,
                },
            ],
        };

        if (config.lbTarget) {
            this.lbTarget = new LbTargetGroup(scope, `alb-target-${config.name}`, {
                name: `tgt-${config.name}`,
                vpcId: vpc.vpcId,
                targetType: 'instance',
                port: config.lbTargetPort ?? 8080,
                protocol: 'HTTP',
                healthCheck: config.lbTargetHealthCheck ?? undefined,
            });
        }

        if (config.privateNodes) {
            for (let i = 0; i < config.privateNodes; i++) {
                number++;

                const instanceNumber = String(number).padStart(2, '0');

                const instanceBootstrapOptions = structuredClone(bootstrapOptions);

                if (instanceBootstrapOptions.services) {
                    for (const elm of instanceBootstrapOptions.services) {
                        elm.name = elm.name.replace('{{instanceNumber}}', instanceNumber);
                    }
                }

                const instance = new Instance(scope, `ec2-instance-${config.name}-${instanceNumber}`, {
                    ami: env.amiDebian11,
                    subnetId: vpc.randomPrivateSubnet,
                    instanceType: env.instanceType(config.instanceType),
                    keyName: env.defaultKeyName,
                    iamInstanceProfile: env.defaultEc2InstanceProfile,
                    tags: {
                        Name: `${config.name}-node-${instanceNumber}`,
                        ...config.additionalTags,
                    },
                    rootBlockDevice: {
                        volumeType: 'gp3',
                        volumeSize: config.volumeSize ?? 30,
                        tags: {
                            Name: `${config.name}-node-${instanceNumber}`,
                            ...config.additionalTags,
                        },
                    },
                    lifecycle: {
                        ignoreChanges: env.defaultLifecycleIgnoreChanges,
                    },
                    userData: UserDataUtil.generateBootstrap(instanceBootstrapOptions),
                });

                if (config.lbTarget && this.lbTarget?.arn) {
                    new LbTargetGroupAttachment(scope, `alb-attachement-${config.name}-${instanceNumber}`, {
                        targetGroupArn: this.lbTarget.arn,
                        targetId: instance.id,
                    });
                }
            }
        }

        if (config.publicNodes) {
            for (let i = 0; i < config.publicNodes; i++) {
                number++;

                const instanceNumber = String(number).padStart(2, '0');

                const instanceBootstrapOptions = structuredClone(bootstrapOptions);

                if (instanceBootstrapOptions.services) {
                    for (const elm of instanceBootstrapOptions.services) {
                        elm.name = elm.name.replace('{{instanceNumber}}', instanceNumber);
                    }
                }

                const additionalSecurityGroups: string[] = [];

                if (config.additionalSecurityGroups) {
                    for (const group of config.additionalSecurityGroups) {
                        additionalSecurityGroups.push(securityGroups.get(group));
                    }
                }

                const eip = new Eip(this, `eip-${config.name}-${instanceNumber}`, {
                    vpc: true,
                    tags: {
                        Name: `${env.name}-${config.name}-${instanceNumber}`,
                    },
                });

                const instance = new Instance(scope, `ec2-instance-${config.name}-${instanceNumber}`, {
                    ami: env.amiDebian11,
                    subnetId: vpc.randomPublicSubnet,
                    instanceType: env.instanceType(config.instanceType),
                    keyName: env.defaultKeyName,
                    iamInstanceProfile: env.defaultEc2InstanceProfile,
                    tags: {
                        Name: `${config.name}-node-${instanceNumber}`,
                        ...config.additionalTags,
                    },
                    rootBlockDevice: {
                        volumeType: 'gp3',
                        volumeSize: config.volumeSize ?? 30,
                        tags: {
                            Name: `${config.name}-node-${instanceNumber}`,
                            ...config.additionalTags,
                        },
                    },
                    lifecycle: {
                        ignoreChanges: env.defaultLifecycleIgnoreChanges,
                    },
                    vpcSecurityGroupIds: [...additionalSecurityGroups, securityGroups.get('default'), securityGroups.get('https')],
                    associatePublicIpAddress: true,
                    userData: UserDataUtil.generateBootstrap(instanceBootstrapOptions),
                });

                new EipAssociation(this, `eip-association-${config.name}-${instanceNumber}`, {
                    allocationId: eip.id,
                    instanceId: instance.id,
                });

                if (config.lbTarget && this.lbTarget?.arn) {
                    new LbTargetGroupAttachment(scope, `alb-attachement-${config.name}-${instanceNumber}`, {
                        targetGroupArn: this.lbTarget.arn,
                        targetId: instance.id,
                    });
                }
            }
        }
    }
}
