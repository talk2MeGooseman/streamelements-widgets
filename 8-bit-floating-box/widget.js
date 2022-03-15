window.addEventListener('onEventReceived', function (obj) {
  if (!obj.detail.event) {
    return;
  }
console.log('on event')
});

window.addEventListener('onWidgetLoad', function (obj) {
  let recents = obj.detail.recents;
  let data=obj["detail"]["session"]["data"];

  recents.sort(function (a, b) {
      return Date.parse(a.createdAt) - Date.parse(b.createdAt);
  });

  const fieldData = obj.detail.fieldData;

  setInterval(function () {
    // Fetches the topic title
    fetch(`https://api.streamelements.com/kappa/v2/bot/commands/${  obj.detail.channel.id  }/622acb0d5b35fd65d24da450`)
      .then(response => response.json())
      .then((response) => {
        const element = document.getElementById("topic")
        element.innerHTML = response.reply;
      });
    // Fetches the todo command information
    fetch(`https://api.streamelements.com/kappa/v2/bot/commands/${  obj.detail.channel.id  }/622ad186da740f6945086dde`)
      .then(response => response.json())
      .then((response) => {
         const todosList = response.reply.split(', ');

        const element = document.getElementById("todo")
          const htmlList = `<ul class="nes-list">
                            ${todosList.map(function (text) {return listItem(text)}).join('')}
                          </ul>`
        element.innerHTML = htmlList;
      });
  }, 1000);

});

function listItem(text){
return `<li>- ${text}</li>`
}
