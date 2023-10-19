import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class OpenvpnNagiosStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack, securityGroups: SecurityGroupsStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-openvpn-nagios`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPublicSubnet,
            instanceType: env.instanceType('t3a.micro'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            associatePublicIpAddress: true,
            tags: {
                Name: 'openvpn-nagios',
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 10,
                tags: {
                    Name: 'openvpn-nagios',
                    'map-migrated': 'd-server-03dzumw9gsnx0k',
                },
            },
            sourceDestCheck: false,
            vpcSecurityGroupIds: [securityGroups.get('default'), securityGroups.get('openvpn')],
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['openvpn'],
                services: [{ name: 'openvpn-nagios', global: false, public: true }],
            }),
        });
    }
}
