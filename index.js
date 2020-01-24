const { Extension, log, INPUT_METHOD, PLATFORMS } = require("deckboard-kit");
const serialPort = require("serialport");

class MyExtension extends Extension {
  constructor(serial) {
    super();
    this.name = "RGBBacklightLauncher";
    this.serial = serial;
    this.platforms = [PLATFORMS.WINDOWS];
    this.configs = {};
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
      },
      {
        label: "RGB Color",
        value: "rgbColorState",
        icon: "sun",
        fontIcon: "fab",
        color: "#171A21",
        type: INPUT_METHOD.INPUT_SELECT,
        input: [
          {
            label: "ColorState",
            ref: "colorState",
            type: INPUT_METHOD.INPUT_COLOR,
            items: [
              {
                label: "Change_Color",
                value: "color"
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
      case "rgbColorState":
        switch (colorState) {
          case "color":
            this.writeSerial("COLOR");
        }
      default:
        break;
    }
  }
}

var serial = new serialPort(
  "COM4",
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

module.exports = new MyExtension(serial);
