import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class RootDnsStack extends Construct {
    private zone: Route53Zone;

    constructor(scope: Construct, id: string, env: BaseEnvironment) {
        super(scope, id);

        this.zone = new Route53Zone(this, 'root-dns-zone', {
            name: env.rootDns.dnsName,
            tags: { Name: env.rootDns.dnsName },
        });
    }

    public get zoneId(): string {
        return this.zone.id;
    }
}
