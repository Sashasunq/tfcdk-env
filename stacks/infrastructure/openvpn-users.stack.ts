import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Eip } from '@cdktf/provider-aws/lib/eip';
import { EipAssociation } from '@cdktf/provider-aws/lib/eip-association';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class OpenvpnUsersStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack, securityGroups: SecurityGroupsStack) {
        super(scope, id);

        const eip = new Eip(this, `eip-openvpn-users`, {
            vpc: true,
            tags: {
                Name: `${env.name}-openvpn-users`,
            },
        });

        const instance = new Instance(scope, `ec2-instance-openvpn-users`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPublicSubnet,
            instanceType: env.instanceType('t3a.micro'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            associatePublicIpAddress: true,
            tags: {
                Name: 'openvpn-users',
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 20,
                tags: {
                    Name: 'openvpn-users',
                    'map-migrated': 'd-server-03dzumw9gsnx0k',
                },
            },
            sourceDestCheck: false,
            vpcSecurityGroupIds: [securityGroups.get('default'), securityGroups.get('openvpn'), securityGroups.get('ssh')],
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['openvpn'],
                services: [{ name: 'openvpn-users', global: false, public: true }],
            }),
        });

        new EipAssociation(this, `eip-association-openvpn-users`, {
            allocationId: eip.id,
            instanceId: instance.id,
        });
    }
}
