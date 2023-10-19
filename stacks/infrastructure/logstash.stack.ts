import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class LogstashStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        // PRODUCTION
        new Instance(scope, `ec2-instance-logstash`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.xlarge'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'logstash',
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 300,
                tags: {
                    Name: 'logstash',
                    'map-migrated': 'd-server-03dzumw9gsnx0k',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['elasticsearch', 'logstash', 'webserver'],
                services: [
                    { name: 'logstash', global: true },
                    { name: 'kibana', global: true },
                ],
            }),
        });

        // STAGING
        new Instance(scope, `ec2-instance-staging-logstash`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.large'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'staging-logstash',
                'map-migrated': 'd-server-008foujw7yyp7q',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 100,
                tags: {
                    Name: 'staging-logstash',
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['elasticsearch', 'logstash', 'webserver'],
                services: [
                    { name: 'staging-logstash', global: true },
                    { name: 'staging-kibana', global: true },
                ],
            }),
        });
    }
}
