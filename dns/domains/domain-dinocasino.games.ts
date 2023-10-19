import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainDinocasinoGames extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, loadbalancerSuite: DataAwsLb) {
        super(scope, id);

        const domain = 'dinocasino.games';

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
            records: ['10 mx00.udag.de', '20 mx01.udag.de'],
        });

        new Route53Record(this, `record-${domain}-txt`, {
            zoneId: zone.id,
            name: domain,
            type: 'TXT',
            ttl: 300,
            records: [
                env.defaultSpf,
                'google-site-verification=iTaBoagwfVhuam6QKp-0HIVUDJuuBx5Q92E-pbEuKDc',
                'facebook-domain-verification=c1mah7b45ht18lo7tx10wbm486nkam',
                'google-site-verification=SdZXoSsmExTvry-Y_hjYvlpvU0Q3JXoaT9v8SOzkNKw',
            ],
        });

        new Route53Record(this, `record-${domain}-blog-ns`, {
            zoneId: zone.id,
            name: 'blog',
            type: 'NS',
            ttl: 300,
            records: ['ns5.kasserver.com', 'ns6.kasserver.com'],
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
            name: 'scph1022._domainkey.marketing',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDKAZE0Ja086HMYhg5DV2ulj00v6FfMeAAv7eGrdoc9P/T0i+A15TS0I392mIWSUH5XSGbSE8f7SEuK3xKsDE/ubcpvP2vRDCsyHDqW3ClWqyNkP7801tSQCaR5imuJX4FA9wg/+eUXKuVz/auI/mpjzUNhd000sdpNugKJjhldhwIDAQAB',
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
            name: 'scph1022._domainkey.service',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+kot+aIhCqiOlpEfPM46gSI+ayk4RlaByRzbuEIv67XDIMPW7S2XOQ5nN7bEqPQI+5/5MhDFzG9s8X85Ei/zyQ1QL3Gt4eoZ9oto/DWlZ3jujQBgbupIEthhUDrGSKv+2YzRqVDsQp8BUQ2KeFQL+9Jcb2F9J2QQKrRTLhlIjPwIDAQAB',
            ],
        });
    }
}
