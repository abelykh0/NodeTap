var os = require('os');
var fs = require('fs');
var platform = require('./platform');

if (os.platform() == 'win32') {
  var nodetapwindows = require('bindings')('./nodetapwindows');
}
else {
  var nodetaplinux = require('bindings')('./nodetaplinux');
}

class NodeTap {
  constructor(handle) {
    this._handle = handle;
  }

  _handle;
}


exports.setupTun = function setupTun() {
  if (os.platform() == 'win32') {
    var handle = nodetapwindows.openTap();

    nodetapwindows.configDhcp(handle, "10.0.0.1", "255.255.255.0", "10.0.0.254");
    nodetapwindows.dhcpSetOptions(handle,
      "10.0.0.2",          // Default gateway
      "8.8.8.8", "8.8.4.4" // DNS servers
    );
    nodetapwindows.configTun(handle, "10.0.0.1", "10.0.0.0", "255.255.255.0");
    nodetapwindows.setMediaStatus(handle, true);

    var result = new NodeTap(handle);

    result.read = function (packet, length, func) {
      return nodetapwindows.read(this._handle, packet, length, func);
    }

    result.readSync = function (packet, length) {
      return nodetapwindows.readSync(this._handle, packet, length);
    }

    result.write = function (packet, length, func) {
      return nodetapwindows.write(this._handle, packet, length, func);
    }

    result.writeSync = function (packet, length) {
      return nodetapwindows.writeSync(this._handle, packet, length);
    }

    result.close = function () {
      return nodetapwindows.close(this._handle);
    }

    return result;
  }
  else {
    var handle = nodetaplinux.openTap();
    var result = new NodeTap(handle);

    result.read = function (packet, length, func) {
      return fs.read(this._handle, packet, 0, length, null, func);
    }

    result.readSync = function (packet, length) {
      return fs.readSync(this._handle, packet, 0, length);
    }

    result.write = function (packet, length, func) {
      return fs.write(this._handle, packet, 0, length, null, func);
    }

    result.writeSync = function (packet, length) {
      return fs.writeSync(this._handle, packet, 0, length);
    }

    result.close = function () {
      platform.runScript('interface-shutdown', ["tun"], cb);
      return fs.closeSync(this._handle);
    }

    //platform.runScript('interface-setup', ["10.0.0.1", "tun"], postSetup);

    return result;
  }
}
