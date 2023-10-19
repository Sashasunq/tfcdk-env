import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsWhowgamesRedirectsStack extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, loadbalancerServices: DataAwsLb) {
        super(scope, id);

        const domains = ['whow-games.com', 'whow-games.de', 'whowgames.com', 'whowgames.de'];

        for (const domain of domains) {
            const zone = new Route53Zone(this, `zone-${domain}`, {
                name: domain,
                tags: {
                    Name: domain,
                },
            });

            new Route53Record(this, `record-${domain}-root`, {
                zoneId: zone.id,
                name: domain,
                type: 'A',
                alias: {
                    name: loadbalancerServices.dnsName,
                    zoneId: loadbalancerServices.zoneId,
                    evaluateTargetHealth: false,
                },
            });

            new Route53Record(this, `record-${domain}-www`, {
                zoneId: zone.id,
                name: 'www',
                type: 'A',
                alias: {
                    name: loadbalancerServices.dnsName,
                    zoneId: loadbalancerServices.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }
    }
}
