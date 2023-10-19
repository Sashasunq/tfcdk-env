import { AuthStack } from '../infrastructure/auth.stack';
import { Construct } from 'constructs';
import { Lb } from '@cdktf/provider-aws/lib/lb';
import { LbListener } from '@cdktf/provider-aws/lib/lb-listener';
import { LbListenerCertificate } from '@cdktf/provider-aws/lib/lb-listener-certificate';
import { LbListenerRule, LbListenerRuleConfig } from '@cdktf/provider-aws/lib/lb-listener-rule';
import { MicroServiceStack } from '../product/micro-service.stack';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { SslCertificatesStack } from '../base/ssl-certificates.stack';
import { VpcStack } from '../base/vpc.stack';
import { WebserverPoolStack } from '../product/webserver-pool.stack';
import { GrafanaStack } from '../infrastructure/grafana.stack';

export class LoadbalancerServicesStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        vpc: VpcStack,
        securityGroups: SecurityGroupsStack,
        sslCertificates: SslCertificatesStack,
        webserverPools: Map<string, WebserverPoolStack>,
        auth: AuthStack,
        grafana: GrafanaStack,
        microServices: Map<string, MicroServiceStack>,
    ) {
        super(scope, id);

        const lb = new Lb(scope, 'elb-services', {
            name: 'elb-services',
            internal: false,
            loadBalancerType: 'application',
            securityGroups: [securityGroups.get('default'), securityGroups.get('http'), securityGroups.get('https')],
            subnets: vpc.publicSubnets,
            preserveHostHeader: true,
            idleTimeout: 120,
            tags: {
                Name: 'elb-services',
                'map-migrated': 'd-server-00agfbylfxkr4x',
            },
        });

        const listenerHttp = new LbListener(scope, `elb-services-listener-http`, {
            loadBalancerArn: lb.arn,
            port: 80,
            protocol: 'HTTP',
            defaultAction: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                },
            ],
        });

        const listenerHttps = new LbListener(scope, `elb-services-listener-https`, {
            loadBalancerArn: lb.arn,
            port: 443,
            protocol: 'HTTPS',
            defaultAction: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                },
            ],
            certificateArn: sslCertificates.sslWhowNet.arn,
        });

        new LbListenerCertificate(scope, `elb-services-listener-https-jackpot-de`, {
            listenerArn: listenerHttps.arn,
            certificateArn: sslCertificates.sslJackpotDe.arn,
        });

        let dartCasinoSslCount = 0;

        for (const dartCasinoCertificate of sslCertificates.sslDartcasinos) {
            new LbListenerCertificate(scope, `elb-services-listener-https-dartcasinos-${dartCasinoSslCount}`, {
                listenerArn: listenerHttps.arn,
                certificateArn: dartCasinoCertificate.arn,
            });

            dartCasinoSslCount++;
        }

        new LbListenerCertificate(scope, `elb-services-listener-https-tigerking-de`, {
            listenerArn: listenerHttps.arn,
            certificateArn: sslCertificates.sslTigerkingDe.arn,
        });

        // AUTH
        const ruleAuth: Partial<LbListenerRuleConfig> = {
            priority: 300,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: auth.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: { values: ['auth.whow.net'] },
                },
            ],
        };

        new LbListenerRule(scope, 'elb-services-http-rule-auth', <LbListenerRuleConfig>{
            ...ruleAuth,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, 'elb-services-https-rule-auth', <LbListenerRuleConfig>{
            ...ruleAuth,
            listenerArn: listenerHttps.arn,
        });

        // AUTH
        const ruleGrafana: Partial<LbListenerRuleConfig> = {
            priority: 310,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: grafana.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: { values: ['grafana.whow.net'] },
                },
            ],
        };

        new LbListenerRule(scope, 'elb-services-http-rule-grafana', <LbListenerRuleConfig>{
            ...ruleGrafana,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, 'elb-services-https-rule-grafana', <LbListenerRuleConfig>{
            ...ruleGrafana,
            listenerArn: listenerHttps.arn,
        });

        // TPIXELTOOL
        const ruleTpixeltool: Partial<LbListenerRuleConfig> = {
            priority: 250,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('tpixeltool-49')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: { values: ['tpixeltool-49.whow.net'] },
                },
            ],
        };

        new LbListenerRule(scope, 'elb-services-http-rule-tpixeltool', <LbListenerRuleConfig>{
            ...ruleTpixeltool,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, 'elb-services-https-rule-tpixeltool', <LbListenerRuleConfig>{
            ...ruleTpixeltool,
            listenerArn: listenerHttps.arn,
        });

        // CRWDTOOL
        const ruleCrwdtool: Partial<LbListenerRuleConfig> = {
            priority: 249,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('crwdtool-46')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: { values: ['crwdtool-46.whow.net'] },
                },
            ],
        };

        new LbListenerRule(scope, 'elb-services-http-rule-crwdtool', <LbListenerRuleConfig>{
            ...ruleCrwdtool,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, 'elb-services-https-rule-crwdtool', <LbListenerRuleConfig>{
            ...ruleCrwdtool,
            listenerArn: listenerHttps.arn,
        });

        // OFFERAI
        const ruleOfferai: Partial<LbListenerRuleConfig> = {
            priority: 240,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('offerai-54')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['offerai2acp-68.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-offerai`, <LbListenerRuleConfig>{
            ...ruleOfferai,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-offerai`, <LbListenerRuleConfig>{
            ...ruleOfferai,
            listenerArn: listenerHttps.arn,
        });

        // CONTENTCONTROL
        const ruleContentcontrol: Partial<LbListenerRuleConfig> = {
            priority: 230,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('contentcontrol-110')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['contentcontrol.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-contentcontrol`, <LbListenerRuleConfig>{
            ...ruleContentcontrol,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-contentcontrol`, <LbListenerRuleConfig>{
            ...ruleContentcontrol,
            listenerArn: listenerHttps.arn,
        });

        // ARCADEGAMES
        const ruleArcadegames: Partial<LbListenerRuleConfig> = {
            priority: 140,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('arcadegames-112')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: { values: ['arcadegames-112.whow.net'] },
                },
            ],
        };

        new LbListenerRule(scope, 'elb-services-http-rule-arcadegames', <LbListenerRuleConfig>{
            ...ruleArcadegames,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, 'elb-services-https-rule-arcadegames', <LbListenerRuleConfig>{
            ...ruleArcadegames,
            listenerArn: listenerHttps.arn,
        });

        // EVENTLOG
        const ruleEventlog: Partial<LbListenerRuleConfig> = {
            priority: 145,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['eventlog-31.whow.net', 'eventlog.jackpot.de'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-pool-02-eventlog`, <LbListenerRuleConfig>{
            ...ruleEventlog,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-pool-02-eventlog`, <LbListenerRuleConfig>{
            ...ruleEventlog,
            listenerArn: listenerHttps.arn,
        });

        // KRAKEN
        const ruleKraken: Partial<LbListenerRuleConfig> = {
            priority: 146,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['kraken-71.whow.net', 'kraken.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-pool-02-kraken`, <LbListenerRuleConfig>{
            ...ruleKraken,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-pool-02-kraken`, <LbListenerRuleConfig>{
            ...ruleKraken,
            listenerArn: listenerHttps.arn,
        });

        // SHAREDSTORAGE
        const ruleSharedstorage: Partial<LbListenerRuleConfig> = {
            priority: 147,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['shared.jackpot.de', 'sharedstorage-28.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-pool-02-sharedstorage`, <LbListenerRuleConfig>{
            ...ruleSharedstorage,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-pool-02-sharedstorage`, <LbListenerRuleConfig>{
            ...ruleSharedstorage,
            listenerArn: listenerHttps.arn,
        });

        // MISC
        const ruleMisc: Partial<LbListenerRuleConfig> = {
            priority: 148,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: [
                            'idleconfig-65.whow.net',
                            'partnerrss-87.whow.net',
                            'prizetool-41.whow.net',
                            'usercom2-25.whow.net',
                        ],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-pool-02-misc`, <LbListenerRuleConfig>{
            ...ruleMisc,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-pool-02-misc`, <LbListenerRuleConfig>{
            ...ruleMisc,
            listenerArn: listenerHttps.arn,
        });

        // MAILGATEWAY
        const ruleMailgateway: Partial<LbListenerRuleConfig> = {
            priority: 149,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('mailgateway-92')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: { values: ['mailgateway-92.whow.net'] },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-mailgateway`, <LbListenerRuleConfig>{
            ...ruleMailgateway,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-mailgateway`, <LbListenerRuleConfig>{
            ...ruleMailgateway,
            listenerArn: listenerHttps.arn,
        });

        // MISC 02
        const ruleMisc02: Partial<LbListenerRuleConfig> = {
            priority: 150,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['lt.jackpot.de', 'layertool-37.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-pool-02-misc-02`, <LbListenerRuleConfig>{
            ...ruleMisc02,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-pool-02-misc-02`, <LbListenerRuleConfig>{
            ...ruleMisc02,
            listenerArn: listenerHttps.arn,
        });

        // POOL-03
        const rulePool03: Partial<LbListenerRuleConfig> = {
            priority: 160,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-03')?.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['casinoappassets-302.whow.net', 'casinoappassetsindep-303.whow.net', 'retrocasinoappassets-304.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-pool-03`, <LbListenerRuleConfig>{
            ...rulePool03,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-pool-03`, <LbListenerRuleConfig>{
            ...rulePool03,
            listenerArn: listenerHttps.arn,
        });

        // PAYMENT
        const rulePayment: Partial<LbListenerRuleConfig> = {
            priority: 130,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-05')?.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['payment-39.whow.net', 'payment.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-pool-05`, <LbListenerRuleConfig>{
            ...rulePayment,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-pool-05`, <LbListenerRuleConfig>{
            ...rulePayment,
            listenerArn: listenerHttps.arn,
        });

        // Treasurehunt2
        const ruleTreasureHunt2: Partial<LbListenerRuleConfig> = {
            priority: 155,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('treasurehunt2-76')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['treasurehunt2-76.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-treasurehunt2`, <LbListenerRuleConfig>{
            ...ruleTreasureHunt2,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-treasurehunt2`, <LbListenerRuleConfig>{
            ...ruleTreasureHunt2,
            listenerArn: listenerHttps.arn,
        });

        // TIGERKING
        const ruleTigerking: Partial<LbListenerRuleConfig> = {
            priority: 180,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('tigerking-119')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['api.tigerking.de'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-services-http-rule-tigerking`, <LbListenerRuleConfig>{
            ...ruleTigerking,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-services-https-rule-tigerking`, <LbListenerRuleConfig>{
            ...ruleTigerking,
            listenerArn: listenerHttps.arn,
        });

        // DARTCASINOS
        const rulesDartcasino: Partial<LbListenerRuleConfig>[] = [
            {
                priority: 190,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: [
                                'barneysslots.com',
                                'www.barneysslots.com',
                                'thepower-slots.com',
                                'www.thepower-slots.com',
                                'barney-slots.com',
                            ],
                        },
                    },
                ],
            },
            {
                priority: 191,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: [
                                'www.barney-slots.com',
                                'snakebite-slots.com',
                                'www.snakebite-slots.com',
                                'snakebiteslots.com',
                                'www.snakebiteslots.com',
                            ],
                        },
                    },
                ],
            },
            {
                priority: 192,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: [
                                'barneyslots.com',
                                'www.barneyslots.com',
                                'thepowerslots.com',
                                'www.thepowerslots.com',
                                'knossikasino.de',
                            ],
                        },
                    },
                ],
            },
            {
                priority: 193,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: [
                                'www.knossikasino.de',
                                'knossicasino.de',
                                'www.knossicasino.de',
                                'knossi-kasino.de',
                                'www.knossi-kasino.de',
                            ],
                        },
                    },
                ],
            },
            {
                priority: 194,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: ['knossi-casino.de', 'www.knossi-casino.de', 'truckercasino.de', 'www.truckercasino.de', '51casino.de'],
                        },
                    },
                ],
            },
            {
                priority: 195,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: [
                                'www.51casino.de',
                                'playboy51casino.de',
                                'www.playboy51casino.de',
                                'whiteycasino.de',
                                'www.whiteycasino.de',
                            ],
                        },
                    },
                ],
            },
            {
                priority: 196,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: [
                                'venuscasino.de',
                                'www.venuscasino.de',
                                'venus-casino.de',
                                'www.venus-casino.de',
                                'philtaylorcasino.com',
                            ],
                        },
                    },
                ],
            },

            {
                priority: 197,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: [
                                'www.philtaylorcasino.com',
                                'phil-taylor-casino.com',
                                'www.phil-taylor-casino.com',
                                'jackpotduo.de',
                                'www.jackpotduo.de',
                            ],
                        },
                    },
                ],
            },
            {
                priority: 198,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: ['jackpot-duo.de', 'www.jackpot-duo.de', 'gamer-casino.de', 'www.gamers-casino.de', 'wawawulff.de'],
                        },
                    },
                ],
            },
            {
                priority: 199,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: [
                                'www.wawawulff.de',
                                'dr-sindsencasino.com',
                                'www.dr-sindsencasino.com',
                                'dr-sindsencasino.de',
                                'wwww.dr-sindsencasino.de',
                            ],
                        },
                    },
                ],
            },
            {
                priority: 200,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: webserverPools.get('pool-02')?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: ['drsindsencasino.de', 'wwww.drsindsencasino.de'],
                        },
                    },
                ],
            },
        ];

        let i = 1;

        for (const rule of rulesDartcasino) {
            new LbListenerRule(scope, `elb-services-http-rule-pool-02-dartcasinos-${i}`, <LbListenerRuleConfig>{
                ...rule,
                listenerArn: listenerHttp.arn,
            });

            new LbListenerRule(scope, `elb-services-https-rule-pool-02-dartcasinos-${i}`, <LbListenerRuleConfig>{
                ...rule,
                listenerArn: listenerHttps.arn,
            });

            i++;
        }
    }
}
