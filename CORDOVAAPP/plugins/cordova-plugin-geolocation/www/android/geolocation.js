
var exec = cordova.require('cordova/exec');
var utils = require('cordova/utils');
var PositionError = require('./PositionError');
var pluginToNativeWatchMap = {};

module.exports = {
    getCurrentPosition: function(success, error, args) {
        var win = function() {
          var geo = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.geolocation');
          geo.getCurrentPosition(success, error, args);
        };
        var fail = function() {
            if (error) {
                error(new PositionError (PositionError.PERMISSION_DENIED, 'Illegal Access'));
            }
        };
        exec(win, fail, "Geolocation", "getPermission", []);
    },

    watchPosition: function(success, error, args) {
        var pluginWatchId = utils.createUUID();

        var win = function() {
            var geo = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.geolocation');
            pluginToNativeWatchMap[pluginWatchId] = geo.watchPosition(success, error, args);
        };

        var fail = function() {
            if (error) {
                error(new PositionError(PositionError.PERMISSION_DENIED, 'Illegal Access'));
            }
        };
        exec(win, fail, "Geolocation", "getPermission", []);

        return pluginWatchId;
    },

    clearWatch: function(pluginWatchId) {
        var win = function() {
            var nativeWatchId = pluginToNativeWatchMap[pluginWatchId];
            var geo = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'navigator.geolocation');
            geo.clearWatch(nativeWatchId);
        };

        exec(win, null, "Geolocation", "getPermission", []);
    }
};
