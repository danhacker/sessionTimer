//DSC NameSpace
var DSC = DSC || {};

DSC.sessionTimer = function () {

  //private variables
  var _countdownTimeout,
        settings = {
          sessionTimeout: function () { },
          reminderDisplay: function () { },
          interval: 1000,
          tick: function () { },
          reminder: function () { },
          reminderTick: function () { },
          complete: function () { },
          stopped: function () { }
        },
        _countdownExecuting = false,

  //private functions
  _init = function (options) {
	  settings = $.extend({}, settings, options);

	},
    _doCountdown = function () {
      //countdown to reminder
      if (_validateTimer()) {
        _countdown(settings.sessionTimeout - settings.reminderDisplay,
        settings.interval,
        function (e) {
          if (typeof (settings.tick) == 'function') {
            settings.tick(e)
          }
        },
        function () {
          settings.reminder();
          //countdown to logout
          _countdown(settings.reminderDisplay,
                        settings.interval,
                        function (e) {
                          if (typeof (settings.reminderTick) === 'function') {
                            settings.reminderTick(e);
                          }
                        },
                        function () {
                          if (typeof (settings.complete) === 'function') {
                            settings.complete();
                          };
                        }
            );
        });
      }
    },

    _validateTimer = function () {
      settings.sessionTimeout = settings.sessionTimeout || 0;
      settings.reminderDisplay = settings.reminderDisplay || 0;
      settings.interval = settings.interval || 1000;
      var _result = true;
      if (settings.sessionTimeout <= 0) {
        throw 'sessionTimeout (' + settings.sessionTimeout + ') must be a positive integer';
      }
      if ((settings.reminderDisplay / 1000) > (settings.sessionTimeout / 1000)) {
        throw 'if specified, reminderDisplay (' + (settings.reminderDisplay / 1000) + 's) must be within the sessionTimeout (' + (settings.sessionTimeout / 1000 / 60) + 'm)';
      }
      if (settings.interval <= 0) {
        throw 'interval (' + settings.interval + ') must be a positive integer';
      }
      if (settings.interval >= settings.sessionTimeout) {
        throw 'interval (' + settings.interval + ') must be less than the sessionTimeout (' + settings.sessionTimeout + ')';
      }
      return _result;
    },

    _countdown = function (totalms, intervalms, tick, complete) {
      _countdownExecuting = true;
      var time = totalms,
        start = new Date().getTime();
      function instance() {
        time -= intervalms;
        if (time <= 0) {
          _countdownExecuting = false;
          complete();
        }
        else {
          var diff = (new Date().getTime() - start) - (totalms - time);
          //store countdown, so that we can kill it if we need
          _countdownTimeout = window.setTimeout(instance, (intervalms - diff));
          tick(time + diff);
        }
      }
      //store countdown, so that we can kill it if we need
      _countdownTimeout = window.setTimeout(instance, intervalms);
    },

    _stop = function () {
      if (_countdownExecuting) {

        clearInterval(_countdownTimeout);
        _countdownExecuting = false;
        if (typeof (settings.stopped) === 'function') {
          settings.stopped();
        }
      }
    }

  //return object literal of public methods
  return {
    //public members
    init: _init,
    doCountdown: _doCountdown,
    stop: _stop
  };
} ();
