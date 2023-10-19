import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class JenkinsStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-jenkins`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.medium'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            tags: {
                Name: 'jenkins',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 30,
                tags: {
                    Name: 'jenkins',
                    'map-migrated': 'd-server-03dzumw9gsnx0k',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['jenkins_master', 'webserver'],
                services: [{ name: 'jenkins', global: true }],
            }),
        });

        new Instance(scope, `ec2-instance-jenkins-build-01`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('c6a.2xlarge'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            tags: {
                Name: 'jenkins-build-01',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 200,
                tags: {
                    Name: 'jenkins-build-01',
                    'map-migrated': 'd-server-03dzumw9gsnx0k',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['jenkins_slave'],
                services: [{ name: 'jenkins-build-01', global: true }],
            }),
        });

        new Instance(scope, `ec2-instance-jenkins-build-02`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('c6i.2xlarge'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            tags: {
                Name: 'jenkins-build-02',
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 200,
                tags: {
                    Name: 'jenkins-build-01',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['jenkins_slave'],
                services: [{ name: 'jenkins-build-02', global: true }],
            }),
        });
    }
}
