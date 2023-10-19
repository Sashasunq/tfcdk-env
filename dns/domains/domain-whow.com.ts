import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainWhowCom extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, loadbalancerSuite: DataAwsLb, loadbalancerServices: DataAwsLb) {
        super(scope, id);

        const domain = 'whow.com';

        const zone = new Route53Zone(this, `zone-${domain}`, {
            name: domain,
            tags: {
                Name: domain,
            },
        });

        const suiteSubdomains = ['admin', 'api', 'cockpit', 'mapi', 'papi'];

        // whow homepage
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

        // suite subdomains
        for (const subdomain of suiteSubdomains) {
            new Route53Record(this, `record-${domain}-${subdomain}`, {
                zoneId: zone.id,
                name: subdomain,
                type: 'A',
                alias: {
                    name: loadbalancerSuite.dnsName,
                    zoneId: loadbalancerSuite.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }

        new Route53Record(this, `record-${domain}-mx`, {
            zoneId: zone.id,
            name: domain,
            type: 'MX',
            ttl: 300,
            records: [
                '1 aspmx.l.google.com.',
                '5 alt1.aspmx.l.google.com.',
                '5 alt2.aspmx.l.google.com.',
                '10 aspmx2.googlemail.com.',
                '10 aspmx3.googlemail.com.',
            ],
        });

        new Route53Record(this, `record-${domain}-txt`, {
            zoneId: zone.id,
            name: domain,
            type: 'TXT',
            ttl: 300,
            records: [env.defaultSpf],
        });

        new Route53Record(this, `record-${domain}-xpc3euhcpnix`, {
            zoneId: zone.id,
            name: 'xpc3euhcpnix',
            type: 'CNAME',
            ttl: 300,
            records: ['gv-stxodrtpra76ia.dv.googlehosted.com'],
        });
    }
}
