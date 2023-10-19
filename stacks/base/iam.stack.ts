import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsIamPolicyDocument } from '@cdktf/provider-aws/lib/data-aws-iam-policy-document';
import { IamInstanceProfile } from '@cdktf/provider-aws/lib/iam-instance-profile';
import { IamPolicy } from '@cdktf/provider-aws/lib/iam-policy';
import { IamRole } from '@cdktf/provider-aws/lib/iam-role';
import { IamRolePolicyAttachment } from '@cdktf/provider-aws/lib/iam-role-policy-attachment';
import { IamUser } from '@cdktf/provider-aws/lib/iam-user';
import { IamUserPolicyAttachment } from '@cdktf/provider-aws/lib/iam-user-policy-attachment';
import { S3ServerBackupStack } from './s3-server-backup';
import { IamRolePolicy } from '@cdktf/provider-aws/lib/iam-role-policy';

export class IamStack extends Construct {
    public ec2InstanceProfile: IamInstanceProfile;
    public rdsProxyRole: IamRole;

    constructor(scope: Construct, id: string, env: BaseEnvironment, s3ServerBackup: S3ServerBackupStack) {
        super(scope, id);

        const iamUser = new IamUser(this, `iam-user-svc-dns`, {
            name: `${env.name}-svc-dns`,
        });

        new IamUserPolicyAttachment(this, `iam-user-svc-dns-route53`, {
            user: iamUser.name,
            policyArn: 'arn:aws:iam::aws:policy/AmazonRoute53FullAccess',
        });

        new IamUserPolicyAttachment(this, `iam-user-svc-dns-ec2`, {
            user: iamUser.name,
            policyArn: 'arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess',
        });

        // BACKUP POLICY
        const policyBackupDocument = new DataAwsIamPolicyDocument(this, `data-iam-policy-server-backup`, {
            statement: [
                {
                    actions: ['s3:ListAllMyBuckets'],
                    resources: ['arn:aws:s3:::*'],
                    effect: 'Allow',
                },
                {
                    actions: ['s3:ListBucket', 's3:GetBucketLocation'],
                    resources: [s3ServerBackup.bucket.arn],
                    effect: 'Allow',
                },
                {
                    actions: ['s3:*'],
                    resources: [`${s3ServerBackup.bucket.arn}/*`],
                    effect: 'Allow',
                },
            ],
        });

        const policyBackup = new IamPolicy(this, `iam-policy-server-backup`, {
            name: `iam-policy-server-backup`,
            policy: policyBackupDocument.json,
        });

        // EC2 METRICS DATA POLICY
        const policyEc2MetricsDocument = new DataAwsIamPolicyDocument(this, `data-iam-policy-ec2-metrics`, {
            statement: [
                {
                    actions: ['cloudwatch:GetMetricData', 'cloudwatch:GetMetricStatistics', 'cloudwatch:ListMetrics'],
                    resources: ['*'],
                    effect: 'Allow',
                },
            ],
        });

        const policyEc2Metrics = new IamPolicy(this, `iam-policy-ec2-metrics`, {
            name: `iam-policy-ec2-metrics`,
            policy: policyEc2MetricsDocument.json,
        });

        // RDS MONITORING POLICY
        const policyMonitoringRdsDocument = new DataAwsIamPolicyDocument(this, `data-iam-policy-monitoring-rds`, {
            statement: [
                {
                    actions: ['rds:DescribeDBInstances'],
                    resources: ['*'],
                    effect: 'Allow',
                },
                {
                    actions: ['cloudwatch:GetMetricData', 'cloudwatch:GetMetricStatistics'],
                    resources: ['*'],
                    effect: 'Allow',
                },
            ],
        });

        const policyMonotringRds = new IamPolicy(this, 'iam-policy-monitoring-rds', {
            name: 'iam-policy-monitoring-rds',
            policy: policyMonitoringRdsDocument.json,
        });

        // EC2 DEFAULT ROLE
        const assumeRolePolicyEc2 = new DataAwsIamPolicyDocument(this, `data-iam-assume-role-policy-ec2`, {
            statement: [
                {
                    actions: ['sts:AssumeRole'],
                    principals: [
                        {
                            type: 'Service',
                            identifiers: ['ec2.amazonaws.com'],
                        },
                    ],
                },
            ],
        });

        const ec2IamRole = new IamRole(this, `iam-role-ec2-instance-default`, {
            name: `${env.name}-role-ec2-default`,
            assumeRolePolicy: assumeRolePolicyEc2.json,
        });

        new IamRolePolicyAttachment(this, `iam-role-ec2-instance-default-policy-backup`, {
            role: ec2IamRole.name,
            policyArn: policyBackup.arn,
        });

        new IamRolePolicyAttachment(this, `iam-role-ec2-instance-default-policy-ec2-metrics`, {
            role: ec2IamRole.name,
            policyArn: policyEc2Metrics.arn,
        });

        this.ec2InstanceProfile = new IamInstanceProfile(this, `iam-role-ec2-instance-default-instance-profile`, {
            name: `${env.name}-instance-profile-ec2-default`,
            role: ec2IamRole.name,
        });

        // NAGIOS USER
        const iamUserNagios = new IamUser(this, 'iam-user-svc-nagios', {
            name: `${env.name}-svc-nagios`,
        });

        new IamUserPolicyAttachment(this, 'iam-user-svc-nagios-monitoring-rds', {
            user: iamUserNagios.name,
            policyArn: policyMonotringRds.arn,
        });

        // IAM RDS PROXY
        this.rdsProxyRole = new IamRole(this, 'RDSProxyRole', {
            name: 'RDSProxyRole',
            assumeRolePolicy: JSON.stringify({
                Version: '2012-10-17',
                Statement: [{
                    Action: 'sts:AssumeRole',
                    Effect: 'Allow',
                    Principal: {
                        Service: 'rds.amazonaws.com'
                    }
                }]
            })
        });

        const policyRdsProxyDocument = new DataAwsIamPolicyDocument(this, `data-iam-policy-rds-proxy`, {
            statement: [
                {
                    actions: ['rds:DescribeDBInstances'],
                    resources: ['*'],
                    effect: 'Allow',
                },
                {
                    actions: ['cloudwatch:GetMetricData', 'cloudwatch:GetMetricStatistics'],
                    resources: ['*'],
                    effect: 'Allow',
                },
                {
                    actions: ['secretsmanager:GetSecretValue', 'kms:Decrypt'],
                    resources: ['*'], // Ideally, you should list out the specific ARNs of the secrets and KMS keys you want to grant access to.
                    effect: 'Allow',
                },
            ],
        });

        new IamRolePolicy(this, 'RDSProxyRolePolicy', {
            name: 'RDSProxyPolicy',
            role: this.rdsProxyRole.name,
            policy: policyRdsProxyDocument.json
        });

        this.rdsProxyRole = new IamRole(this, 'iam-role-rds-proxy', {
            name: 'iam-policy-monitoring-rds',
            assumeRolePolicy: policyRdsProxyDocument.json,
        });
    }
}
