import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainYoureCasino extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, loadbalancerSuite: DataAwsLb) {
        super(scope, id);

        const domain = 'youre.casino';

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

        //braze

        new Route53Record(this, `record-${domain}-marketing`, {
            zoneId: zone.id,
            name: 'marketing',
            type: 'CNAME',
            ttl: 300,
            records: ['eu.sparkpostmail.com.'],
        });

        new Route53Record(this, `record-${domain}-marketing-verification`, {
            zoneId: zone.id,
            name: 'scph0623._domainkey.marketing',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJy9SlJ55wshC9UKcHqrzhgqVCCEDnHmj7cs4piWyUb/qox7/mXV2z2H2McSgikTVNQLPuRKID6YZgQyILFRCHJQTdRbyQZaBUtnjK/W6AwKdc4zJY1z1D01wTuxVXJVCGwRZDFK/up+R6H6FiEQ8Xocs49cY9Q/Zo1FzbDrKsvwIDAQAB',
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
            name: 'scph0623._domainkey.service',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDVI2mNpecFMOZx3HX+dwEt6daQCqdSSDjMLa+0Fj9yDPBYBU0mlOWl/37Ox7Kve4vprDQfspLYVyq+NwkSEnieH2DuvvAqbxwjm63601yG3tE3ONP01DBwZ8xXAZnLZF6o78P9EQJzEiXc916EieOqJQv0jVcFJWnUQU5+ERkJQQIDAQAB',
            ],
        });
    }
}
