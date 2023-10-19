import { BaseEnvironment, MemoryDbConfig } from '../../environments/base-environment';

import { Construct } from 'constructs';
import { MemoryDbBaseStack } from './memory-db-base.stack';
import { MemorydbCluster } from '@cdktf/provider-aws/lib/memorydb-cluster';
import { SecurityGroupsStack } from '../base/security-groups.stack';

export class MemoryDbClusterStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        config: MemoryDbConfig,
        memoryDbBaseStack: MemoryDbBaseStack,
        securityGroups: SecurityGroupsStack,
    ) {
        super(scope, id);

        new MemorydbCluster(scope, `memorydb-${config.name}-cluster`, {
            name: config.name,
            nodeType: env.memoryDbInstanceClass(config.instanceType),
            aclName: 'open-access',
            numShards: config.shards,
            numReplicasPerShard: config.replicas,
            subnetGroupName: memoryDbBaseStack.memoryDbSubnet.name,
            maintenanceWindow: env.defaultMaintenanceWindow,
            snapshotRetentionLimit: 7,
            snapshotWindow: env.defaultBackupWindow,
            securityGroupIds: [securityGroups.get('default')],
        });
    }
}
