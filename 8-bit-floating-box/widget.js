window.addEventListener('onEventReceived', function (obj) {
  if (!obj.detail.event) {
    return;
  }
});

window.addEventListener('onWidgetLoad', function (obj) {
  let recents = obj.detail.recents;
  let data=obj["detail"]["session"]["data"];

  recents.sort(function (a, b) {
      return Date.parse(a.createdAt) - Date.parse(b.createdAt);
  });

  const fieldData = obj.detail.fieldData;

  setInterval(function () {
    fetch(`https://api.streamelements.com/kappa/v2/bot/commands/${  obj.detail.channel.id  }/622acb0d5b35fd65d24da450`).then(response => response.json()).then((response) => {
        const element = document.getElementById("topic")
        element.innerHTML = response.reply;
    });
    fetch(`https://api.streamelements.com/kappa/v2/bot/commands/${  obj.detail.channel.id  }/622ad186da740f6945086dde`).then(response => response.json()).then((response) => {
      const element = document.getElementById("todo")
      element.innerHTML = response.reply;
    });
  }, 1000);

});
