##Zetta FONA SIM serial device driver

###Install

```
$> npm install zetta-fona-sim-serial-driver
```

###Usage

```
var zetta = require('zetta');
var FonaSIM = require('zetta-fona-sim-serial-driver');

zetta()
  .use(FonaSIM)
  .listen(1337)
```

### Hardware

* any platform

###Transitions

#####get-battery-voltage()

#####get-adc-voltage()

###Design

