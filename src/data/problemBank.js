export const PROBLEM_BANK = [
  // 1. ARRAYS & MATRICES 📊
  {
    id: 'two-sum',
    number: 1,
    title: '1. Two Sum',
    difficulty: 'Easy',
    topic: 'arrays',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.`,
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9.' }],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= target <= 10^9'],
    entryFunction: 'twoSum',
    starterTemplates: {
      javascript: `function twoSum(nums, target) {\n    \n};`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1], isSecret: false },
      { input: [[3, 2, 4], 6], expectedOutput: [1, 2], isSecret: false },
      { input: [[3, 3], 6], expectedOutput: [0, 1], isSecret: false },
      { input: [[-1, -2, -3, -4, -5], -8], expectedOutput: [2, 4], isSecret: false },
      { input: [[0, 4, 3, 0], 0], expectedOutput: [0, 3], isSecret: true }
    ]
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    number: 121,
    title: '121. Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topic: 'arrays',
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day. Return the maximum profit you can achieve.`,
    examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5' }],
    constraints: ['1 <= prices.length <= 10^5'],
    entryFunction: 'maxProfit',
    starterTemplates: {
      javascript: `function maxProfit(prices) {\n    \n};`,
      python: `class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expectedOutput: 5, isSecret: false },
      { input: [[7, 6, 4, 3, 1]], expectedOutput: 0, isSecret: false },
      { input: [[1, 2]], expectedOutput: 1, isSecret: false },
      { input: [[3, 3, 3, 3]], expectedOutput: 0, isSecret: false },
      { input: [[2, 4, 1, 7]], expectedOutput: 6, isSecret: true }
    ]
  },
  {
    id: 'contains-duplicate',
    number: 217,
    title: '217. Contains Duplicate',
    difficulty: 'Easy',
    topic: 'arrays',
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.`,
    examples: [{ input: 'nums = [1,2,3,1]', output: 'true' }],
    constraints: ['1 <= nums.length <= 10^5'],
    entryFunction: 'containsDuplicate',
    starterTemplates: {
      javascript: `function containsDuplicate(nums) {\n    \n};`,
      python: `class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[1, 2, 3, 1]], expectedOutput: true, isSecret: false },
      { input: [[1, 2, 3, 4]], expectedOutput: false, isSecret: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expectedOutput: true, isSecret: false },
      { input: [[99]], expectedOutput: false, isSecret: false },
      { input: [[0, 0]], expectedOutput: true, isSecret: true }
    ]
  },
  {
    id: 'maximum-subarray',
    number: 53,
    title: '53. Maximum Subarray',
    difficulty: 'Medium',
    topic: 'arrays',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' }],
    constraints: ['1 <= nums.length <= 10^5'],
    entryFunction: 'maxSubArray',
    starterTemplates: {
      javascript: `function maxSubArray(nums) {\n    \n};`,
      python: `class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expectedOutput: 6, isSecret: false },
      { input: [[1]], expectedOutput: 1, isSecret: false },
      { input: [[5, 4, -1, 7, 8]], expectedOutput: 23, isSecret: false },
      { input: [[-5, -2, -3, -1, -4]], expectedOutput: -1, isSecret: false },
      { input: [[-2, -1]], expectedOutput: -1, isSecret: true }
    ]
  },
  {
    id: 'trapping-rain-water',
    number: 42,
    title: '42. Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'arrays',
    leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4'],
    entryFunction: 'trap',
    starterTemplates: {
      javascript: `function trap(height) {\n    \n};`,
      python: `class Solution:\n    def trap(self, height: list[int]) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};`,
      java: `class Solution {\n    public int trap(int[] height) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expectedOutput: 6, isSecret: false },
      { input: [[4, 2, 0, 3, 2, 5]], expectedOutput: 9, isSecret: false },
      { input: [[1, 2, 3, 4, 5]], expectedOutput: 0, isSecret: false },
      { input: [[5, 4, 3, 2, 1]], expectedOutput: 0, isSecret: false },
      { input: [[3, 0, 2, 0, 4]], expectedOutput: 7, isSecret: true }
    ]
  },

  // 2. STRINGS 🔤
  {
    id: 'valid-anagram',
    number: 242,
    title: '242. Valid Anagram',
    difficulty: 'Easy',
    topic: 'strings',
    leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.`,
    examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4'],
    entryFunction: 'isAnagram',
    starterTemplates: {
      javascript: `function isAnagram(s, t) {\n    \n};`,
      python: `class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}`
    },
    testCases: [
      { input: ["anagram", "nagaram"], expectedOutput: true, isSecret: false },
      { input: ["rat", "car"], expectedOutput: false, isSecret: false },
      { input: ["a", "a"], expectedOutput: true, isSecret: false },
      { input: ["ab", "a"], expectedOutput: false, isSecret: false },
      { input: ["aacc", "ccac"], expectedOutput: false, isSecret: true }
    ]
  },
  {
    id: 'valid-palindrome',
    number: 125,
    title: '125. Valid Palindrome',
    difficulty: 'Easy',
    topic: 'strings',
    leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.`,
    examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: 'true' }],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    entryFunction: 'isPalindrome',
    starterTemplates: {
      javascript: `function isPalindrome(s) {\n    \n};`,
      python: `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        \n    }\n}`
    },
    testCases: [
      { input: ["A man, a plan, a canal: Panama"], expectedOutput: true, isSecret: false },
      { input: ["race a car"], expectedOutput: false, isSecret: false },
      { input: [" "], expectedOutput: true, isSecret: false },
      { input: ["0P"], expectedOutput: false, isSecret: false },
      { input: ["ab_a"], expectedOutput: true, isSecret: true }
    ]
  },
  {
    id: 'longest-substring-without-repeating-characters',
    number: 3,
    title: '3. Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'strings',
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [{ input: 's = "abcabcbb"', output: '3' }],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    entryFunction: 'lengthOfLongestSubstring',
    starterTemplates: {
      javascript: `function lengthOfLongestSubstring(s) {\n    \n};`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}`
    },
    testCases: [
      { input: ["abcabcbb"], expectedOutput: 3, isSecret: false },
      { input: ["bbbbb"], expectedOutput: 1, isSecret: false },
      { input: ["pwwkew"], expectedOutput: 3, isSecret: false },
      { input: ["aab"], expectedOutput: 2, isSecret: false },
      { input: ["dvdf"], expectedOutput: 3, isSecret: true }
    ]
  },

  // 3. SEARCHING & BINARY SEARCH 🔍
  {
    id: 'binary-search',
    number: 704,
    title: '704. Binary Search',
    difficulty: 'Easy',
    topic: 'binary-search',
    leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
    description: `Given an array of integers \`nums\` sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. Return its index, or \`-1\` if target does not exist.`,
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }],
    constraints: ['1 <= nums.length <= 10^4'],
    entryFunction: 'search',
    starterTemplates: {
      javascript: `function search(nums, target) {\n    \n};`,
      python: `class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expectedOutput: 4, isSecret: false },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expectedOutput: -1, isSecret: false },
      { input: [[5], 5], expectedOutput: 0, isSecret: false },
      { input: [[2, 5], 5], expectedOutput: 1, isSecret: false },
      { input: [[1, 3, 5, 7, 9], 1], expectedOutput: 0, isSecret: true }
    ]
  },
  {
    id: 'search-in-rotated-sorted-array',
    number: 33,
    title: '33. Search in Rotated Sorted Array',
    difficulty: 'Medium',
    topic: 'binary-search',
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    description: `There is an integer array \`nums\` sorted in ascending order with distinct values. Given the array \`nums\` after rotational shift and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not.`,
    examples: [{ input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' }],
    constraints: ['1 <= nums.length <= 5000'],
    entryFunction: 'search',
    starterTemplates: {
      javascript: `function search(nums, target) {\n    \n};`,
      python: `class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expectedOutput: 4, isSecret: false },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expectedOutput: -1, isSecret: false },
      { input: [[1], 0], expectedOutput: -1, isSecret: false },
      { input: [[5, 1, 3], 3], expectedOutput: 2, isSecret: false },
      { input: [[3, 1], 1], expectedOutput: 1, isSecret: true }
    ]
  },

  // 4. LINKED LISTS & TREES 🌳
  {
    id: 'linked-list-cycle',
    number: 141,
    title: '141. Linked List Cycle',
    difficulty: 'Easy',
    topic: 'linked-lists',
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it. Return \`true\` if there is a cycle, otherwise return \`false\`.`,
    examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true' }],
    constraints: ['0 <= number of nodes <= 10^4'],
    entryFunction: 'hasCycle',
    starterTemplates: {
      javascript: `function hasCycle(head) {\n    \n};`,
      python: `class Solution:\n    def hasCycle(self, head) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean hasCycle(ListNode head) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[3, 2, 0, -4]], expectedOutput: true, isSecret: false },
      { input: [[1, 2]], expectedOutput: false, isSecret: false },
      { input: [[1]], expectedOutput: false, isSecret: false },
      { input: [[]], expectedOutput: false, isSecret: false },
      { input: [[5, 5, 5, 5]], expectedOutput: true, isSecret: true }
    ]
  },
  {
    id: 'same-tree',
    number: 100,
    title: '100. Same Tree',
    difficulty: 'Easy',
    topic: 'trees',
    leetcodeUrl: 'https://leetcode.com/problems/same-tree/',
    description: `Given the roots of two binary trees \`p\` and \`q\`, write a function to check if they are the same or not.`,
    examples: [{ input: 'p = [1,2,3], q = [1,2,3]', output: 'true' }],
    constraints: ['0 <= number of nodes <= 100'],
    entryFunction: 'isSameTree',
    starterTemplates: {
      javascript: `function isSameTree(p, q) {\n    \n};`,
      python: `class Solution:\n    def isSameTree(self, p, q) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool isSameTree(TreeNode* p, TreeNode* q) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[1, 2, 3], [1, 2, 3]], expectedOutput: true, isSecret: false },
      { input: [[1, 2], [1, null, 2]], expectedOutput: false, isSecret: false },
      { input: [[1, 2, 1], [1, 1, 2]], expectedOutput: false, isSecret: false },
      { input: [[], []], expectedOutput: true, isSecret: false },
      { input: [[10], [10]], expectedOutput: true, isSecret: true }
    ]
  },

  // 5. DYNAMIC PROGRAMMING 🧠
  {
    id: 'climbing-stairs',
    number: 70,
    title: '70. Climbing Stairs',
    difficulty: 'Easy',
    topic: 'dp',
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [{ input: 'n = 2', output: '2' }],
    constraints: ['1 <= n <= 45'],
    entryFunction: 'climbStairs',
    starterTemplates: {
      javascript: `function climbStairs(n) {\n    \n};`,
      python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}`
    },
    testCases: [
      { input: [2], expectedOutput: 2, isSecret: false },
      { input: [3], expectedOutput: 3, isSecret: false },
      { input: [1], expectedOutput: 1, isSecret: false },
      { input: [5], expectedOutput: 8, isSecret: false },
      { input: [10], expectedOutput: 89, isSecret: true }
    ]
  },
  {
    id: 'coin-change',
    number: 322,
    title: '322. Coin Change',
    difficulty: 'Medium',
    topic: 'dp',
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\`. Return *the fewest number of coins that you need to make up that amount*. If impossible, return \`-1\`.`,
    examples: [{ input: 'coins = [1,2,5], amount = 11', output: '3' }],
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    entryFunction: 'coinChange',
    starterTemplates: {
      javascript: `function coinChange(coins, amount) {\n    \n};`,
      python: `class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[1, 2, 5], 11], expectedOutput: 3, isSecret: false },
      { input: [[2], 3], expectedOutput: -1, isSecret: false },
      { input: [[1], 0], expectedOutput: 0, isSecret: false },
      { input: [[186, 419, 83, 408], 6249], expectedOutput: 20, isSecret: false },
      { input: [[2, 5, 10], 7], expectedOutput: 2, isSecret: true }
    ]
  }
];
