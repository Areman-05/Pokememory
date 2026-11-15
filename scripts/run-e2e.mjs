import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const openMode = process.argv.includes('--open');

const children = [];

const spawnNpm = (script) => {
  const child = spawn('npm', ['run', script], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'inherit',
  });
  children.push(child);
  return child;
};

const waitForUrl = async (url, attempts = 60) => {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // retry
    }
    await delay(500);
  }
  throw new Error(`Timeout waiting for ${url}`);
};

const killTree = async (pid) => {
  await new Promise((resolve) => {
    const killer = spawn('taskkill', ['/pid', String(pid), '/T', '/F'], {
      shell: true,
      stdio: 'ignore',
    });
    killer.on('exit', resolve);
    killer.on('error', resolve);
  });
};

const shutdown = async () => {
  await Promise.all(children.map((child) => (child.pid ? killTree(child.pid) : Promise.resolve())));
};

process.on('exit', () => {
  children.forEach((child) => {
    if (child.pid) {
      try {
        process.kill(child.pid);
      } catch {
        // already closed
      }
    }
  });
});

try {
  spawnNpm('mock:firebase');
  spawnNpm('start');
  await waitForUrl('http://127.0.0.1:5500');
  await waitForUrl('http://127.0.0.1:9000/users.json');

  const cypress = spawn(
    'npx',
    ['cypress', openMode ? 'open' : 'run'],
    { cwd: process.cwd(), shell: true, stdio: 'inherit' },
  );

  const code = await new Promise((resolve) => {
    cypress.on('exit', resolve);
    cypress.on('error', () => resolve(1));
  });

  await shutdown();
  process.exit(code ?? 1);
} catch (error) {
  console.error(error);
  await shutdown();
  process.exit(1);
}
