import { BaseEnvironment, BootstrapOptions } from '../environments/base-environment';

export class UserDataUtil {
    public static generateSaltMaster(env: BaseEnvironment): string {
        return `#!/bin/bash

set -e
set -x

curl -o bootstrap-salt.sh -L https://bootstrap.saltproject.io
chmod +x bootstrap-salt.sh

mkdir -p /etc/salt/master.d/

cat > /etc/salt/master.d/00-autoaccept.conf <<"EOF"
auto_accept: True
EOF

hostname > /etc/salt/minion_id

cat > /etc/salt/grains <<"EOF"
env: ${env.saltConfig.env}
provider: ec2
region: ${env.saltConfig.region}
EOF

./bootstrap-salt.sh -M`;
    }

    public static generateAptMirror(env: BaseEnvironment): string {
        return `#!/bin/bash

set -e
set -x

curl -o bootstrap-salt.sh -L https://bootstrap.saltproject.io
chmod +x bootstrap-salt.sh

mkdir -p /etc/salt/

hostname > /etc/salt/minion_id

cat > /etc/salt/grains <<"EOF"
env: ${env.saltConfig.env}
provider: ec2
region: ${env.saltConfig.region}
roles:
  - webserver
  - aptmirror
EOF

./bootstrap-salt.sh`;
    }

    public static generateBootstrap(options?: BootstrapOptions): string {
        const params = new URLSearchParams();

        if (options?.launchConfig) {
            params.set('lc', options.launchConfig);
        } else if (options?.roles) {
            params.set('roles', options.roles.join(','));
        }

        if (options?.services) {
            params.set('services', JSON.stringify(options.services));
        }

        const url = `http://bootstrap/?${params.toString()}`;

        return `#!/bin/bash

wget -q -O- "${url}" | bash | tee /root/bootstrap.log;`;
    }
}
