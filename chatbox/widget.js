let eventsLimit = 5,
    userLocale = "en-US",
    includeFollowers = true,
    includeRedemptions = true,
    includeHosts = true,
    minHost = 0,
    includeRaids = true,
    minRaid = 0,
    includeSubs = true,
    includeTips = true,
    minTip = 0,
    includeCheers = true,
    direction = "top",
    textOrder = "nameFirst",
    minCheer = 0;

let userCurrency,
    totalEvents = 0;

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }
    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;

    if (listener === 'follower') {
        updateStatus('follower', "", event.name);
    } else if (listener === 'subscriber') {
        updateStatus('sub', "", event.name);
    } else if (listener === 'raid') {
        updateStatus('raid', "", event.name);
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
    let recents = obj.detail.recents;
    let data=obj["detail"]["session"]["data"];

    recents.sort(function (a, b) {
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    });

    userCurrency = obj.detail.currency;
    const fieldData = obj.detail.fieldData;
    recentsMinBlinkInterval = fieldData.recentsMinBlinkInterval;
    recentsMaxBlinkInterval = fieldData.recentsMaxBlinkInterval;
    eventsLimit = fieldData.eventsLimit;

    let eventIndex;
    for (eventIndex = 0; eventIndex < recents.length; eventIndex++) {
        const event = recents[eventIndex];

        if (event.type === 'follower') {
            updateStatus('follower', '', event.name);
        } else if (event.type === 'subscriber') {
            updateStatus('sub', "", event.name);
        } else if (event.type === 'raid') {
            updateStatus('raid', "", event.name);
        }
    }

  blinkText("latest-follower", recentsMinBlinkInterval, recentsMaxBlinkInterval);
  blinkText("latest-sub", recentsMinBlinkInterval, recentsMaxBlinkInterval);
  blinkText("latest-raid", recentsMinBlinkInterval, recentsMaxBlinkInterval);
});


function updateStatus(type, text, username) {
    $(`#latest-${type}`).text([text,username].join(' '));
}

function blinkText(elementId, minInterval = 5000, maxInterval = 10000) {
   const elem = document.getElementById(elementId);

  const timer = elem.classList.contains('hidden') ? 1000 :  getRandomArbitrary(minInterval, maxInterval);

   setTimeout(function() {
  		elem.classList.toggle('hidden');
        blinkText(elementId, minInterval, maxInterval);
   }, timer);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
