import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Eip } from '@cdktf/provider-aws/lib/eip';
import { InternetGateway } from '@cdktf/provider-aws/lib/internet-gateway';
import { NatGateway } from '@cdktf/provider-aws/lib/nat-gateway';
import { RouteTable } from '@cdktf/provider-aws/lib/route-table';
import { RouteTableAssociation } from '@cdktf/provider-aws/lib/route-table-association';
import { Subnet } from '@cdktf/provider-aws/lib/subnet';
import { Vpc } from '@cdktf/provider-aws/lib/vpc';
import { VpcDhcpOptions } from '@cdktf/provider-aws/lib/vpc-dhcp-options';
import { VpcDhcpOptionsAssociation } from '@cdktf/provider-aws/lib/vpc-dhcp-options-association';
import { VpcEndpoint } from '@cdktf/provider-aws/lib/vpc-endpoint';
import { VpcEndpointRouteTableAssociation } from '@cdktf/provider-aws/lib/vpc-endpoint-route-table-association';
import { VpcPeeringConnection } from '@cdktf/provider-aws/lib/vpc-peering-connection';

export class VpcStack extends Construct {
    private vpc: Vpc;
    private _publicSubnets: Subnet[] = [];
    private _privateSubnets: Subnet[] = [];
    private _routeTables: RouteTable[] = [];
    private natGateways: NatGateway[] = [];

    constructor(scope: Construct, id: string, env: BaseEnvironment) {
        super(scope, id);

        this.vpc = new Vpc(this, 'vpc', {
            cidrBlock: env.vpcConfig.cidr,
            enableDnsHostnames: true,
            enableDnsSupport: true,
            tags: {
                Name: `${env.name}-vpc`,
            },
        });

        const dhcpOptions = new VpcDhcpOptions(this, 'dhcp', {
            domainName: `${env.rootDns.dnsName} whowsrv.net eu-central-1.compute.internal`,
            domainNameServers: ['AmazonProvidedDNS'],
            tags: {
                Name: `${env.name}-dhcp`,
            },
        });

        new VpcDhcpOptionsAssociation(this, 'dhcp-options', {
            vpcId: this.vpc.id,
            dhcpOptionsId: dhcpOptions.id,
        });

        const igw = new InternetGateway(this, 'igw', {
            vpcId: this.vpc.id,
            tags: {
                Name: `${env.name}-igw`,
            },
        });

        const s3Endpoint = new VpcEndpoint(this, 'vpc-s3-endpoint', {
            vpcId: this.vpc.id,
            serviceName: 'com.amazonaws.eu-central-1.s3',
            tags: {
                Name: `${env.name}-s3-endpoint`,
            },
        });

        const vpcPeeringData = new VpcPeeringConnection(this, `vpc-peering-data`, {
            vpcId: this.vpc.id,
            peerOwnerId: '117896056496',
            peerRegion: 'eu-central-1',
            peerVpcId: 'vpc-0043d8455d253cf43',
            tags: {
                Name: `${env.name}-vpc-peering-data`,
            },
        });

        const publicRtb = new RouteTable(this, 'rtb-public', {
            vpcId: this.vpc.id,
            route: [
                { cidrBlock: '0.0.0.0/0', gatewayId: igw.id },
                {
                    cidrBlock: '172.30.0.0/16',
                    vpcPeeringConnectionId: vpcPeeringData.id,
                },
            ],
            tags: {
                Name: `${env.name}-rtb-public`,
            },
        });

        this._routeTables.push(publicRtb);

        for (const net of env.vpcConfig.publicSubnets) {
            const num = this._publicSubnets.length + 1;

            const subnet = new Subnet(this, `subnet-public-${net.availabilityZone}`, {
                vpcId: this.vpc.id,
                cidrBlock: net.cidr,
                availabilityZone: net.availabilityZone,
                tags: {
                    Name: `${env.name}-subnet-public${num}-${net.availabilityZone}`,
                    Tier: 'Public',
                },
            });

            new RouteTableAssociation(this, `rtb-assoc-public-${num}`, {
                subnetId: subnet.id,
                routeTableId: publicRtb.id,
            });

            this._publicSubnets.push(subnet);
        }

        if (env.vpcConfig.singleNatGateway) {
            const natPrivateIp = `${env.vpcConfig.publicSubnets[0].cidr.split('/')[0].split('.').slice(0, 3).join('.')}.5`;

            const natGatewayIp = new Eip(this, 'nat-gw-eip', {
                associateWithPrivateIp: natPrivateIp,
                vpc: true,
                tags: {
                    Name: `${env.name}-nat-gateway`,
                },
            });

            this.natGateways.push(
                new NatGateway(this, 'nat-gw', {
                    subnetId: this._publicSubnets[0].id,
                    privateIp: natPrivateIp,
                    allocationId: natGatewayIp.allocationId,
                    tags: {
                        Name: `${env.name}-nat-gateway`,
                    },
                }),
            );
        } else {
            for (let i = 1; i <= env.vpcConfig.publicSubnets.length; i++) {
                const natPrivateIp = `${env.vpcConfig.publicSubnets[i - 1].cidr.split('/')[0].split('.').slice(0, 3).join('.')}.5`;

                const natGatewayIp = new Eip(this, `nat-gw-eip-${i}`, {
                    associateWithPrivateIp: natPrivateIp,
                    vpc: true,
                    tags: {
                        Name: `${env.name}-nat-gateway-${i}`,
                    },
                });

                this.natGateways.push(
                    new NatGateway(this, `nat-gw-${i}`, {
                        subnetId: this._publicSubnets[i - 1].id,
                        privateIp: natPrivateIp,
                        allocationId: natGatewayIp.allocationId,
                        tags: {
                            Name: `${env.name}-nat-gateway-${i}`,
                        },
                    }),
                );
            }
        }

        for (const net of env.vpcConfig.privateSubnets) {
            const num = this.privateSubnets.length + 1;

            const subnet = new Subnet(this, `subnet-private-${net.availabilityZone}`, {
                vpcId: this.vpc.id,
                cidrBlock: net.cidr,
                availabilityZone: net.availabilityZone,
                tags: {
                    Name: `${env.name}-subnet-private${num}-${net.availabilityZone}`,
                    Tier: 'Private',
                },
            });

            const privateRtb = new RouteTable(this, `rtp-private-${num}`, {
                vpcId: this.vpc.id,
                route: [
                    {
                        cidrBlock: '0.0.0.0/0',
                        natGatewayId: this.natGateways[env.vpcConfig.singleNatGateway ? 0 : this.privateSubnets.length].id,
                    },
                    {
                        cidrBlock: '172.30.0.0/16',
                        vpcPeeringConnectionId: vpcPeeringData.id,
                    },
                ],
                tags: {
                    Name: `${env.name}-rtp-private${num}-${net.availabilityZone}`,
                },
            });

            new RouteTableAssociation(this, `rtp-assoc-private-${num}`, {
                subnetId: subnet.id,
                routeTableId: privateRtb.id,
            });

            new VpcEndpointRouteTableAssociation(this, `rtp-assoc-private-${num}-s3`, {
                routeTableId: privateRtb.id,
                vpcEndpointId: s3Endpoint.id,
            });

            this._privateSubnets.push(subnet);
            this._routeTables.push(privateRtb);
        }
    }

    public get vpcId(): string {
        return this.vpc.id;
    }

    public get privateSubnets(): string[] {
        return this._privateSubnets.map(val => val.id);
    }

    public get randomPrivateSubnet(): string {
        return this._privateSubnets[Math.floor(Math.random() * this._privateSubnets.length)].id;
    }

    public get publicSubnets(): string[] {
        return this._publicSubnets.map(val => val.id);
    }

    public get randomPublicSubnet(): string {
        return this._publicSubnets[Math.floor(Math.random() * this._publicSubnets.length)].id;
    }

    public get routeTables(): string[] {
        return this._routeTables.map(val => val.id);
    }
}
