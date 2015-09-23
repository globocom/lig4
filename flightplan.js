var plan = require('flightplan');

// configuration
plan.target('production', [
  {
    host: 'lig4-prod-be.rjoebt0200be-64.cp.globoi.com',
    username: 'puppet',
    agent: process.env.SSH_AUTH_SOCK
  }
]);

var tmpDir = 'lig4-deploy-' + new Date().getTime();
var tarFile = tmpDir + 'tar.gz'
var releaseDir = '/tmp/' + tmpDir;
var releaseFile = releaseDir + '.tar.gz'

// run commands on localhost
plan.local(function(local) {
  local.log('copy project to tmp deploy dir');
  local.exec('cp -R . ' + releaseDir);

  local.with('cd ' + releaseDir , function() {
    local.log('Pre-Install dependencies');
    local.exec('npm --production --prefix .  install . ');
  });

  local.with('cd /tmp', function(){
    local.exec('tar -C . -cf ' + tarFile + ' --exclude=".git/" '+ releaseDir);
    local.log('Copy release file to remote hosts');
    local.transfer(tarFile, releaseFile);
  });

});

// run commands on the target's remote hosts
plan.remote(function(remote) {
  remote.log('backup latest deploy');
  remote.exec('rm -rf  ~/latest', {user: 'puppet'});
  remote.exec('mkdir -p ~/current ', {user: 'puppet'});
  remote.exec('mv ~/current ~/latest', {user: 'puppet'});
  remote.log('Move folder to home dir');
  remote.exec('tar -xf ' + releaseFile, {user: 'puppet'});
  remote.exec('mv ~/tmp/' + tmpDir + ' ~/current', {user: 'puppet'});
});
