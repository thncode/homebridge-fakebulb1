var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-fakebulb1", "FakeBulb1", FakeBulbAccessory);
}

function FakeBulbAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.bulbName = config["bulb_name"] || this.name; // fallback to "name" if you didn't specify an exact "bulb_name"
  this.binaryState = 0; // bulb state, default is OFF
  this.log("Starting a fake bulb(1) device with name '" + this.bulbName + "'...");
//  this.search();
}

FakeBulbAccessory.prototype.getPowerOn = function(callback) {
  var powerOn = this.binaryState > 0;
  this.log("Power state for the '%s' is %s", this.bulbName, this.binaryState);
  callback(null, powerOn);
}

FakeBulbAccessory.prototype.setPowerOn = function(powerOn, callback) {
  this.binaryState = powerOn ? 1 : 0; // wemo langauge
  this.log("Set power state for '%s' to %s", this.bulbName, this.binaryState);
  callback(null);
}

FakeBulbAccessory.prototype.getServices = function() {
    var lightbulbService = new Service.Lightbulb(this.name);
    var informationService = new Service.AccessoryInformation();
    
    lightbulbService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerOn.bind(this))
      .on('set', this.setPowerOn.bind(this));

    informationService
        .setCharacteristic(Characteristic.Manufacturer, "Fake Bulb")
        .setCharacteristic(Characteristic.Model, "0")
        .setCharacteristic(Characteristic.SerialNumber, "0000");
    
    return [lightbulbService, informationService];
}
