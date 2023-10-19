import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class CronServerStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        // PRODUCTION
        const productionCrons = [
            'kraken-71-cron-01',
            'payment-39-cron-01',
            'prizetool-41-cron-01',
            'retrocasino-105-cron-01',
            'suite-98-cron-01',
            'usercom2-25-cron-01',
        ];

        for (const name of productionCrons) {
            new Instance(scope, `ec2-instance-${name}`, {
                ami: env.amiDebian11,
                subnetId: vpc.randomPrivateSubnet,
                instanceType: env.instanceType('t3a.medium'),
                keyName: env.defaultKeyName,
                iamInstanceProfile: env.defaultEc2InstanceProfile,
                disableApiTermination: true,
                tags: {
                    Name: name,
                },
                rootBlockDevice: {
                    volumeType: 'gp3',
                    volumeSize: 30,
                    tags: {
                        Name: name,
                    },
                },
                lifecycle: {
                    ignoreChanges: env.defaultLifecycleIgnoreChanges,
                },
                userData: UserDataUtil.generateBootstrap({
                    services: [{ name: name, global: true }],
                }),
            });
        }

        // STAGING
        new Instance(scope, `ec2-instance-staging-cron7`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.medium'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'staging-cron7',
                'map-migrated': 'd-server-008foujw7yyp7q',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 100,
                tags: {
                    Name: 'staging-cron7',
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                services: [
                    { name: 'kraken-1071-cron-01', global: true },
                    { name: 'prizetool-1041-cron-01', global: true },
                    { name: 'retrocasino-1105-cron-01', global: true },
                ],
            }),
        });

        new Instance(scope, `ec2-instance-staging-cron8`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.medium'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'staging-cron8',
                'map-migrated': 'd-server-008foujw7yyp7q',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 150,
                tags: {
                    Name: 'staging-cron8',
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                services: [
                    { name: 'payment-1039-cron-01', global: true },
                    { name: 'suite-1098-cron-01', global: true },
                    { name: 'suite-2098-cron-01', global: true },
                    { name: 'suite-3098-cron-01', global: true },
                    { name: 'suite-4098-cron-01', global: true },
                    { name: 'suite-5098-cron-01', global: true },
                    { name: 'suite-6098-cron-01', global: true },
                    { name: 'suite-7098-cron-01', global: true },
                    { name: 'suite-8098-cron-01', global: true },
                    { name: 'suite-9098-cron-01', global: true },
                    { name: 'suite-10098-cron-01', global: true },
                    { name: 'suite-11098-cron-01', global: true },
                    { name: 'suite-12098-cron-01', global: true },
                    { name: 'suite-13098-cron-01', global: true },
                    { name: 'suite-14098-cron-01', global: true },
                    { name: 'suite-15098-cron-01', global: true },
                    { name: 'suite-16098-cron-01', global: true },
                    { name: 'suite-17098-cron-01', global: true },
                    { name: 'suite-18098-cron-01', global: true },
                ],
            }),
        });
    }
}
