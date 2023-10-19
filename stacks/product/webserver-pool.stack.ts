import { BaseEnvironment, WebserverPoolConfig } from '../../environments/base-environment';

import { AutoscalingGroup } from '@cdktf/provider-aws/lib/autoscaling-group';
import { Construct } from 'constructs';
import { LaunchTemplate } from '@cdktf/provider-aws/lib/launch-template';
import { LbTargetGroup } from '@cdktf/provider-aws/lib/lb-target-group';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class WebserverPoolStack extends Construct {
    public lbTarget: LbTargetGroup;

    constructor(scope: Construct, id: string, env: BaseEnvironment, config: WebserverPoolConfig, vpc: VpcStack) {
        super(scope, id);

        const template = new LaunchTemplate(scope, `webserver-${config.name}-template`, {
            ...(config?.instanceType ? { instanceType: env.instanceType(config.instanceType) } : undefined),
            ...(config?.instanceRequirements ? { instanceRequirements: config.instanceRequirements } : undefined),
            name: `${config.name}-template`,
            imageId: env.amiDebian11,
            keyName: env.defaultKeyName,
            iamInstanceProfile: {
                name: env.defaultEc2InstanceProfile,
            },
            blockDeviceMappings: [
                {
                    deviceName: '/dev/xvda',
                    ebs: {
                        volumeType: config.diskType,
                        volumeSize: config.diskSize,
                    },
                },
            ],
            monitoring: {
                enabled: true,
            },
            tagSpecifications: [
                {
                    resourceType: 'instance',
                    tags: {
                        Name: `${config.name}-www`,
                        Cluster: config.name,
                        ...config.additionalTags,
                    },
                },
                {
                    resourceType: 'volume',
                    tags: {
                        Name: `${config.name}-www`,
                        Cluster: config.name,
                        ...config.additionalTags,
                    },
                },
            ],
            userData: Buffer.from(UserDataUtil.generateBootstrap({ launchConfig: config.name })).toString('base64'),
            updateDefaultVersion: true,
        });

        this.lbTarget = new LbTargetGroup(scope, `alb-target-${config.name}`, {
            name: `tgt-${config.name}`,
            vpcId: vpc.vpcId,
            targetType: 'instance',
            port: 80,
            protocol: 'HTTP',
            healthCheck: {
                enabled: true,
                protocol: 'HTTP',
                port: '8275',
                path: '/check.php',
            },
        });

        if (config?.instanceRequirements) {
            new AutoscalingGroup(scope, `webserver-${config.name}-scaling`, {
                name: `${config.name}-scaling`,
                minSize: config.minSize,
                maxSize: config.maxSize,
                mixedInstancesPolicy: {
                    launchTemplate: {
                        launchTemplateSpecification: {
                            launchTemplateId: template.id,
                        },

                        override: [
                            {
                                instanceType: 'c5.xlarge',
                                weightedCapacity: '1',
                            },
                            {
                                instanceType: 'c5.2xlarge',
                                weightedCapacity: '2',
                            },
                            {
                                instanceType: 'c6a.xlarge',
                                weightedCapacity: '1',
                            },
                            {
                                instanceType: 'c6a.2xlarge',
                                weightedCapacity: '2',
                            },
                            {
                                instanceType: 'c6i.xlarge',
                                weightedCapacity: '1',
                            },
                            {
                                instanceType: 'c6i.2xlarge',
                                weightedCapacity: '2',
                            },
                        ],
                    },
                },
                vpcZoneIdentifier: vpc.privateSubnets,
                targetGroupArns: [this.lbTarget.arn],
            });
        } else {
            new AutoscalingGroup(scope, `webserver-${config.name}-scaling`, {
                name: `${config.name}-scaling`,
                minSize: config.minSize,
                maxSize: config.maxSize,
                launchTemplate: {
                    id: template.id,
                },
                vpcZoneIdentifier: vpc.privateSubnets,
                targetGroupArns: [this.lbTarget.arn],
            });
        }
    }
}
