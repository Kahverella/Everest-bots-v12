const reqEvent = (event) => require(`../events/${event}`);
module.exports = client => {
  client.on('ready', () => reqEvent('ready')(client));
  client.on('message', reqEvent('message'));
  client.on('message', reqEvent('messageStats'));
  client.on('voiceStateUpdate', reqEvent('voiceStateUpdate'));
  client.on('presenceUpdate', reqEvent('presenceUpdate'));
};