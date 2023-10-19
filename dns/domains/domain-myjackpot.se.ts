import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainMyjackpotSe extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, loadbalancerSuite: DataAwsLb) {
        super(scope, id);

        const domain = 'myjackpot.se';

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

        new Route53Record(this, `record-${domain}-txt`, {
            zoneId: zone.id,
            name: domain,
            type: 'TXT',
            ttl: 300,
            records: [env.defaultSpf, 'google-site-verification=MulUlry7LthXCF1gxzGGnrJMZxkWXItzdnKiuYq5wy4'],
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
            name: 'scph0320._domainkey.marketing',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDeh1O4kEta7d8mhbvUGoDtYam9SCDTNIDo6RkCSaDhdtc1cYxQnp/Awj7X/G5Dzt7Z0DbR1E+XRzD28Gl9uRvm1Vrb/UAsmLNlQPhO9n3cv2qMiYDLM5Wg12/11wjNF8amPGsdKtt032OHHbtQibH6cPww/ffH+jPPPLp6sRjQWwIDAQAB',
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
            name: 'scph0320._domainkey.service',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcWjQd8F0QL0EBmdlYff7TX00yWNBs+UtZq5ZYGUcHy3KS97q7a3GUYZpDRtr/vAu97HPCOM2a3tkpXF2lj60rZ+uq82bFnqiqKzNrOJMoozpWYNixp06l9DpExbRzpmp1sRsw+nVyBgQhrSQc4KDqlmXlcVuOdRMqr2GfyfepYQIDAQAB',
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

        new Route53Record(this, `record-${domain}-sendgrid-em8799`, {
            zoneId: zone.id,
            name: 'em8799',
            type: 'CNAME',
            ttl: 300,
            records: ['u2320378.wl129.sendgrid.net.'],
        });
    }
}
