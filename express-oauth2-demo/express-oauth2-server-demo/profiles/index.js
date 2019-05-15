const activeMode = process.env.ACTIVE_MODE || 'development';

console.log('[ACTIVE-MODE]\t', activeMode);
console.log('[PROFILE-DIR]\t', 'profiles/profile-' + activeMode + '.js');

let configuration = require('./profile-' + activeMode + '.js');

console.log('[SERVER-NAME]\t', configuration.app.name);
console.log('[SERVER-PORT]\t', configuration.app.port);

module.exports = configuration;
