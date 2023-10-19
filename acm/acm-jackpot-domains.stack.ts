import { BabbelAcmAws } from '../generated/modules/babbel/acm/aws';
import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsRoute53Zone } from '@cdktf/provider-aws/lib/data-aws-route53-zone';

export class AcmJackpotDomainsStack extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, dataRoute53Zones: Map<string, DataAwsRoute53Zone>) {
        super(scope, id);

        const domains = [
            ['jackpot.at', 'jackpot.de', 'jackpot.it', 'jackpot.pl', 'mojjackpot.pl'],
            ['mrmanchot.fr', 'myjackpot.com', 'myjackpot.com.br', 'myjackpot.co.uk', 'myjackpot.es'],
            ['myjackpot.fr', 'myjackpot.se', 'myjackpot.pt', 'myjackpot.hu', 'myjackpot.dk'],
            ['myjackpot.ro'],
        ];

        for (let i = 0; i < domains.length; i++) {
            const certDomains = domains[i];
            const sans = [];
            const domainNamesToZoneIds: { [key: string]: string } = {};

            for (const domain of certDomains) {
                const zone = dataRoute53Zones.get(domain);

                sans.push(domain);
                sans.push(`www.${domain}`);

                domainNamesToZoneIds[domain] = zone!.id;
                domainNamesToZoneIds[`www.${domain}`] = zone!.id;
            }

            new BabbelAcmAws(scope, `acm-jackpot-domains-${i}`, {
                primaryDomainName: certDomains[0],
                domainNamesToZoneIds: domainNamesToZoneIds,
            });
        }
    }
}
