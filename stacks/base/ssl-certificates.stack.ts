import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsAcmCertificate } from '@cdktf/provider-aws/lib/data-aws-acm-certificate';
import { ProviderStack } from './provider.stack';

export class SslCertificatesStack extends Construct {
    public sslJackpotDe: DataAwsAcmCertificate;
    public sslWhowNet: DataAwsAcmCertificate;
    public sslEpicWilds: DataAwsAcmCertificate;
    public sslSpielbrause: DataAwsAcmCertificate;
    public sslTigerkingDe: DataAwsAcmCertificate;
    public sslTigerkingDeStaging: DataAwsAcmCertificate[];

    public sslDartcasinos: DataAwsAcmCertificate[];

    public sslJackpotsAndWhitelabels: DataAwsAcmCertificate[];

    public sslRedirects: DataAwsAcmCertificate[];

    public sslBrazeClicks: DataAwsAcmCertificate[];

    constructor(scope: Construct, id: string, env: BaseEnvironment, providers: ProviderStack) {
        super(scope, id);

        this.sslJackpotDe = new DataAwsAcmCertificate(scope, 'ssl-jackpot-de', { domain: '*.jackpot.de' });

        this.sslWhowNet = new DataAwsAcmCertificate(scope, 'ssl-whow-net', { domain: '*.whow.net' });

        this.sslEpicWilds = new DataAwsAcmCertificate(scope, `ssl-epicwilds-com`, { domain: 'epicwilds.com' });

        this.sslDartcasinos = [];

        for (let i = 0; i < env.dartCasinosDomains.length; i++) {
            const rootDomain = env.dartCasinosDomains[i][0];

            this.sslDartcasinos.push(new DataAwsAcmCertificate(scope, `ssl-dartcasinos-${i}`, { domain: rootDomain }));
        }

        this.sslJackpotsAndWhitelabels = [
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-domains-0', { domain: 'jackpot.at' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-domains-1', { domain: 'mrmanchot.fr' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-domains-2', { domain: 'myjackpot.fr' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-domains-3', { domain: 'myjackpot.ro' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-whitelabels-0', { domain: '7reelz.com' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-whitelabels-1', { domain: 'dinocasino.games' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-whitelabels-2', { domain: 'scatterwolf.com' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-whitelabels-3', { domain: 'merkur24.com' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-whitelabels-4', { domain: 'videoslots.casino' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-whitelabels-5', { domain: 'youre.casino' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-whitelabels-6', { domain: 'slotscraze2.com' }),
            new DataAwsAcmCertificate(scope, 'ssl-jackpot-misc-0', { domain: 'dmax.lounge777.com' }),
        ];

        this.sslSpielbrause = new DataAwsAcmCertificate(scope, 'ssl-spielbrause-net', { domain: 'mapi.spielbrause.net' });

        this.sslTigerkingDe = new DataAwsAcmCertificate(scope, 'ssl-tigerking-de', { domain: 'api.tigerking.de' });
        this.sslTigerkingDeStaging = [];
        this.sslTigerkingDeStaging.push(new DataAwsAcmCertificate(scope, 'ssl-api-staging-1-tigerking-de', { domain: 'staging-1-api.tigerking.de' }));
        this.sslTigerkingDeStaging.push(new DataAwsAcmCertificate(scope, 'ssl-api-staging-2-tigerking-de', { domain: 'staging-2-api.tigerking.de' }));


        this.sslRedirects = [];

        for (const elm of Object.values(env.redirectOnlyDomains)) {
            for (let i = 0; i < elm.length; i++) {
                const rootDomain = elm[i][0];

                this.sslRedirects.push(new DataAwsAcmCertificate(scope, `ssl-redirects-${rootDomain}`, { domain: rootDomain }));
            }
        }

        this.sslBrazeClicks = [];

        let i = 0;

        for (const domains of env.brazeClickDomains) {
            this.sslBrazeClicks.push(
                /* Cloudfront SSL _only_ works when certificate is created in US_EAST1 region!*/
                new DataAwsAcmCertificate(scope, `ssl-clicks-${i}`, { domain: domains[0], provider: providers.awsUsEast1 }),
            );

            i++;
        }
    }
}
