/**
 * Driver Harness Generator Module
 * Wraps Function/Class Submissions for C++, Java, Python, and JavaScript into runnable source files,
 * or returns full-program stdin submissions unchanged.
 */

/**
 * Generates runnable source code for a test execution
 * @param {string} userCode - User submitted source code
 * @param {string} language - Canonical language ID ('cpp', 'java', 'python', 'javascript')
 * @param {string} executionMode - 'function' | 'stdin'
 * @param {string} entryFunction - e.g. 'isAnagram', 'twoSum'
 * @param {Array} testInput - Test case input arguments array e.g. ["anagram", "nagaram"]
 */
export function generateExecutableSource(userCode, language, executionMode = 'function', entryFunction = 'solution', testInput = []) {
  if (executionMode === 'stdin') {
    return userCode;
  }

  const fnName = entryFunction || 'solution';
  const jsonInput = JSON.stringify(testInput || []);
  const argCount = Array.isArray(testInput) ? testInput.length : 1;

  if (language === 'cpp' || language === 'c') {
    return generateCppFunctionHarness(userCode, fnName, jsonInput, argCount);
  }

  if (language === 'java') {
    return generateJavaFunctionHarness(userCode, fnName, jsonInput);
  }

  if (language === 'python') {
    return generatePythonFunctionHarness(userCode, fnName, jsonInput);
  }

  if (language === 'javascript') {
    return generateJavaScriptFunctionHarness(userCode, fnName, jsonInput);
  }

  return userCode;
}

/**
 * C++ Function Harness Generator
 */
function generateCppFunctionHarness(userCode, fnName, jsonInput, argCount = 1) {
  let cleanCode = userCode;

  let invokeCall = `auto res = sol.${fnName}(args[0]);`;
  if (argCount === 2) {
    invokeCall = `auto res = sol.${fnName}(args[0], args[1]);`;
  } else if (argCount === 3) {
    invokeCall = `auto res = sol.${fnName}(args[0], args[1], args[2]);`;
  } else if (argCount === 4) {
    invokeCall = `auto res = sol.${fnName}(args[0], args[1], args[2], args[3]);`;
  }

  return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <unordered_map>
#include <set>
#include <unordered_set>
#include <stack>
#include <queue>
#include <deque>
#include <cmath>
#include <sstream>
#include <memory>

using namespace std;

// --- USER CODE START ---
${cleanCode}
// --- USER CODE END ---

// Helper serializer for stdout
template<typename T>
void printVal(const T& val) {
    cout << val;
}
void printVal(bool val) {
    cout << (val ? "true" : "false");
}
template<typename T>
void printVal(const vector<T>& vec) {
    cout << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        printVal(vec[i]);
        if (i + 1 < vec.size()) cout << ",";
    }
    cout << "]";
}

// Simple string quote cleaner for argument parsing
string cleanArg(const string& s) {
    if (s.size() >= 2 && s.front() == '"' && s.back() == '"') {
        return s.substr(1, s.size() - 2);
    }
    return s;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string rawInput = R"raw_input(${jsonInput})raw_input";
    
    // Parse JSON array parameters
    vector<string> args;
    if (rawInput.size() >= 2 && rawInput.front() == '[' && rawInput.back() == ']') {
        string inner = rawInput.substr(1, rawInput.size() - 2);
        stringstream ss(inner);
        string token;
        bool inQuotes = false;
        string current = "";
        for (char c : inner) {
            if (c == '"') inQuotes = !inQuotes;
            if (c == ',' && !inQuotes) {
                args.push_back(cleanArg(current));
                current = "";
            } else {
                current += c;
            }
        }
        if (!current.empty()) args.push_back(cleanArg(current));
    }

    try {
        Solution sol;
        ${invokeCall}
        printVal(res);
        cout << endl;
        return 0;
    } catch (...) {
        cerr << "Runtime Error in C++ execution." << endl;
        return 1;
    }

    return 0;
}
`;
}

/**
 * Java Function Harness Generator
 */
function generateJavaFunctionHarness(userCode, fnName, jsonInput) {
  let cleanCode = userCode;

  // Enforce class Solution
  if (!cleanCode.includes('class Solution')) {
    cleanCode = `class Solution {\n${cleanCode}\n}`;
  }

  return `
import java.util.*;
import java.io.*;
import java.lang.reflect.*;

${cleanCode}

public class MainDriver {
    public static void main(String[] args) throws Exception {
        String jsonArgs = "${jsonInput.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}";
        
        // Parse arguments simple JSON list
        List<String> parsedArgs = parseJsonList(jsonArgs);

        Solution sol = new Solution();
        Method targetMethod = null;
        for (Method m : Solution.class.getDeclaredMethods()) {
            if (m.getName().equals("${fnName}")) {
                targetMethod = m;
                break;
            }
        }

        if (targetMethod == null) {
            System.err.println("Method ${fnName} not found in class Solution.");
            System.exit(1);
        }

        targetMethod.setAccessible(true);
        Class<?>[] paramTypes = targetMethod.getParameterTypes();
        Object[] invokeArgs = new Object[paramTypes.length];

        for (int i = 0; i < paramTypes.length; i++) {
            String raw = i < parsedArgs.size() ? parsedArgs.get(i) : "";
            Class<?> p = paramTypes[i];

            if (p == String.class) {
                invokeArgs[i] = raw;
            } else if (p == int.class || p == Integer.class) {
                invokeArgs[i] = Integer.parseInt(raw.trim());
            } else if (p == boolean.class || p == Boolean.class) {
                invokeArgs[i] = Boolean.parseBoolean(raw.trim());
            } else if (p == double.class || p == Double.class) {
                invokeArgs[i] = Double.parseDouble(raw.trim());
            } else if (p == int[].class) {
                invokeArgs[i] = parseIntArray(raw);
            } else {
                invokeArgs[i] = raw;
            }
        }

        Object result = targetMethod.invoke(sol, invokeArgs);
        if (result == null) {
            System.out.println("null");
        } else if (result.getClass().isArray()) {
            if (result instanceof int[]) System.out.println(Arrays.toString((int[]) result));
            else System.out.println(Arrays.deepToString((Object[]) result));
        } else {
            System.out.println(result.toString());
        }
    }

    private static List<String> parseJsonList(String json) {
        List<String> list = new ArrayList<>();
        if (json.startsWith("[") && json.endsWith("]")) {
            String inner = json.substring(1, json.length() - 1);
            boolean inQuotes = false;
            StringBuilder sb = new StringBuilder();
            for (char c : inner.toCharArray()) {
                if (c == '"') inQuotes = !inQuotes;
                else if (c == ',' && !inQuotes) {
                    String item = sb.toString().trim();
                    if (item.startsWith("\\\"") && item.endsWith("\\\"") && item.length() >= 2) {
                        item = item.substring(1, item.length() - 1);
                    }
                    list.add(item);
                    sb.setLength(0);
                } else {
                    sb.append(c);
                }
            }
            if (sb.length() > 0) {
                String item = sb.toString().trim();
                if (item.startsWith("\\\"") && item.endsWith("\\\"") && item.length() >= 2) {
                    item = item.substring(1, item.length() - 1);
                }
                list.add(item);
            }
        }
        return list;
    }

    private static int[] parseIntArray(String raw) {
        String clean = raw.replace("[", "").replace("]", "").replaceAll("\\s", "");
        if (clean.isEmpty()) return new int[0];
        String[] parts = clean.split(",");
        int[] arr = new int[parts.length];
        for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i]);
        return arr;
    }
}
`;
}

/**
 * Python Function Harness Generator
 */
function generatePythonFunctionHarness(userCode, fnName, jsonInput) {
  return `
import sys
import json
import math
import collections
from typing import *

# --- USER CODE START ---
${userCode}
# --- USER CODE END ---

def __driver():
    try:
        raw_args = json.loads('''${jsonInput.replace(/'/g, "\\'")}''')
        
        # Instantiate Solution class if defined
        sol = None
        if 'Solution' in globals() and isinstance(globals()['Solution'], type):
            sol = globals()['Solution']()
        
        target_fn = None
        if sol and hasattr(sol, '${fnName}'):
            target_fn = getattr(sol, '${fnName}')
        elif '${fnName}' in globals() and callable(globals()['${fnName}']):
            target_fn = globals()['${fnName}']

        if not target_fn:
            print(f"Error: Function '${fnName}' not found.", file=sys.stderr)
            sys.exit(1)

        result = target_fn(*raw_args)
        print(json.dumps(result))
    except Exception as e:
        print(f"Runtime Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    __driver()
`;
}

/**
 * JavaScript Function Harness Generator
 */
function generateJavaScriptFunctionHarness(userCode, fnName, jsonInput) {
  return `
const fs = require('fs');

// --- USER CODE START ---
${userCode}
// --- USER CODE END ---

function __driver() {
  try {
    const rawArgs = JSON.parse(${JSON.stringify(jsonInput)});
    let targetFn = null;

    if (typeof ${fnName} === 'function') {
      targetFn = ${fnName};
    } else if (typeof Solution !== 'undefined') {
      const inst = new Solution();
      if (typeof inst.${fnName} === 'function') {
        targetFn = inst.${fnName}.bind(inst);
      }
    }

    if (!targetFn) {
      console.error("Function '${fnName}' is not defined.");
      process.exit(1);
    }

    const result = targetFn(...rawArgs);
    console.log(JSON.stringify(result));
  } catch (err) {
    console.error("Runtime Error: " + (err.message || err));
    process.exit(1);
  }
}

__driver();
`;
}
