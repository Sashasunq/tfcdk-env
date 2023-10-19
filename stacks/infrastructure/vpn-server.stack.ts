import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { VpcStack } from '../base/vpc.stack';

export class VpnServerStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack, zoneId: string, securityGroups: SecurityGroupsStack) {
        super(scope, id);

        const instance = new Instance(scope, `ec2-instance-vpn-server-temporary`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPublicSubnet,
            instanceType: env.instanceType('t3.small'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            tags: {
                Name: 'vpn-temporary',
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 8,
                tags: {
                    Name: 'vpn-temporary',
                    'map-migrated': 'd-server-03dzumw9gsnx0k',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            associatePublicIpAddress: true,
            vpcSecurityGroupIds: [securityGroups.get('default'), securityGroups.get('ssh'), securityGroups.get('openvpn')],
        });

        new Route53Record(scope, `route53-record-vpn-temporary`, {
            zoneId,
            name: 'vpn-temporary',
            type: 'A',
            ttl: 60,
            records: [instance.publicIp],
        });
    }
}
