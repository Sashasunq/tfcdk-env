import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { ElasticacheSubnetGroup } from '@cdktf/provider-aws/lib/elasticache-subnet-group';
import { VpcStack } from '../base/vpc.stack';

export class ElastiCacheBaseStack extends Construct {
    public cacheSubnet: ElasticacheSubnetGroup;

    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        this.cacheSubnet = new ElasticacheSubnetGroup(scope, `elasticache-subnet-group`, {
            name: `${env.name}-elasticache-subnet`,
            subnetIds: vpc.privateSubnets,
            tags: {
                Name: `${env.name}-elasticache-subnet`,
            },
        });
    }
}
