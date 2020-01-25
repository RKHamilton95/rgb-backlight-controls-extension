const { Extension, log, INPUT_METHOD, PLATFORMS } = require("deckboard-kit");
const serialPort = require("serialport");

class MyExtension extends Extension {
  constructor() {
    super();
    this.name = "RGBBacklightLauncher";
    this.configs = {
      serialPath: {
        type: INPUT_METHOD.INPUT_TEXT,
        name: "path",
        descriptions: "Path to serial",
        value: "COM4"
      }
    };
    this.serial = new serialPort(
      this.configs.serialPath.value,
      {
        baudRate: 9600,
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
    log.error("Inside Write Serial");
    this.serial.write(message);
  }

  execute(action, { state, colorState }) {
    log.error("Execute");
    switch (action) {
      case "rgbBacklightState":
        log.error("rgbBacklightState");
        switch (state) {
          case "off":
            log.error("SERIAL_AT_OFF: ");
            this.writeSerial("OFF\n");
            break;
          case "on":
            log.error("SERIAL_AT_ON: ");
            this.writeSerial("ON\n");
            break;
        }
        break;
      default:
        break;
    }
  }
}

module.exports = new MyExtension();
