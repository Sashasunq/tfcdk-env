import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Eip } from '@cdktf/provider-aws/lib/eip';
import { EipAssociation } from '@cdktf/provider-aws/lib/eip-association';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class LegacySslStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack, securityGroups: SecurityGroupsStack) {
        super(scope, id);

        const eip = new Eip(this, `eip-legacy-ssl`, {
            vpc: true,
            tags: {
                Name: `${env.name}-legacy-ssl`,
            },
        });

        const instance = new Instance(scope, `ec2-instance-legacy-ssl`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPublicSubnet,
            instanceType: env.instanceType('m5.large'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'legacy-ssl',
                'map-migrated': 'd-server-012788m5147yux',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 30,
                tags: {
                    Name: 'legacy-ssl',
                    'map-migrated': 'd-server-012788m5147yux',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            vpcSecurityGroupIds: [securityGroups.get('default'), securityGroups.get('http'), securityGroups.get('https')],
            associatePublicIpAddress: true,
            userData: UserDataUtil.generateBootstrap({
                roles: ['haproxy'],
                services: [
                    { name: 'hlb-legacy-ssl', global: true, public: true },
                    { name: 'legacy-ssl', global: true, public: true },
                ],
            }),
        });

        new EipAssociation(this, `eip-association-legacy-ssl`, {
            allocationId: eip.id,
            instanceId: instance.id,
        });
    }
}
