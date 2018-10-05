const JOB = 'Engineer';
const TEAM = 4;
const USERNAME = 'EasyWidget';
const ADDRESS = '92.222.88.16';
//const ADDRESS = 'localhost';
const PORT = '9090';
//const PORT = '8080';

let g_life = 100;

class ClientPU {
  constructor(
    address = ADDRESS,
    port = PORT,
    team = TEAM,
    username = USERNAME,
    job = JOB,
  ) {
    this.ws = new WebSocket(
      `ws://${address}:${port}?team=${team}&username=${username}&job=${job}`,
    );
    this.power_widget = new PowerWidget(this.emitter.bind(this));
    this.init();
  }

  init() {
    this.ws.addEventListener('open', () => {
      console.log('ouvert');
    });

    this.ws.addEventListener('message', event => {
      const deserialized = JSON.parse(event.data);
      try {
        const data = deserialized.data;
        const shield_power = parseFloat(data.shieldPower, 10);
        const thruster_power = parseFloat(data.thrusterPower, 10);
        const system_power = parseFloat(data.systemPower, 10);
        g_life = parseInt(data.life, 10);

        this.power_widget.setPowers(shield_power, system_power, thruster_power);
        console.log(
          'server setting shield, system, thruster to:',
          shield_power,
          system_power,
          thruster_power,
        );
        // auto logic
        if (document.getElementById('PUauto').checked) {
          if (g_life <= 25) {
            this.ws.send(
              JSON.stringify({
                name: 'spaceship:system:power',
                data: {power: 1},
              }),
            );
          } else {
            this.ws.send(
              JSON.stringify({
                name: 'spaceship:system:power',
                data: {power: 0.33},
              }),
            );
          }
        }
      } catch (e) {
        console.log('server responded with error', deserialized);
      }
    });
  }

  emitter(module, value) {
    switch (module) {
      case g_suffix.shield:
        this.ws.send(
          JSON.stringify({
            name: 'spaceship:shield:power',
            data: {power: value},
          }),
        );
        break;
      case g_suffix.system:
        this.ws.send(
          JSON.stringify({
            name: 'spaceship:system:power',
            data: {power: value},
          }),
        );
        break;
      case g_suffix.thruster:
        this.ws.send(
          JSON.stringify({
            name: 'spaceship:thruster:power',
            data: {power: value},
          }),
        );
        break;
    }
  }
}

const client = new ClientPU();
