const g_suffix = {
  thruster: 1,
  shield: 2,
  system: 3,
};

let g_steps = 0.03;

class PowerUnit {
  constructor(label, module, mutate_power, power = 0.33) {
    this.label = label;
    this.module = module;
    this.power = power;
    this.mutate = mutate_power;
  }

  setPower(new_power) {
    this.power = new_power;
    const power = document.getElementById(`PUvalue${this.module}`);
    const slider = document.getElementById(`PUpower_ranger${this.module}`);
    power.textContent = Math.round(this.power * 100) + '%';
    slider.value = this.power;
  }

  generateHTML(suffix) {
    const HTML = document.createElement('div');
    HTML.innerHTML = `
            <div>
                <div id="PUlabel${suffix}">${this.label}</div>
                <div id="PUvalue${suffix}">${Math.round(
      this.power * 100,
    )}%</div>
            </div>
            <div>
                <button id="PUminus${suffix}">-</button>
                <input id="PUpower_ranger${suffix}" type="range" max="1" min="0" step="${g_steps}" value="${
      this.power
    }"/>
                <button id="PUplus${suffix}">+</button>
            </div>
            `;
    const mutate_minus = HTML.children[1].children[`PUminus${suffix}`];
    const mutate_plus = HTML.children[1].children[`PUplus${suffix}`];
    const power_ranger = HTML.children[1].children[`PUpower_ranger${suffix}`];
    mutate_minus.addEventListener('click', () => {
      this.mutate(
        parseFloat(this.power, 10) - parseFloat(g_steps, 10),
        this.module,
      );
    });
    mutate_plus.addEventListener('click', () => {
      this.mutate(
        parseFloat(this.power, 10) + parseFloat(g_steps, 10),
        this.module,
      );
    });
    power_ranger.addEventListener('mouseup', () => {
      this.mutate(parseFloat(power_ranger.value, 10), this.module);
    });
    return HTML;
  }
}

class PowerWidget {
  constructor(emitter) {
    this.maxPower = 1;
    this.PUthruster = new PowerUnit(
      'Thruster',
      g_suffix.thruster,
      this.changePower.bind(this),
    );
    this.PUshield = new PowerUnit(
      'Shield',
      g_suffix.shield,
      this.changePower.bind(this),
    );
    this.PUsystem = new PowerUnit(
      'System',
      g_suffix.system,
      this.changePower.bind(this),
    );
    this.init();
    this.emitter = emitter;
    this.keyId = null;
  }

  init() {
    const anchor = document.getElementById('power_widget');
    const infos = document.createElement('div');
    infos.setAttribute('id', 'PUinfo');
    infos.innerHTML = `
    <label>auto<input id="PUauto" type="checkbox" checked="true"/></label>
    <label>steps
    <input type="number" min="0.01" max="1" step="0.01" value="${g_steps}" />
    </label>
    <label>life <span id="PUlife">${g_life}</span></label>
    `;
    infos.children[1].addEventListener('change', event => {
      g_steps = parseFloat(event.target.value, 10) / 10;
    });
    anchor.appendChild(infos);
    anchor.appendChild(this.PUthruster.generateHTML(g_suffix.thruster));
    anchor.appendChild(this.PUshield.generateHTML(g_suffix.shield));
    anchor.appendChild(this.PUsystem.generateHTML(g_suffix.system));
    this.handleKeyboard();
  }

  changePower(power, module) {
    const delta = 1 - power;
    switch (module) {
      case g_suffix.thruster:
        this.PUthruster.setPower(power);
        this.PUshield.setPower(delta / 2);
        this.PUsystem.setPower(delta / 2);
        break;
      case g_suffix.shield:
        this.PUshield.setPower(power);
        this.PUthruster.setPower(delta / 2);
        this.PUsystem.setPower(delta / 2);
        break;
      case g_suffix.system:
        this.PUsystem.setPower(power);
        this.PUshield.setPower(delta / 2);
        this.PUthruster.setPower(delta / 2);
        break;
    }
    console.log('client setting', module, ' to', power);
    this.emitter(module, power);
  }

  setPowers(shield_power, system_power, thruster_power) {
    this.PUshield.setPower(shield_power);
    this.PUthruster.setPower(thruster_power);
    this.PUsystem.setPower(system_power);
  }

  handleKeyboard() {
    document.onkeydown = event => {
      switch (event.keyCode) {
        case 65:
          this.keyId = g_suffix.thruster;
          break;
        case 90:
          this.keyId = g_suffix.shield;
          break;
        case 69:
          this.keyId = g_suffix.system;
          break;
        case 37:
          switch (this.keyId) {
            case g_suffix.thruster:
              this.changePower(
                this.PUthruster.power - g_steps,
                g_suffix.thruster,
              );
              break;
            case g_suffix.shield:
              this.changePower(this.PUshield.power - g_steps, g_suffix.shield);
              break;
            case g_suffix.system:
              this.changePower(this.PUsystem.power - g_steps, g_suffix.system);
              break;
          }
          break;
        case 39:
          switch (this.keyId) {
            case g_suffix.thruster:
              this.changePower(
                this.PUthruster.power + g_steps,
                g_suffix.thruster,
              );
              break;
            case g_suffix.shield:
              this.changePower(this.PUshield.power + g_steps, g_suffix.shield);
              break;
            case g_suffix.system:
              this.changePower(this.PUsystem.power + g_steps, g_suffix.system);
              break;
          }
          break;
      }
    };
    document.onkeyup = event => {
      switch (event.keyCode) {
        case 65:
          this.keyId = null;
          break;
        case 90:
          this.keyId = null;
          break;
        case 69:
          this.keyId = null;
          break;
      }
    };
  }
}
