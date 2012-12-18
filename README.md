var timerSettings = {
  sessionTimeout: 60000,
  reminderDisplay: 30000,
  interval: 1000,
  tick: function (e) { console.log('sessionInit.tick:' + e) },
  reminder: function () { preLogoutWarning() },
  reminderTick: function (e) { logoutUpdate(e) },
  complete: function () { logOut() },
  stopped: function () { stopped() }
};

DSC.sessionTimer.init(timerSettings);
DSC.sessionTimer.doCountdown();
