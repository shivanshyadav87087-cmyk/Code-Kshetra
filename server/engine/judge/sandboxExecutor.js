import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getLanguageConfig } from './languageRegistry.js';

const JUDGE_TEMP_DIR = path.join(os.tmpdir(), 'code_kshetra_judge');

// Ensure base temporary workspace directory exists
if (!fs.existsSync(JUDGE_TEMP_DIR)) {
  fs.mkdirSync(JUDGE_TEMP_DIR, { recursive: true });
}

/**
 * Executes a single code submission in a sandboxed temporary environment
 */
export async function executeInSandbox({
  sourceCode,
  language,
  stdinInput = '',
  timeLimitMs = 2000,
  memoryLimitMb = 256
}) {
  const langConfig = getLanguageConfig(language);
  const workDir = fs.mkdtempSync(path.join(JUDGE_TEMP_DIR, 'sub_'));

  try {
    // 1. Determine Source File Name
    let sourceFileName = `Solution${langConfig.extension}`;
    if (langConfig.id === 'java' && sourceCode.includes('public class MainDriver')) {
      sourceFileName = 'MainDriver.java';
    }

    const sourceFilePath = path.join(workDir, sourceFileName);
    fs.writeFileSync(sourceFilePath, sourceCode, 'utf8');

    // 2. Compilation Phase (if required by language)
    let executablePath = null;
    let javaMainClass = 'MainDriver';

    if (langConfig.isCompiled) {
      const compileResult = await compileSource({
        langConfig,
        sourceFilePath,
        workDir,
        timeLimitMs: 10000
      });

      if (!compileResult.success) {
        return {
          status: 'Compilation Error',
          stderr: compileResult.stderr,
          stdout: '',
          executionTimeMs: 0
        };
      }

      executablePath = compileResult.executablePath;
      javaMainClass = compileResult.javaMainClass;
    }

    // 3. Execution Phase
    const runResult = await runExecutable({
      langConfig,
      sourceFilePath,
      executablePath,
      javaMainClass,
      workDir,
      stdinInput,
      timeLimitMs,
      memoryLimitMb
    });

    return runResult;
  } finally {
    // 4. Cleanup Phase
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

/**
 * Compiles C++, C, or Java source file
 */
function compileSource({ langConfig, sourceFilePath, workDir, timeLimitMs }) {
  return new Promise((resolve) => {
    let command = '';
    let execName = 'solution' + langConfig.executableExtension;
    let outPath = path.join(workDir, execName);

    if (langConfig.id === 'cpp' || langConfig.id === 'c') {
      const compiler = langConfig.compiler;
      const flags = langConfig.args.join(' ');
      command = `"${compiler}" ${flags} "${sourceFilePath}" -o "${outPath}"`;
    } else if (langConfig.id === 'java') {
      command = `"${langConfig.compiler}" "${sourceFilePath}"`;
    } else {
      return resolve({ success: true });
    }

    const proc = exec(command, { cwd: workDir, timeout: timeLimitMs }, (error, stdout, stderr) => {
      if (error || (stderr && stderr.includes('error:'))) {
        return resolve({
          success: false,
          stderr: stderr || error?.message || 'Compilation failed',
          stdout
        });
      }

      resolve({
        success: true,
        executablePath: outPath,
        javaMainClass: sourceFilePath.endsWith('MainDriver.java') ? 'MainDriver' : 'Solution',
        stdout,
        stderr
      });
    });
  });
}

/**
 * Runs compiled binary or interpreted script with stdin piping and time limit enforcement
 */
function runExecutable({
  langConfig,
  sourceFilePath,
  executablePath,
  javaMainClass,
  workDir,
  stdinInput,
  timeLimitMs,
  memoryLimitMb
}) {
  return new Promise((resolve) => {
    const startTime = performance.now();

    let cmd = '';
    let args = [];

    if (langConfig.id === 'cpp' || langConfig.id === 'c') {
      cmd = executablePath;
      args = [];
    } else if (langConfig.id === 'java') {
      cmd = langConfig.runtime || 'java';
      args = ['-cp', workDir, javaMainClass];
    } else if (langConfig.id === 'python') {
      cmd = langConfig.runtime;
      args = [sourceFilePath];
    } else if (langConfig.id === 'javascript') {
      cmd = langConfig.runtime;
      args = [sourceFilePath];
    }

    let stdout = '';
    let stderr = '';
    let killedByTimeout = false;

    const child = spawn(cmd, args, { cwd: workDir });

    // Time Limit Exceeded (TLE) Timer
    const timer = setTimeout(() => {
      killedByTimeout = true;
      try {
        child.kill('SIGKILL');
      } catch (e) {}
    }, timeLimitMs);

    // Pipe stdin
    if (stdinInput) {
      child.stdin.write(stdinInput);
    }
    child.stdin.end();

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      if (stdout.length > 5 * 1024 * 1024) { // Max 5MB output limit
        child.kill('SIGKILL');
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      const executionTimeMs = Math.round(performance.now() - startTime);
      resolve({
        status: 'Runtime Error',
        stdout,
        stderr: err.message || 'Failed to start process',
        executionTimeMs
      });
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const executionTimeMs = Math.round(performance.now() - startTime);

      if (killedByTimeout || signal === 'SIGKILL' || signal === 'SIGTERM') {
        return resolve({
          status: 'Time Limit Exceeded',
          stdout,
          stderr: 'Time Limit Exceeded (TLE)',
          executionTimeMs: timeLimitMs
        });
      }

      if (code !== 0 && code !== null) {
        return resolve({
          status: 'Runtime Error',
          stdout,
          stderr: stderr || `Process exited with error code ${code}`,
          executionTimeMs
        });
      }

      resolve({
        status: 'Success',
        stdout,
        stderr,
        executionTimeMs
      });
    });
  });
}
