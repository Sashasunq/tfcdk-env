import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { VpcStack } from '../base/vpc.stack';

export class AcpServerStack extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, _vpc: VpcStack, _securityGroups: SecurityGroupsStack) {
        super(scope, id);

        /*
        new Instance(scope, `ec2-instance-acp-php8`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPublicSubnet,
            instanceType: env.instanceType('t3a.medium'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            tags: {
                Name: 'acp-php8',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 30,
                tags: {
                    Name: 'acp-php8',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            vpcSecurityGroupIds: [securityGroups.get('default'), securityGroups.get('http')],
            associatePublicIpAddress: true,
            userData: UserDataUtil.generateBootstrap({
                roles: ['webserver'],
                services: [
                    { name: 'suite-98-acp', global: true, public: true },
                    { name: 'suite-98-cockpit', global: true, public: true },
                ],
            }),
        });
        */
    }
}
