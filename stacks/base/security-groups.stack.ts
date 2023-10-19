import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DefaultSecurityGroup } from '@cdktf/provider-aws/lib/default-security-group';
import { SecurityGroup } from '@cdktf/provider-aws/lib/security-group';

export class SecurityGroupsStack extends Construct {
    private groups = new Map<string, SecurityGroup | DefaultSecurityGroup>();

    constructor(scope: Construct, id: string, env: BaseEnvironment, vpcId: string) {
        super(scope, id);

        this.groups.set(
            'default',
            new DefaultSecurityGroup(this, `${env.name}-default`, {
                vpcId,
                tags: { Name: `${env.name}-default` },
                ingress: [
                    {
                        selfAttribute: true,
                        protocol: '-1',
                        fromPort: 0,
                        toPort: 0,
                    },
                    {
                        cidrBlocks: ['10.96.0.0/16'],
                        protocol: '-1',
                        fromPort: 0,
                        toPort: 0,
                    },
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: 'icmp',
                        fromPort: 8,
                        toPort: -1,
                    },
                ],
                egress: [
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: '-1',
                        fromPort: 0,
                        toPort: 0,
                    },
                ],
            }),
        );

        this.groups.set(
            'ssh',
            new SecurityGroup(this, `${env.name}-sg-ssh`, {
                vpcId,
                name: `${env.name}-sg-ssh`,
                description: 'Controls access to SSH',
                tags: { Name: `${env.name}-sg-ssh` },
                ingress: [
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: 'tcp',
                        fromPort: 22,
                        toPort: 22,
                    },
                ],
            }),
        );

        this.groups.set(
            'http',
            new SecurityGroup(this, `${env.name}-sg-http`, {
                vpcId,
                name: `${env.name}-sg-http`,
                description: 'Controls access to HTTP',
                tags: { Name: `${env.name}-sg-http` },
                ingress: [
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: 'tcp',
                        fromPort: 80,
                        toPort: 80,
                    },
                ],
            }),
        );

        this.groups.set(
            'https',
            new SecurityGroup(this, `${env.name}-sg-https`, {
                vpcId,
                name: `${env.name}-sg-https`,
                description: 'Controls access to HTTPS',
                tags: { Name: `${env.name}-sg-https` },
                ingress: [
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        fromPort: 443,
                        toPort: 443,
                        protocol: 'tcp',
                    },
                ],
            }),
        );

        this.groups.set(
            'http-alt',
            new SecurityGroup(this, `${env.name}-sg-http-alt`, {
                vpcId,
                name: `${env.name}-sg-http-alt`,
                description: 'Controls access to HTTP 8080',
                tags: { Name: `${env.name}-sg-http-alt` },
                ingress: [
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: 'tcp',
                        fromPort: 8080,
                        toPort: 8080,
                    },
                ],
            }),
        );

        this.groups.set(
            'openvpn',
            new SecurityGroup(this, `${env.name}-sg-openvpn`, {
                vpcId,
                name: `${env.name}-sg-openvpn`,
                description: 'Controls access to OpenVPN server',
                tags: { Name: `${env.name}-sg-openvpn` },
                ingress: [
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: 'tcp',
                        fromPort: 943,
                        toPort: 943,
                    },
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: 'udp',
                        fromPort: 1194,
                        toPort: 1194,
                    },
                ],
            }),
        );

        this.groups.set(
            'ipsec',
            new SecurityGroup(this, `${env.name}-sg-ipsec`, {
                vpcId,
                name: `${env.name}-sg-ipsec`,
                description: 'Controls access to IPSec server',
                tags: { Name: `${env.name}-sg-ipsec` },
                ingress: [
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: 'udp',
                        fromPort: 500,
                        toPort: 500,
                    },
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: 'udp',
                        fromPort: 4500,
                        toPort: 4500,
                    },
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: '50',
                        fromPort: 0,
                        toPort: 0,
                    },
                    {
                        cidrBlocks: ['0.0.0.0/0'],
                        protocol: '51',
                        fromPort: 0,
                        toPort: 0,
                    },
                ],
            }),
        );

        this.groups.set(
            'data-dept-mongodb',
            new SecurityGroup(this, `${env.name}-sg-data-dept-mongodb`, {
                vpcId,
                name: `${env.name}-sg-data-dept-mongodb`,
                description: 'Control accesss from DATA AWS account to MongoDB',
                tags: { Name: `${env.name}-sg-data-dept-mongodb` },
                ingress: [
                    {
                        cidrBlocks: ['172.30.0.0/16'],
                        protocol: 'icmp',
                        fromPort: 8,
                        toPort: -1,
                    },
                    {
                        cidrBlocks: ['172.30.0.0/16'],
                        protocol: 'tcp',
                        fromPort: 27017,
                        toPort: 27017,
                    },
                ],
            }),
        );

        this.groups.set(
            'data-dept-mysql',
            new SecurityGroup(this, `${env.name}-sg-data-dept-mysql`, {
                vpcId,
                name: `${env.name}-sg-data-dept-mysql`,
                description: 'Control accesss from DATA AWS account to MySQL',
                tags: { Name: `${env.name}-sg-data-dept-mysql` },
                ingress: [
                    {
                        cidrBlocks: ['172.30.0.0/16'],
                        protocol: 'icmp',
                        fromPort: 8,
                        toPort: -1,
                    },
                    {
                        cidrBlocks: ['172.30.0.0/16'],
                        protocol: 'tcp',
                        fromPort: 3306,
                        toPort: 3306,
                    },
                ],
            }),
        );

        this.groups.set(
            'data-dept-amqp',
            new SecurityGroup(this, `${env.name}-sg-data-dept-amqp`, {
                vpcId,
                name: `${env.name}-sg-data-dept-amqp`,
                description: 'Control accesss from DATA AWS account to AMQP',
                tags: { Name: `${env.name}-sg-data-dept-mysql` },
                ingress: [
                    {
                        cidrBlocks: ['172.30.0.0/16'],
                        protocol: 'icmp',
                        fromPort: 8,
                        toPort: -1,
                    },
                    {
                        cidrBlocks: ['172.30.0.0/16'],
                        protocol: 'tcp',
                        fromPort: 5672,
                        toPort: 5672,
                    },
                ],
            }),
        );
    }

    public get(name: string): string {
        if (this.groups.has(name)) {
            return this.groups.get(name)!.id;
        }

        throw new Error(`Invalid security group ${name}`);
    }
}
