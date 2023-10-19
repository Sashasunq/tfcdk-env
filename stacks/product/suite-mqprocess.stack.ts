import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Instance } from '@cdktf/provider-aws/lib/instance';
import { UserDataUtil } from '../../utils/user-data';
import { VpcStack } from '../base/vpc.stack';

export class SuiteMqProcessStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        // PRODUCTION
        new Instance(scope, `ec2-instance-suite-98-mqprocess-01`, {
            ami: env.amiDebian11,
            subnetId: vpc.randomPrivateSubnet,
            instanceType: env.instanceType('t3a.xlarge'),
            keyName: env.defaultKeyName,
            iamInstanceProfile: env.defaultEc2InstanceProfile,
            disableApiTermination: true,
            tags: {
                Name: 'suite-98-mqprocess-01',
            },
            rootBlockDevice: {
                volumeType: 'gp3',
                volumeSize: 30,
                tags: {
                    Name: 'suite-98-mqprocess-01',
                },
            },
            lifecycle: {
                ignoreChanges: env.defaultLifecycleIgnoreChanges,
            },
            userData: UserDataUtil.generateBootstrap({
                services: [
                    { name: 'suite-98-mqprocess-01', global: true },
                    { name: 'suite-98-mqprocess-02', global: true },
                    { name: 'suite-98-mqprocess-03', global: true },
                    { name: 'suite-98-mqprocess-04', global: true },
                ],
            }),
        });
    }
}
