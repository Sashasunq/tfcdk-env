import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainVideoslotsCasino extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, loadbalancerSuite: DataAwsLb) {
        super(scope, id);

        const domain = 'videoslots.casino';

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
                name: loadbalancerSuite.dnsName,
                zoneId: loadbalancerSuite.zoneId,
                evaluateTargetHealth: false,
            },
        });

        new Route53Record(this, `record-${domain}-www`, {
            zoneId: zone.id,
            name: 'www',
            type: 'A',
            alias: {
                name: loadbalancerSuite.dnsName,
                zoneId: loadbalancerSuite.zoneId,
                evaluateTargetHealth: false,
            },
        });

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
            records: [
                env.defaultSpf,
                'google-site-verification=cyLPaP0pHQO97Ujyj274NIn4igx9DzimKluCERQiBXY',
                'facebook-domain-verification=3e9ifec4np070kzosvakazn3g67rgm',
            ],
        });

        new Route53Record(this, `record-${domain}-marketing`, {
            zoneId: zone.id,
            name: 'marketing',
            type: 'CNAME',
            ttl: 300,
            records: ['eu.sparkpostmail.com.'],
        });

        new Route53Record(this, `record-${domain}-marketing-verification`, {
            zoneId: zone.id,
            name: 'scph1221._domainkey.marketing',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJx0hnWnJ9mVY0oyTD85enqACIiHjQp9uJHW1rYfrZp9UC6aaoiY2XWv22LgMB7+MhpXEbSPbqg8rb1D19E3rind9IQbjsUHfVA0UApQbpGaKWVdFaw3ehcGn7HOEvWRjErZBMGeCP0QyomfU23FgL4HjkG1lLC6R4tGd/3FbAsQIDAQAB',
            ],
        });

        new Route53Record(this, `record-${domain}-service`, {
            zoneId: zone.id,
            name: 'service',
            type: 'CNAME',
            ttl: 300,
            records: ['eu.sparkpostmail.com.'],
        });

        new Route53Record(this, `record-${domain}-service-verification`, {
            zoneId: zone.id,
            name: 'scph1221._domainkey.service',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDqxKipKpLBQVtkBX+T2AbAKlSpNbt980RLsQAZPwv9UXBug+HIvnI8AqSKGAsxpsn8RBDr2EFEgBAZjEOJ2pmXbAHYLU0C759J9+7McsHL8c1+ZDh9wYr5JRA775kZ99dYvZlgKD5Nt6vZHqF+pUctx6qxKM/0WdKpMgDICEDwiwIDAQAB',
            ],
        });

        new Route53Record(this, `record-${domain}-sendgrid-s1`, {
            zoneId: zone.id,
            name: 's1._domainkey',
            type: 'CNAME',
            ttl: 300,
            records: ['s1.domainkey.u2320378.wl129.sendgrid.net.'],
        });

        new Route53Record(this, `record-${domain}-sendgrid-s2`, {
            zoneId: zone.id,
            name: 's2._domainkey',
            type: 'CNAME',
            ttl: 300,
            records: ['s2.domainkey.u2320378.wl129.sendgrid.net.'],
        });

        new Route53Record(this, `record-${domain}-sendgrid-em3009`, {
            zoneId: zone.id,
            name: 'em3009',
            type: 'CNAME',
            ttl: 300,
            records: ['u2320378.wl129.sendgrid.net.'],
        });
    }
}
