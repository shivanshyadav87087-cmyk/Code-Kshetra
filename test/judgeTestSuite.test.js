import { judgeSubmission } from '../server/engine/judge/universalJudge.js';

async function runTestSuite() {
  console.log('\n======================================================');
  console.log(' ⚔️ RUNNING UNIVERSAL ONLINE JUDGE SUITE');
  console.log('======================================================\n');

  let passedAll = true;

  // TEST 1: C++ Valid Anagram (Function Mode)
  console.log('👉 [1/6] Testing C++ Solution Class (isAnagram)...');
  const cppCode = `
class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        sort(s.begin(), s.end());
        sort(t.begin(), t.end());
        return s == t;
    }
};
  `;
  const cppRes = await judgeSubmission({
    code: cppCode,
    language: 'cpp',
    entryFunctionName: 'isAnagram',
    executionMode: 'function',
    testCases: [
      { input: ["anagram", "nagaram"], expectedOutput: true },
      { input: ["rat", "car"], expectedOutput: false }
    ]
  });
  console.log('   Verdict:', cppRes.verdict, `(${cppRes.passedCount}/${cppRes.totalCount} Passed, ${cppRes.runtimeMs}ms)`);
  if (cppRes.verdict !== 'Accepted') {
    console.error('   ❌ C++ Test Failed:', cppRes.error || cppRes.results);
    passedAll = false;
  } else {
    console.log('   ✅ C++ Test PASSED!');
  }

  // TEST 2: Java Valid Anagram (Function Mode)
  console.log('\n👉 [2/6] Testing Java Solution Class (isAnagram)...');
  const javaCode = `
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        char[] sArr = s.toCharArray();
        char[] tArr = t.toCharArray();
        Arrays.sort(sArr);
        Arrays.sort(tArr);
        return Arrays.equals(sArr, tArr);
    }
}
  `;
  const javaRes = await judgeSubmission({
    code: javaCode,
    language: 'java',
    entryFunctionName: 'isAnagram',
    executionMode: 'function',
    testCases: [
      { input: ["anagram", "nagaram"], expectedOutput: true },
      { input: ["rat", "car"], expectedOutput: false }
    ]
  });
  console.log('   Verdict:', javaRes.verdict, `(${javaRes.passedCount}/${javaRes.totalCount} Passed, ${javaRes.runtimeMs}ms)`);
  if (javaRes.verdict !== 'Accepted') {
    console.error('   ❌ Java Test Failed:', javaRes.error || javaRes.results);
    passedAll = false;
  } else {
    console.log('   ✅ Java Test PASSED!');
  }

  // TEST 3: Python 3 Valid Anagram (Function Mode)
  console.log('\n👉 [3/6] Testing Python 3 Solution Class (isAnagram)...');
  const pyCode = `
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return sorted(s) == sorted(t)
  `;
  const pyRes = await judgeSubmission({
    code: pyCode,
    language: 'python',
    entryFunctionName: 'isAnagram',
    executionMode: 'function',
    testCases: [
      { input: ["anagram", "nagaram"], expectedOutput: true },
      { input: ["rat", "car"], expectedOutput: false }
    ]
  });
  console.log('   Verdict:', pyRes.verdict, `(${pyRes.passedCount}/${pyRes.totalCount} Passed, ${pyRes.runtimeMs}ms)`);
  if (pyRes.verdict !== 'Accepted') {
    console.error('   ❌ Python Test Failed:', pyRes.error || pyRes.results);
    passedAll = false;
  } else {
    console.log('   ✅ Python Test PASSED!');
  }

  // TEST 4: JavaScript Valid Anagram (Function Mode)
  console.log('\n👉 [4/6] Testing JavaScript Solution Class (isAnagram)...');
  const jsCode = `
var isAnagram = function(s, t) {
    if (s.length !== t.length) return false;
    return s.split('').sort().join('') === t.split('').sort().join('');
};
  `;
  const jsRes = await judgeSubmission({
    code: jsCode,
    language: 'javascript',
    entryFunctionName: 'isAnagram',
    executionMode: 'function',
    testCases: [
      { input: ["anagram", "nagaram"], expectedOutput: true },
      { input: ["rat", "car"], expectedOutput: false }
    ]
  });
  console.log('   Verdict:', jsRes.verdict, `(${jsRes.passedCount}/${jsRes.totalCount} Passed, ${jsRes.runtimeMs}ms)`);
  if (jsRes.verdict !== 'Accepted') {
    console.error('   ❌ JavaScript Test Failed:', jsRes.error || jsRes.results);
    passedAll = false;
  } else {
    console.log('   ✅ JavaScript Test PASSED!');
  }

  // TEST 5: C++ Compilation Error
  console.log('\n👉 [5/6] Testing C++ Compilation Error Classification...');
  const badCppCode = `
class Solution {
public:
    bool isAnagram(string s, string t) {
        return s.size() == t.size() // MISSING SEMICOLON
    }
};
  `;
  const badCppRes = await judgeSubmission({
    code: badCppCode,
    language: 'cpp',
    entryFunctionName: 'isAnagram',
    executionMode: 'function',
    testCases: [{ input: ["a", "a"], expectedOutput: true }]
  });
  console.log('   Verdict:', badCppRes.verdict);
  if (badCppRes.verdict !== 'Compilation Error') {
    console.error('   ❌ Expected Compilation Error, got:', badCppRes.verdict);
    passedAll = false;
  } else {
    console.log('   ✅ Compilation Error correctly classified!');
  }

  // TEST 6: C++ Stdin Mode (Full Program)
  console.log('\n👉 [6/6] Testing C++ Full-Program Stdin Mode...');
  const stdinCppCode = `
#include <iostream>
using namespace std;
int main() {
    int a, b;
    if (cin >> a >> b) {
        cout << (a + b) << endl;
    }
    return 0;
}
  `;
  const stdinRes = await judgeSubmission({
    code: stdinCppCode,
    language: 'cpp',
    executionMode: 'stdin',
    testCases: [
      { input: "5 10", expectedOutput: "15" },
      { input: "100 200", expectedOutput: "300" }
    ]
  });
  console.log('   Verdict:', stdinRes.verdict, `(${stdinRes.passedCount}/${stdinRes.totalCount} Passed, ${stdinRes.runtimeMs}ms)`);
  if (stdinRes.verdict !== 'Accepted') {
    console.error('   ❌ C++ Stdin Test Failed:', stdinRes.error || stdinRes.results);
    passedAll = false;
  } else {
    console.log('   ✅ C++ Stdin Test PASSED!');
  }

  console.log('\n======================================================');
  if (passedAll) {
    console.log(' 🟢 ALL UNIVERSAL JUDGE TESTS PASSED 100%!');
  } else {
    console.log(' 🔴 SOME TESTS FAILED');
    process.exit(1);
  }
  console.log('======================================================\n');
}

runTestSuite().catch(err => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
