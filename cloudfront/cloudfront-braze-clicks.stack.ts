import { BaseEnvironment } from '../environments/base-environment';
import { CloudfrontDistribution } from '@cdktf/provider-aws/lib/cloudfront-distribution';
import { Construct } from 'constructs';
import { DataAwsRoute53Zone } from '@cdktf/provider-aws/lib/data-aws-route53-zone';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { SslCertificatesStack } from '../stacks/base/ssl-certificates.stack';

export class CloudfrontBrazeClicksStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        sslCertificates: SslCertificatesStack,
        dataRoute53Zones: Map<string, DataAwsRoute53Zone>,
    ) {
        super(scope, id);

        const originId = `Custom-${env.brazeClicksOrigin}`;

        let i = 0;

        for (const domains of env.brazeClickDomains) {
            const distribution = new CloudfrontDistribution(this, `cloudfront-clicks-${i}`, {
                enabled: true,
                isIpv6Enabled: true,

                viewerCertificate: {
                    acmCertificateArn: sslCertificates.sslBrazeClicks[i].arn,
                    sslSupportMethod: 'sni-only',
                    minimumProtocolVersion: 'TLSv1.2_2021',
                },

                restrictions: {
                    geoRestriction: {
                        restrictionType: 'none',
                    },
                },

                origin: [
                    {
                        originId,
                        domainName: env.brazeClicksOrigin,
                        customOriginConfig: {
                            httpPort: 80,
                            httpsPort: 443,
                            originProtocolPolicy: 'http-only',
                            originSslProtocols: ['TLSv1.2', 'TLSv1.1'],
                        },
                    },
                ],

                aliases: domains,

                defaultCacheBehavior: {
                    allowedMethods: ['GET', 'HEAD'],
                    cachedMethods: ['GET', 'HEAD'],
                    targetOriginId: originId,
                    viewerProtocolPolicy: 'allow-all',
                    forwardedValues: {
                        cookies: {
                            forward: 'all',
                        },
                        headers: [
                            'Host',
                            'Accept-Datetime',
                            'Accept-Encoding',
                            'Accept-Language',
                            'User-Agent',
                            'Referer',
                            'Origin',
                            'X-Forwarded-Host',
                        ],
                        queryString: true,
                    },
                },
            });

            for (const domain of domains) {
                const tmp = domain.split('.');

                if (tmp[0] === 'clicks') {
                    tmp.shift();
                }

                if (tmp[0] === 'partners') {
                    tmp.shift();
                }

                const rootDomain = tmp.join('.');

                const zone = dataRoute53Zones.get(rootDomain);

                if (zone) {
                    new Route53Record(this, `record-${rootDomain}-clicks`, {
                        zoneId: zone.id,
                        name: domain.replace(rootDomain, ''),
                        type: 'A',
                        alias: {
                            name: distribution.domainName,
                            zoneId: distribution.hostedZoneId,
                            evaluateTargetHealth: false,
                        },
                    });
                }
            }

            i++;
        }
    }
}
