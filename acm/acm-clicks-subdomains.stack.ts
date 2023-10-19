import { BabbelAcmAws } from '../generated/modules/babbel/acm/aws';
import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsRoute53Zone } from '@cdktf/provider-aws/lib/data-aws-route53-zone';
import { ProviderStack } from '../stacks/base/provider.stack';

export class AcmClicksSubdomainsStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        dataRoute53Zones: Map<string, DataAwsRoute53Zone>,
        providers: ProviderStack,
    ) {
        super(scope, id);

        const domains = env.brazeClickDomains;

        for (let i = 0; i < domains.length; i++) {
            const certDomains = domains[i];
            const sans: string[] = [];
            const domainNamesToZoneIds: { [key: string]: string } = {};

            for (const domain of certDomains) {
                const tmp = domain.split('.');

                if (tmp[0] === 'clicks') {
                    tmp.shift();
                }

                if (tmp[0] === 'partners') {
                    tmp.shift();
                }

                const rootDomain = tmp.join('.');

                const zone = dataRoute53Zones.get(rootDomain);

                sans.push(domain);

                domainNamesToZoneIds[domain] = zone!.id;
            }

            new BabbelAcmAws(scope, `acm-clicks-subdomains-${certDomains[0]}`, {
                primaryDomainName: certDomains[0],
                domainNamesToZoneIds: domainNamesToZoneIds,
                providers: [providers.awsUsEast1],
            });
        }
    }
}
