import { BaseEnvironment, ElastiCacheConfig } from '../../environments/base-environment';

import { Construct } from 'constructs';
import { ElastiCacheBaseStack } from './elasti-cache-base.stack';
import { ElasticacheCluster } from '@cdktf/provider-aws/lib/elasticache-cluster';

export class ElastiCacheMemcachedClusterStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, config: ElastiCacheConfig, elastiCacheBaseStack: ElastiCacheBaseStack) {
        super(scope, id);

        new ElasticacheCluster(scope, `elasticache-${config.name}-cluster`, {
            clusterId: config.name,
            engine: 'memcached',
            nodeType: env.elastiCacheInstanceClass(config.instanceType),
            numCacheNodes: config.nodes,
            subnetGroupName: elastiCacheBaseStack.cacheSubnet.name,
            maintenanceWindow: env.defaultMaintenanceWindow,
            tags: {
                Name: config.name,
            },
        });
    }
}
