import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainScatterwolfCom extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, loadbalancerSuite: DataAwsLb) {
        super(scope, id);

        const domain = 'scatterwolf.com';

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
            records: [env.defaultSpf, 'google-site-verification=45MfdKioc8ewqucSllWMF3MOVeVpQZttfLYgBrubvcs'],
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
            name: 'scph0423._domainkey.marketing',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxLdbPDadswOMh8IsUjEzYeJtz0urLRunjcH5nZYoIir6YJ97kEnstTNMAAFi8qf/XKJqqn2na6nVC03/xhXvjELrURzXyONHgLTtdI2mT/7rD4X2AIYyqfB0UAy8L5kzUfDNr+SnH9RsIIvvV8udwv0ll9l+NAj6rwWcaT4hE+QIDAQAB',
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
            name: 'scph0423._domainkey.service',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCk4rek9fmOpy7ku4OHNnmjeUxJgDcYYQu5a651FQDDZ20i/RjMcSd0b5yRdeSFFBKJqeEEGlpHPddNGRhRaO2XVCmhkfGALA/uji86U5hXwTHWnFDmczMjauAse5mWz06nBJATchwD1w34mKKERv0nG7Ifbeq7s69+kLeGd6YOQwIDAQAB',
            ],
        });
    }
}
