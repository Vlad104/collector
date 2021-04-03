function serialize (data) {
  return JSON.stringify(data, null, 2);
}

function makeButton (text, cbPrefix) {
  return {
    text: text,
    callback_data: cbPrefix ? `${cbPrefix}_${text}` : text
  }
}
function makeOptions (buttons) {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: buttons,
    })
  }
}

module.exports = {
  serialize,
  makeButton,
  makeOptions
};
