import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class AptStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack, zoneId: string) {
        super(scope, id);

        const instance = new Instance(scope, `ec2-instance-apt`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.large'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'apt',
                'map-migrated': 'd-server-03dzumw9gsnx0k',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 600,
                tags: {
                    Name: 'apt',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateAptMirror(env),
        });

        new Route53Record(scope, `route53-record-apt`, {
            zoneId,
            name: 'apt',
            type: 'A',
            ttl: 60,
            records: [instance.privateIp],
        });

        new Route53Record(scope, `route53-record-bootstrap`, {
            zoneId,
            name: 'bootstrap',
            type: 'A',
            ttl: 60,
            records: [instance.privateIp],
        });
    }
}
