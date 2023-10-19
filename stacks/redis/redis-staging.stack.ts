import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class RedisStagingStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        new Instance(scope, `ec2-instance-staging-redis`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.small'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'staging-redis',
                'map-migrated': 'd-server-02guyzx9n89e3r',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 50,
                tags: {
                    Name: 'staging-redis',
                    'map-migrated': 'd-server-02guyzx9n89e3r',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                roles: ['redis'],
                services: [
                    {
                        name: 'staging-redis',
                        global: true,
                    },
                    {
                        name: 'achievements-1114-redis',
                        global: true,
                    },
                    {
                        name: 'arcadegames-1112-redis',
                        global: true,
                    },
                    {
                        name: 'cardworlds-1117-redis',
                        global: true,
                    },
                    {
                        name: 'clubs-1104-redis',
                        global: true,
                    },
                    {
                        name: 'competitions2-1065-redis',
                        global: true,
                    },
                    {
                        name: 'competitions3-1065-redis',
                        global: true,
                    },
                    {
                        name: 'highroller-1107-redis',
                        global: true,
                    },
                    {
                        name: 'idleslot-1111-redis',
                        global: true,
                    },
                    {
                        name: 'journey3-1038-redis',
                        global: true,
                    },
                    {
                        name: 'journey4-1038-redis',
                        global: true,
                    },
                    {
                        name: 'jpevents-1096-redis',
                        global: true,
                    },
                    {
                        name: 'jpfeatures-1113-redis',
                        global: true,
                    },
                    {
                        name: 'jpmailbox-1116-redis',
                        global: true,
                    },
                    {
                        name: 'leaderboard2-1027-redis',
                        global: true,
                    },
                    {
                        name: 'league2-1056-redis',
                        global: true,
                    },
                    {
                        name: 'm2pslots-1103-redis',
                        global: true,
                    },
                    {
                        name: 'offerai-1054-redis-01',
                        global: true,
                    },
                    {
                        name: 'personaljackpots-1089-redis',
                        global: true,
                    },
                    {
                        name: 'streamercup-1101-redis',
                        global: true,
                    },
                    {
                        name: 'suite-1098-redis-01',
                        global: true,
                    },
                    {
                        name: 'symbols-1102-redis',
                        global: true,
                    },
                    {
                        name: 'tigerking-1119-redis',
                        global: true,
                    },
                    {
                        name: 'tigerking-2119-redis',
                        global: true,
                    },
                ],
            }),
        });
    }
}
