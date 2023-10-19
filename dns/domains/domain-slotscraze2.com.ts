import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainSlotsCraze2Com extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, loadbalancerSuite: DataAwsLb, delegationSetId: string) {
        super(scope, id);

        const domain = 'slotscraze2.com';

        const zone = new Route53Zone(this, `zone-${domain}`, {
            name: domain,
            tags: {
                Name: domain,
            },
            delegationSetId: delegationSetId,
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
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHoT6Cx3VYHuIXXTaBV+8XRco0ewT6ueCcWaagTpiI5fsdKVf5IcGAbhUdFE4F52hEie7PskHBLVoMFYSjKBV55NeRcIQ+jvgbuhX77dA5OEv5ixv033dBmHAn5Mh8oOzotn9PE1ecGWHHo6q1Q0+auzZSfT8EqoxMvgb/u8cHQQIDAQAB',
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
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfguqaIoUsY6iY2uWuU7klBEy6P6TA6MH8cx1vblj1U7NAcvInpOmf/bHmV/DDfMwsZ7AqDLP0qRfSk4qAz/xszBf5xeI0gO/swlZeVuJUPpmB0AFc1JuZOMFe1EiAB+kGMuSgqf1X7ClzFqqlWIHvHFLiCnn52nJUPDD1pFsi5QIDAQAB',
            ],
        });
    }
}
