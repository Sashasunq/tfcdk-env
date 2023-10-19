import { DbParameterGroup, DbParameterGroupParameter } from '@cdktf/provider-aws/lib/db-parameter-group';

import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DbSubnetGroup } from '@cdktf/provider-aws/lib/db-subnet-group';
import { IamRole } from '@cdktf/provider-aws/lib/iam-role';
import { IamRolePolicyAttachment } from '@cdktf/provider-aws/lib/iam-role-policy-attachment';
import { TerraformVariable } from 'cdktf';
import { VpcStack } from '../base/vpc.stack';

export class RdsBaseStack extends Construct {
    public adminPassword: TerraformVariable;
    public dbSubnet: DbSubnetGroup;
    public monitoringRole: IamRole;

    constructor(scope: Construct, id: string, env: BaseEnvironment, vpc: VpcStack) {
        super(scope, id);

        // subnet
        this.dbSubnet = new DbSubnetGroup(scope, `rds-db-subnet-group`, {
            name: `${env.name}-db-subnet`,
            subnetIds: vpc.privateSubnets,
            tags: {
                Name: `${env.name}-db-subnet`,
            },
        });

        // rds parameter group

        //for now, just increase the max connections
        const suiteStagingParameters: DbParameterGroupParameter[] = [
            {
                name: 'max_connections',
                value: '1000',
                applyMethod: 'pending-reboot',
            },
        ];

        const optimizedBaseParameters: DbParameterGroupParameter[] = [
            {
                name: 'back_log',
                value: '256',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'innodb_flush_log_at_trx_commit',
                value: '2',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'max_allowed_packet',
                value: `${64 * 1024 * 1024}`,
                applyMethod: 'pending-reboot',
            },
            {
                name: 'max_connect_errors',
                value: '9999999999',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'max_connections',
                value: '10000',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'max_prepared_stmt_count',
                value: '65535',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'net_buffer_length',
                value: '65536',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'read_buffer_size',
                value: '1048576',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'slow_query_log',
                value: '1',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'sort_buffer_size',
                value: '4194304',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'sync_binlog',
                value: '0',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'thread_cache_size',
                value: '128',
                applyMethod: 'pending-reboot',
            },
        ];

        const optimizedBaseParametersFixedApplyMethod: DbParameterGroupParameter[] = [
            {
                name: 'back_log',
                value: '256',
                applyMethod: 'pending-reboot',
            },
            {
                name: 'innodb_flush_log_at_trx_commit',
                value: '2',
                applyMethod: 'immediate',
            },
            {
                name: 'max_allowed_packet',
                value: `${64 * 1024 * 1024}`,
                applyMethod: 'immediate',
            },
            {
                name: 'max_connect_errors',
                value: '9999999999',
                applyMethod: 'immediate',
            },
            {
                name: 'max_connections',
                value: '10000',
                applyMethod: 'immediate',
            },
            {
                name: 'max_prepared_stmt_count',
                value: '65535',
                applyMethod: 'immediate',
            },
            {
                name: 'net_buffer_length',
                value: '65536',
                applyMethod: 'immediate',
            },
            {
                name: 'read_buffer_size',
                value: '1048576',
                applyMethod: 'immediate',
            },
            {
                name: 'slow_query_log',
                value: '1',
                applyMethod: 'immediate',
            },
            {
                name: 'sort_buffer_size',
                value: '4194304',
                applyMethod: 'immediate',
            },
            {
                name: 'sync_binlog',
                value: '0',
                applyMethod: 'immediate',
            },
            {
                name: 'thread_cache_size',
                value: '128',
                applyMethod: 'immediate',
            },
        ];

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-staging`, {
            name: 'whow-mysql57-staging-optimized',
            description: '[WHOW] MySQL 5.7 staging optimized',
            family: 'mysql5.7',
            parameter: suiteStagingParameters,
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-optimized`, {
            name: 'whow-mysql57-optimized',
            description: '[WHOW] MySQL 5.7 optimized',
            family: 'mysql5.7',
            parameter: optimizedBaseParameters,
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-jpevents-96-mysql-01`, {
            name: 'whow-mysql57-jpevents-96-mysql-01',
            description: '[WHOW] MySQL 5.7 optimized',
            family: 'mysql5.7',
            parameter: optimizedBaseParameters,
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-jpfeatures-113-mysql-01`, {
            name: 'whow-mysql57-jpfeatures-113-mysql-01',
            description: '[WHOW] MySQL 5.7 optimized',
            family: 'mysql5.7',
            parameter: optimizedBaseParameters,
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-suite-98-mysql-01`, {
            name: 'whow-mysql57-suite-98-mysql-01',
            description: '[WHOW] MySQL 5.7 optimized',
            family: 'mysql5.7',
            parameter: optimizedBaseParameters,
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-suite-98-mysql-02`, {
            name: 'whow-mysql57-suite-98-mysql-02',
            description: '[WHOW] MySQL 5.7 optimized',
            family: 'mysql5.7',
            parameter: optimizedBaseParameters,
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-suite-98-mysql-03`, {
            name: 'whow-mysql57-suite-98-mysql-03',
            description: '[WHOW] MySQL 5.7 optimized',
            family: 'mysql5.7',
            parameter: optimizedBaseParametersFixedApplyMethod,
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-suite-98-mysql-stats`, {
            name: 'whow-mysql57-suite-98-mysql-stats',
            description: '[WHOW] MySQL 5.7 optimized',
            family: 'mysql5.7',
            parameter: optimizedBaseParameters,
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-symbols-102-mysql-01`, {
            name: 'whow-mysql57-symbols-102-mysql-01',
            description: '[WHOW] MySQL 5.7 optimized',
            family: 'mysql5.7',
            parameter: optimizedBaseParameters,
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-treasurehunt-76-mysql-01`, {
            name: 'whow-mysql57-treasurehunt-76-mysql-01',
            description: '[WHOW] MySQL 5.7 optimized',
            family: 'mysql5.7',
            parameter: [
                ...optimizedBaseParameters,
                /*
                {
                    name: 'innodb_adaptive_hash_index',
                    value: '0',
                    applyMethod: 'immediate',
                },
                */
            ],
        });

        new DbParameterGroup(scope, `rds-mysql-parameter-group-whow-nosyncflush`, {
            name: 'whow-mysql57-nosyncflush',
            description: '[WHOW] MySQL 5.7 no sync / flush',
            family: 'mysql5.7',
            parameter: [
                {
                    name: 'innodb_flush_log_at_trx_commit',
                    value: '2',
                    applyMethod: 'pending-reboot',
                },
                {
                    name: 'sync_binlog',
                    value: '0',
                    applyMethod: 'pending-reboot',
                },
            ],
        });

        // monitoring role
        this.monitoringRole = new IamRole(scope, `rds-monitoring-role`, {
            name: 'rds-enhanced-monitoring',
            assumeRolePolicy: JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                    {
                        Sid: '',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'monitoring.rds.amazonaws.com',
                        },
                        Action: 'sts:AssumeRole',
                    },
                ],
            }),
        });

        new IamRolePolicyAttachment(scope, `rds-monitoring-role-attachment`, {
            policyArn: 'arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole',
            role: this.monitoringRole.name,
        });

        // admin PW
        this.adminPassword = new TerraformVariable(scope, `dbPassword`, {
            type: 'string',
            sensitive: true,
        });
    }
}
