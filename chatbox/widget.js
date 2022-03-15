let totalMessages = 0; let messagesLimit = 0; let nickColor = 'user'; let removeSelector; let addition; let customNickColor; let channelName;
let provider;
let animationIn = 'bounceIn';
let animationOut = 'bounceOut';
let hideAfter = 60;
let hideCommands = 'no';
let ignoredUsers = [];
let isBallonRight = true;
let lastChatter = '';

window.addEventListener('onEventReceived', (obj) => {
  if (obj.detail.event.listener === 'widget-button') {

    if (obj.detail.event.field === 'testMessage') {
      const emulated = new CustomEvent('onEventReceived', {
        detail: {
          listener: 'message', event: {
            service: 'twitch',
            data: {
              time: Date.now(),
              tags: {
                'badge-info': '',
                badges: 'moderator/1,partner/1',
                color: '#5B99FF',
                'display-name': 'StreamElements',
                emotes: '25:46-50',
                flags: '',
                id: '43285909-412c-4eee-b80d-89f72ba53142',
                mod: '1',
                'room-id': '85827806',
                subscriber: '0',
                'tmi-sent-ts': '1579444549265',
                turbo: '0',
                'user-id': '100135110',
                'user-type': 'mod'
              },
              nick: channelName,
              userId: '100135110',
              displayName: channelName,
              displayColor: '#5B99FF',
              badges: [{
                type: 'moderator',
                version: '1',
                url: 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3',
                description: 'Moderator'
              }, {
                type: 'partner',
                version: '1',
                url: 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3',
                description: 'Verified'
              }],
              channel: channelName,
              text: 'Howdy! My name is Bill and I am here to serve Kappa',
              isAction: !1,
              emotes: [{
                type: 'twitch',
                name: 'Kappa',
                id: '25',
                gif: !1,
                urls: {
                  1: 'https://static-cdn.jtvnw.net/emoticons/v1/25/1.0',
                  2: 'https://static-cdn.jtvnw.net/emoticons/v1/25/1.0',
                  4: 'https://static-cdn.jtvnw.net/emoticons/v1/25/3.0'
                },
                start: 46,
                end: 50
              }],
              msgId: '43285909-412c-4eee-b80d-89f72ba53142'
            },
            renderedText: 'Howdy! My name is Bill and I am here to serve <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
          }
        }
      });
      window.dispatchEvent(emulated);
    }
    return;
  }

  if (obj.detail.listener === 'delete-message') {
    const {msgId} = obj.detail.event;
    $(`.message-row[data-msgid=${msgId}]`).remove();
    return;
  }

  if (obj.detail.listener === 'delete-messages') {
    const sender = obj.detail.event.userId;
    $(`.message-row[data-sender=${sender}]`).remove();
    return;
  }

  if (obj.detail.listener !== 'message') return;

  // Event details
  const {data} = obj.detail.event;

  // Check to ignore command messages
  if (data.text.startsWith('!') && hideCommands === 'yes') return;

  // Ignore specific users
  if (ignoredUsers.includes(data.nick)) return;

  // Replaces emote codes with actual images
  const message = attachEmotes(data);

  let badges = ''; let badge;

  // Generate image tags to display badges
  // TODO: Add support for ignoring badges?
  for (let i = 0; i < data.badges.length; i++) {
    badge = data.badges[i];
    badges += `<img alt="" src="${badge.url}" class="badge"> `;
  }

  let username = `${data.displayName  }:`;

  switch (nickColor) {
  case 'user':
    const userColor = data.displayColor !== '' ? data.displayColor : `#${  md5(username).slice(26)}`;
    username = `<span style="color:${userColor}">${username}</span>`;

    break;

  case 'custom':
    const customColor = customNickColor;
    username = `<span style="color:${customColor}">${username}</span>`;

    break;

  case 'remove':
    username = '';

    break;

  default:
    break;
  }
  addMessage(username, badges, message, data.isAction, data.userId, data.msgId);
});

window.addEventListener('onWidgetLoad', (obj) => {
  const {fieldData} = obj.detail;
  animationIn = fieldData.animationIn;
  animationOut = fieldData.animationOut;
  hideAfter = fieldData.hideAfter;
  messagesLimit = fieldData.messagesLimit;
  nickColor = fieldData.nickColor;
  customNickColor = fieldData.customNickColor;
  hideCommands = fieldData.hideCommands;
  channelName = obj.detail.channel.username;
  fetch(`https://api.streamelements.com/kappa/v2/channels/${  obj.detail.channel.id  }/`).then(response => response.json()).then((profile) => {
    provider = profile.provider;
  });
  if (fieldData.alignMessages === 'block') {
    addition = 'prepend';
    removeSelector = `.message-row:nth-child(n+${  messagesLimit + 1  })`;
  } else {
    addition = 'append';
    removeSelector = `.message-row:nth-last-child(n+${  messagesLimit + 1  })`;
  }

  ignoredUsers = fieldData.ignoredUsers.toLowerCase().replace(' ', '').split(',');
});


function attachEmotes(message) {
  let text = html_encode(message.text);
  const data = message.emotes;
  if (typeof message.attachment !== 'undefined' && typeof message.attachment.media !== 'undefined' && typeof message.attachment.media.image !== 'undefined') {
    text = `${message.text}<img src="${message.attachment.media.image.src}">`;
  }
  return text
    .replace(
      /(\S*)/gi,
      (m, key) => {
        const result = data.find(emote => html_encode(emote.name) === key);
        if (typeof result !== 'undefined') {
          const url = result.urls[1];
          if (provider === 'twitch') {
            return `<img class="emote" " src="${url}"/>`;
          }
          if (typeof result.coords === 'undefined') {
            result.coords = {x: 0, y: 0};
          }
          const x = parseInt(result.coords.x);
          const y = parseInt(result.coords.y);

          let width = '{emoteSize}px';
          let height = 'auto';

          if (provider === 'mixer') {
            console.log(result);
            if (result.coords.width) {
              width = `${result.coords.width}px`;
            }
            if (result.coords.height) {
              height = `${result.coords.height}px`;
            }
          }
          return `<div class="emote" style="width: ${width}; height:${height}; display: inline-block; background-image: url(${url}); background-position: -${x}px -${y}px;"></div>`;

        } return key;

      }
    );
}

function html_encode(e) {
  return e.replace(/["<>^]/g, (e) => `&#${  e.charCodeAt(0)  };`);
}

function addMessage(username, badges, message, isAction, uid, msgId) {
  totalMessages += 1;
  let actionClass = '';
  if (isAction) {
    actionClass = 'action';
  }

  if(username === lastChatter) isBallonRight = !isBallonRight

  const position = isBallonRight ? 'right' : 'left';
  isBallonRight = !isBallonRight;

  lastChatter = username;

  const element = $.parseHTML(`
    <section class="message -${position} {animationIn} animated">
      <div data-sender="${uid}" data-msgid="${msgId}" class="row nes-balloon from-${position} is-dark" id="msg-${totalMessages}">
          <div class="user-box ${actionClass}">${badges}${username}</div>
          <div class="user-message ${actionClass}">${message}</div>
      </div>
    </section>`);

  if (hideAfter !== 999) {
    $(element).prependTo('.message-list').delay(hideAfter * 1000).queue(function () {
      $(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
        $(this).remove();
      }).dequeue();
    });
  } else {
    $(element).prependTo('.message-list');
  }

  if (totalMessages > messagesLimit) {
    removeRow();
  }
}

function removeRow() {
  if ($(removeSelector).length === 0) {
    return;
  }
  if (animationOut !== 'none' || !$(removeSelector).hasClass(animationOut)) {
    if (hideAfter !== 999) {
      $(removeSelector).dequeue();
    } else {
      $(removeSelector).addClass(animationOut).delay(1000).queue(function () {
        $(this).remove().dequeue();
      });

    }
    return;
  }

  $(removeSelector).animate({
    height: 0,
    opacity: 0
  }, 'slow', () => {
    $(removeSelector).remove();
  });
}
