import { BaseEnvironment, RdsConfig } from '../../environments/base-environment';

import { Construct } from 'constructs';
import { DbInstance } from '@cdktf/provider-aws/lib/db-instance';
import { RdsBaseStack } from './rds-base.stack';
import { SecurityGroupsStack } from '../base/security-groups.stack';

export class RdsInstanceStack extends Construct {

    public dbInstance: DbInstance;
    public createProxy: boolean;

    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        config: RdsConfig,
        rdsBaseStack: RdsBaseStack,
        securityGroups: SecurityGroupsStack,
    ) {
        super(scope, id);

        let performanceInsights = true;

        if (
            ['db.t2.micro', 'db.t2.small', 'db.t3.micro', 'db.t3.small', 'db.t4g.micro', 'db.t4g.small'].includes(
                env.dbInstanceClass(config.instanceType),
            )
        ) {
            performanceInsights = false;
        }

        const secGroups = [securityGroups.get('default')];

        if (config.allowDataDeptAccess) {
            secGroups.push(securityGroups.get('data-dept-mysql'));
        }

        this.dbInstance = new DbInstance(scope, `rds-${config.name}-instance`, {
            identifier: config.name,
            allocatedStorage: config.diskSize,
            engine: 'mysql',
            engineVersion: config.engineVersion ?? '5.7',
            autoMinorVersionUpgrade: false,
            instanceClass: env.dbInstanceClass(config.instanceType),
            dbSubnetGroupName: rdsBaseStack.dbSubnet.name,
            vpcSecurityGroupIds: secGroups,
            username: 'admin',
            password: rdsBaseStack.adminPassword.value,
            multiAz: false,
            storageEncrypted: true,
            storageType: config.diskType,
            maxAllocatedStorage: config.diskSize * 2,
            monitoringInterval: 60,
            monitoringRoleArn: rdsBaseStack.monitoringRole.arn,
            maintenanceWindow: env.defaultMaintenanceWindow,
            backupWindow: env.defaultBackupWindow,
            backupRetentionPeriod: 7,
            parameterGroupName: config.parameterGroup ?? 'default.mysql5.7',
            optionGroupName: config.engineVersion === '8.0' ? 'default:mysql-8-0' : 'default:mysql-5-7',
            skipFinalSnapshot: false,
            performanceInsightsEnabled: performanceInsights,
            finalSnapshotIdentifier: `${config.name}-final`,
            deletionProtection: true,
            tags: {
                Name: config.name,
            },
        });

        this.createProxy = config.proxy ?? false;
    }
}
