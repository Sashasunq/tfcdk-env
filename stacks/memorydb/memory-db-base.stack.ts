import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { MemorydbSubnetGroup } from '@cdktf/provider-aws/lib/memorydb-subnet-group';
import { VpcStack } from '../base/vpc.stack';

export class MemoryDbBaseStack extends Construct {
    public memoryDbSubnet: MemorydbSubnetGroup;

    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        this.memoryDbSubnet = new MemorydbSubnetGroup(scope, `memorydb-subnet-group`, {
            name: `${env.name}-memorydb-subnet`,
            subnetIds: vpc.privateSubnets,
            tags: {
                Name: `${env.name}-memorydb-subnet`,
            },
        });
    }
}
