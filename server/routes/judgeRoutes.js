import express from 'express';
import { judgeSubmission } from '../engine/judge/universalJudge.js';
import { getLanguageConfig, LANGUAGE_REGISTRY } from '../engine/judge/languageRegistry.js';

const router = express.Router();

// Supported Languages API Endpoint
router.get('/languages', (req, res) => {
  res.json({
    languages: Object.values(LANGUAGE_REGISTRY).map(l => ({
      id: l.id,
      name: l.name,
      compiler: l.compiler || l.runtime,
      extension: l.extension
    }))
  });
});

// Run Code Endpoint (Judge Execution against Test Cases)
router.post('/run', async (req, res) => {
  try {
    const { code, language, entryFunction, executionMode, testCases, timeLimitMs, memoryLimitMb } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        verdict: 'Compilation Error',
        error: 'Code parameter is required.'
      });
    }

    const casesToRun = Array.isArray(testCases) && testCases.length > 0
      ? testCases
      : [{ input: '', expectedOutput: '' }];

    const evalResult = await judgeSubmission({
      code,
      language: language || 'javascript',
      entryFunctionName: entryFunction || 'solution',
      executionMode: executionMode || 'function',
      testCases: casesToRun,
      timeLimitMs: timeLimitMs || 3000,
      memoryLimitMb: memoryLimitMb || 256
    });

    return res.json(evalResult);
  } catch (err) {
    console.error('[Judge API Error]', err);
    return res.status(500).json({
      success: false,
      verdict: 'Runtime Error',
      passedCount: 0,
      totalCount: 0,
      runtimeMs: 0,
      error: `[Server Execution Error] ${err.message}`
    });
  }
});

export default router;
