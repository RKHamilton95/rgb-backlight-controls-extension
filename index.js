const { Extension, log, INPUT_METHOD, PLATFORMS } = require("deckboard-kit");
const serialPort = require("serialport");

class RGBBacklightExtension extends Extension {
  constructor() {
    super();
    this.name = "RGBBacklightLauncher";
    this.configs = {
      serialPath: {
        type: "object",
        name: "path",
        descriptions: "Path to serial",
        value: {
          path: "COM3",
          baudRate: 9600
        }
      }
    };
    this.serial = new serialPort(
      this.configs.serialPath.value.path,
      {
        baudRate: this.configs.serialPath.value.baudRate,
        autoOpen: true
      },
      function(err) {
        if (err) {
          return log.error("Error: ", err.message);
        }
      }
    );
    this.platforms = [PLATFORMS.WINDOWS];
    this.inputs = [
      {
        label: "Backlight State",
        value: "rgbBacklightState",
        icon: "sun",
        fontIcon: "fab",
        color: "#171A21",
        input: [
          {
            label: "State",
            ref: "state",
            type: INPUT_METHOD.INPUT_SELECT,
            items: [
              {
                label: "Turn OFF",
                value: "off"
              },
              {
                label: "Turn ON",
                value: "on"
              }
            ]
          }
        ]
      }
    ];
  }

  writeSerial(message) {
    this.serial.write(message);
  }

  execute(action, { state, colorState }) {
    log.error("Execute");
    switch (action) {
      case "rgbBacklightState":
        switch (state) {
          case "off":
            this.writeSerial("OFF\n");
            break;
          case "on":
            this.writeSerial("ON\n");
            break;
        }
        break;
      default:
        break;
    }
  }
}

module.exports = new RGBBacklightExtension();
