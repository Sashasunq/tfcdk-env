import { AmqpConfig, BaseEnvironment } from '../../environments/base-environment';

import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class AmqpStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        config: AmqpConfig,
        vpc: VpcStack,
        securityGroups: SecurityGroupsStack,
    ) {
        super(scope, id);

        new Instance(scope, `ec2-instance-${config.name}`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType(config.instanceType),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: config.name,
                'map-migrated': 'd-server-012788m5147yux',
            },
            rootBlockDevice: {
                volumeType: config.diskType,
                volumeSize: config.diskSize,
                tags: {
                    Name: config.name,
                    'map-migrated': 'd-server-012788m5147yux',
                },
            },
            vpcSecurityGroupIds: [securityGroups.get('default'), securityGroups.get('data-dept-amqp')],
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['rabbitmq'],
                services: [{ name: config.name, global: true }],
            }),
        });
    }
}
