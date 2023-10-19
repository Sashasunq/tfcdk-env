import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class DevproxyStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack, securityGroups: SecurityGroupsStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-devproxy`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPublicSubnet,
            instanceType: env.instanceType('t3a.micro'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'devproxy',
                'map-migrated': 'd-server-012788m5147yux',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 20,
                tags: {
                    Name: 'devproxy',
                    'map-migrated': 'd-server-012788m5147yux',
                },
            },
            vpcSecurityGroupIds: [securityGroups.get('default'), securityGroups.get('http')],
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            associatePublicIpAddress: true,
            userData: UserDataUtil.generateBootstrap({
                roles: ['webserver'],
                services: [{ name: 'devproxy', global: true, public: true }],
            }),
        });
    }
}
