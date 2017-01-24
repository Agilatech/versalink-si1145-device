##VersaLink SI1145 IR/Visible/UV light sensor device driver

This device driver is specifically designed to be used with the Agilatech VersaLink IOT System.

###Install
```
$> npm install @agilatech/versalink-si1145-device
```

###Usage
This device driver is designed to be consumed by the Agilatech VersaLink IOT system.
```
const si1145 = require('@agilatech/versalink-si1145-device');
const versalink = require('@agilatech/versalink-server');

versalink()
.use(si1145, [options])  // where [options] define operational paramters -- omit to accept defaults
.listen(<port number>)   // where <port number> is the port on which the zetta server should listen
```

####options
_options_ is an object which contains key/value pairs used for driver configuration.

```
"streamPeriod":<period>
Period in milliseconds for broadcast of streaming values

"devicePoll":<period>
Period in milliseconds in which device will be polled to check for new data

"deltaPercent":<percent>
Percent of the data range which must be exceeded (delta) to qualify as "new" data

"bus":<linux bus device>
Linux filesystem device for hardware bus, i.e. /dev/i2c-1
```
####deltaPercent in detail
_deltaPercent_ is the percentage of the current numerical data range which a polled data value must exceed to be considred "new". As an example, consider a temperature range of 100, a deltaPercent of 2, and the current temerature of 34.  In such a case, a device poll must produce a value of 36 or greater, or 32 or less than in order to be stored as a current value.  35 or 33 will be ignored.  deltaPercent may be any value greater than 0 or less than 100, and may be fractional. If not defined, the default is 5 percent.

####Defining the value ranges
Value ranges may also be defined in the options, and are closely related to deltaPercent.  If not defined, the software will keep track of minimum and maximum values and derive the range from them.  However, that takes time for the software to "learn" the ranges, so they can be defined in the options object:
```
"ir_range":<numeric range>
"visible_range":<numeric range>
"uv_range":<numeric range>
```
where the &lt;numeric range&gt; is a number representing the absolute range of the value.

####options example
Here is an example of an options varible which stream values every 10 seconds, polls the device every second, requires an 8% delta change to register a new monitored value, and defines valid ranges on all parameters:
```
const options = {
    "streamPeriod":10000, 
    "devicePoll":1000, 
    "deltaPercent":8,
    "bus":"/dev/i2c-1",
    "ir_range":20000,
    "visible_range":20000
    "uv_range":11
}
```
(please note that ir and visible values are in lux, while uv is the World Health UV index)

####Default values
If not specified in the options object, the program uses the following default values:
* _streamPeriod_ : 10000 (10,000ms or 10 seconds)
* _devicePoll_ : 1000 (1,000ms or 1 second)
* _deltaPercent_ : 5 (polled values must exceed the range by &plusmn; 5%)
* _bus_ : /dev/i2c-1 (I2C bus 1)

  
####&lt;port number&gt;
Agilatech has definied the open port number 1107 as its standard default for IIOT (Industrial Internet Of Things) server application. In practice, most any port above 1024 may be used.


###Example
Using directly in the zetta server, and accepting all defaults:
```
const zetta = require('zetta');
const light_sensor = require('versalink-si1145-device');
zetta().use(light_sensor).listen(1107);
```

To easily specify some options, simply supply them in an object in the use statement like this:
```
zetta().use(light_sensor, { "bus":"/dev/i2c-0", "devicePoll":8000, "streamPeriod":15000 });
```
Overrides the defaults to initialize the bus on **/dev/i2c-0** with a data monitoring period of **8 seconds** and streaming data every **15 seconds**

###Properties
All drivers contain the following 4 core properties:
1. **state** : the current state of the device, containing either the value *chron-on* or *chron-off* 
to indicate whether the device is monitoring data isochronally (a predefinied uniform time period of device data query).
2. **id** : the unique id for this device.  This device id is used to subscribe to this device streams.
3. **name** : the given name for this device.
4. **type** : the given type category for this device,  (_sensor_, _actuator_, etc)


####Monitored Properties
In the *on* state, the driver software for this device monitors three values.
1. **ir** - infrared light
2. **visible** - visible light
3. **uv** - ultraviolet exposure index


####Streaming Properties
In the *on* state, the driver software continuously streams three values in isochronal 
fashion with a period defined by *streamPeriod*. Note that a *streamPeriod* of 0 disables streaming.
1. **ir_stream**
2. **visible_stream**
3. **uv_stream**
  

###State
This device driver has a binary state: __on__ or __off__. When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition. When on, the device is operations and accepts all commands.  The initial state is _off_.
  
  
###Transitions
1. **turn-on** : Sets the device state to *on*. When on, the device is operational and accepts all commands. Values are streamed, and the device is polled periodically to keep monitored values up to date.

2. **turn-off** : Sets the device state to *off*, When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition.

###Design

This device driver is designed for both streaming and periodic monitored data collection from the Silicon Labs SI1145 sensor.

The driver software does not include any functionality for proximity sensing.  This feature may be enabled in a future release, but don't count on it. The main purpose of this addon is for simple light sensing.

The UV Index provided by the SI1145 sensor is not based on direct UV measurement, but is calculated by the linear releationship of combined IR and Visible sunlight and is weighted according to the CIE Erythemal Action Spectrum.  The resulting UV index is the standardized World Health Organization simplified consumer UV exposure level ranging from 1 to 11.

In any case, this sensor is uncalibrated, so none of the returned values should be considered accurate. The values returned are in the right ballpark within a 15-20% tolerance.


### Hardware

* Beaglebone Black
* Beaglebone Green
* Should also work on Raspberry Pi as well as other Linux SBC


###Copyright
Copyright © 2016 Agilatech. All Rights Reserved.

