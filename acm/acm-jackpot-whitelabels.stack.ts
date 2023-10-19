import { BabbelAcmAws } from '../generated/modules/babbel/acm/aws';
import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsRoute53Zone } from '@cdktf/provider-aws/lib/data-aws-route53-zone';

export class AcmJackpotWhitelabelsStack extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, dataRoute53Zones: Map<string, DataAwsRoute53Zone>) {
        super(scope, id);

        const domains = [
            ['7reelz.com', 'lounge777.com', 'slotigo.com', 'maryvegas.com', 'veravegas.com'],
            ['dinocasino.games', 'spintales-slots.com', 'misterjackpot.it'],
            ['scatterwolf.com'],
            ['merkur24.com'],
            ['videoslots.casino'],
            ['youre.casino'],
            ['slotscraze2.com'],
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

            new BabbelAcmAws(scope, `acm-jackpot-whitelabels-${certDomains[0]}`, {
                primaryDomainName: certDomains[0],
                domainNamesToZoneIds: domainNamesToZoneIds,
            });
        }
    }
}
