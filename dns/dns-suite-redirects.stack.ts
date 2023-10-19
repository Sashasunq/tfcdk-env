import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsSuiteRedirectsStack extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, loadbalancerSuite: DataAwsLb) {
        super(scope, id);

        const domains = [
            'xn--jckpot-bua.de',
            'myjackpot.at',
            'myjackpot.it',
            'jackpot.com.co',
            'jackpot.do',
            'jackpot.gl',
            'jackpot.gratis',
            'jackpot.li',
            'jackpot.pm',
            'jackpot.si',
            'myjackpot.bg',
            'myjackpot.com.ua',
            'myjackpot.cz',
            'myjackpot.fi',
            'myjackpot.gr',
            'myjackpot.hr',
            'myjackpot.ie',
            'myjackpot.im',
            'myjackpot.info',
            'myjackpot.lt',
            'myjackpot.lu',
            'myjackpot.lv',
            'myjackpot.rs',
            'myjackpot.si',
            'myjackpot.sk',
            'jackpot.jp',
            'mega-jackpots.com',
            'mijackpot.es',
            'banditmanchot.fr',
            'monsieurmanchot.com',
            'monsieurmanchot.fr',
            'mrmanchot.com',
            'vera-vegas.com',
            'weravegas.com',
            'wera-vegas.com',
            'veravegas.at',
            'vera-vegas.at',
            'veravegas.ch',
            'vera-vegas.ch',
            'veravegas.de',
            'vera-vegas.de',
            'weravegas.de',
            'wera-vegas.de',
            'veravegas.es',
            'vera-vegas.es',
            'veravegas.fr',
            'vera-vegas.fr',
            'veravegas.it',
            'vera-vegas.it',
            'veravegas.nl',
            'vera-vegas.nl',
            'veravegas.pl',
            'vera-vegas.pl',
            'veravegas.ru',
            'vera-vegas.ru',
            'maryvegas.de',
            'zockenmussbocken.de',
            'zockenmussbocken.tv',
            'zockenmussbocken.at',
            'slotigo.de',
            'slotygo.de',
            'slottigo.com',
            'slottigo.de',
            'slotiego.de',
            'slotiego.com',
            'slotigo.fr',
            'slotigo.pl',
            // 'good-luck.de', # NOT IN OUR AUTODNS
            'lounge777.de',
            '7reelz.de',
            'spintales-casino.de',
            'scatterwulf.com',
        ];

        for (const domain of domains) {
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
        }
    }
}
