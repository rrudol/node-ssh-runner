const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const path = require('path');

__dirname = process.cwd();

function run(config) {
  const { filename, hosts, numberOfProcesses } = config;
  hosts.forEach(host => {
    host = {...host, tryKeyboard: true,
      onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
          if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
            finish([host.password])
          }
        }}
    const targetDirectory = '/tmp/' + __dirname.split(path.sep).pop();
    // console.log(host)
    // const targetDirectory = host.remotePath + '/' + __dirname.split(path.sep).pop();
    ssh.connect(host)
      .then( () => ssh.execCommand('sudo mkdir '+targetDirectory, {}) )
      .then( () => ssh.execCommand('sudo chown '+host.username+' '+targetDirectory, {}) )
      .then( () => ssh.execCommand('sudo chmod 700', {}) )
      .then( () => ssh.putDirectory(__dirname, targetDirectory, {
          recursive: true,
          concurrency: 10,
          validate: function(itemPath) {
            const baseName = path.basename(itemPath)
            return baseName.substr(0, 1) !== '.' && // do not allow dot files
                   baseName !== 'node_modules' // do not allow node_modules
          },
          tick: function(localPath, remotePath, error) {
            if (error) {
              throw new Error(`Filed to send ${localPath}`)
            }
          }
      }))
      .then((status)=>{
        return ssh.execCommand('ls -l ' + targetDirectory, {})
      })
      .then( () => ssh.execCommand(`/home/ubuntu/.nvm/versions/node/v8.11.1/bin/npm install`, { cwd: targetDirectory }) )
      .then( () => ssh.execCommand(`/home/ubuntu/.nvm/versions/node/v8.11.1/bin/node ${targetDirectory}/${filename}`, {}) )
      .then( s => console.log(s) )
      .catch((err)=>{
        console.error(err);
      });
      // console.log(`node ${targetDirectory}/${filename}`)
  });
}

function install(config) {
  const { hosts } = config;

  hosts.forEach(host => {
    host = {...host, tryKeyboard: true,
      onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
          if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
            finish([host.password])
          }
        }}
    const targetDirectory = '/tmp/' + __dirname.split(path.sep).pop();
    console.log(host)
    ssh.connect(host)
      .then( () => ssh.execCommand('sudo apt-get update', {}) )
      .then( s => console.log(s.stdout) )
      .then( () => ssh.execCommand('sudo apt-get install build-essential libssl-dev -y', {}) )
      .then( s => console.log(s.stdout) )
      .then( () => ssh.execCommand('curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh', {}) )
      .then( s => console.log(s.stdout) )
      // .then( () => ssh.execCommand('bash install_nvm.sh', {}) )
      // .then( s => console.log(s.stdout) )
      // .then( () => ssh.execCommand('source ~/.profile', {}) )
      // .then( s => console.log(s.stdout) )
      // v8.11.1
      .then( () => ssh.execCommand('nvm install v8.11.1', {}) )
      .then( s => console.log(s.stdout) )
      .then( () => ssh.execCommand('nvm use v8.11.1', {}) )
      .then( s => console.log(s.stdout) )
  });
}

module.exports = run;