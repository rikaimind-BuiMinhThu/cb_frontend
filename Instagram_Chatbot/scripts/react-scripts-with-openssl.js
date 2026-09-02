const { spawn } = require('child_process');
const path = require('path');

const major = Number(process.versions.node.split('.')[0]);
const env = { ...process.env };

if (major >= 17) {
  const current = env.NODE_OPTIONS || '';
  if (!/\b--openssl-legacy-provider\b/.test(current)) {
    env.NODE_OPTIONS = [current, '--openssl-legacy-provider'].filter(Boolean).join(' ');
  }
}

const reactScripts = path.join(__dirname, '..', 'node_modules', 'react-scripts', 'bin', 'react-scripts.js');
const child = spawn(process.execPath, [reactScripts, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code == null ? 1 : code);
});
