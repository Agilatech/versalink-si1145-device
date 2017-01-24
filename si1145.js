
const VersalinkDevice = require('@agilatech/versalink-device');
const device = require('@agilatech/si1145');

module.exports = class Si1145 extends VersalinkDevice {

	constructor(options) {

		// The bus/file must be defined. If not supplied in options, then default to i2c-1
  		const i2cBus  = options['bus'] || "/dev/i2c-1";

  		// SI1145 device constructor takes two arguments: the bus/file and the address.
		// In this case, the address is fixed on the hardware, so it is just hardcoded here.
	  	const hardware = new device.Si1145(i2cBus, 0x60);

		super(hardware, options);
  		
	}
}



