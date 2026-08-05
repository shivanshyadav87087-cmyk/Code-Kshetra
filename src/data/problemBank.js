export const PROBLEM_BANK = [
  // ==========================================
  // 1. ARRAYS 📊
  // ==========================================
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
    id: 'reverse-the-array',
    number: 344,
    title: 'Reverse the Array',
    difficulty: 'Easy',
    topic: 'arrays',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-string/',
    description: `Given an array of integers \`nums\`, reverse the array in-place and return the reversed array.`,
    examples: [{ input: 'nums = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' }],
    constraints: ['1 <= nums.length <= 10^5'],
    entryFunction: 'reverseArray',
    starterTemplates: {
      javascript: `function reverseArray(nums) {\n    return nums.reverse();\n};`,
      python: `class Solution:\n    def reverseArray(self, nums: list[int]) -> list[int]:\n        return nums[::-1]`,
      cpp: `class Solution {\npublic:\n    vector<int> reverseArray(vector<int>& nums) {\n        reverse(nums.begin(), nums.end());\n        return nums;\n    }\n};`,
      java: `class Solution {\n    public int[] reverseArray(int[] nums) {\n        int i = 0, j = nums.length - 1;\n        while (i < j) { int t = nums[i]; nums[i++] = nums[j]; nums[j--] = t; }\n        return nums;\n    }\n}`
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expectedOutput: [5, 4, 3, 2, 1], isSecret: false },
      { input: [[10, 20]], expectedOutput: [20, 10], isSecret: false },
      { input: [[7]], expectedOutput: [7], isSecret: false },
      { input: [[-1, 0, 1]], expectedOutput: [1, 0, -1], isSecret: true }
    ]
  },
  {
    id: 'sort-colors-012',
    number: 75,
    title: '75. Sort Colors (Sort Array of 0s, 1s, and 2s)',
    difficulty: 'Medium',
    topic: 'arrays',
    leetcodeUrl: 'https://leetcode.com/problems/sort-colors/',
    description: `Given an array \`nums\` with \`n\` objects colored red, white, or blue (represented by 0, 1, 2), sort them in-place so that objects of the same color are adjacent.`,
    examples: [{ input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' }],
    constraints: ['n == nums.length', '1 <= n <= 300'],
    entryFunction: 'sortColors',
    starterTemplates: {
      javascript: `function sortColors(nums) {\n    return nums.sort((a,b) => a-b);\n};`,
      python: `class Solution:\n    def sortColors(self, nums: list[int]) -> list[int]:\n        nums.sort()\n        return nums`,
      cpp: `class Solution {\npublic:\n    vector<int> sortColors(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        return nums;\n    }\n};`,
      java: `class Solution {\n    public int[] sortColors(int[] nums) {\n        Arrays.sort(nums);\n        return nums;\n    }\n}`
    },
    testCases: [
      { input: [[2, 0, 2, 1, 1, 0]], expectedOutput: [0, 0, 1, 1, 2, 2], isSecret: false },
      { input: [[2, 0, 1]], expectedOutput: [0, 1, 2], isSecret: false },
      { input: [[0]], expectedOutput: [0], isSecret: false },
      { input: [[1, 0]], expectedOutput: [0, 1], isSecret: true }
    ]
  },
  {
    id: 'maximum-subarray',
    number: 53,
    title: '53. Maximum Subarray (Kadane\'s Algorithm)',
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
      { input: [[-5, -2, -3, -1, -4]], expectedOutput: -1, isSecret: true }
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
      { input: [[3, 0, 2, 0, 4]], expectedOutput: 7, isSecret: true }
    ]
  },

  // ==========================================
  // 2. MATRIX / 2D GRID 🧊 (SEPARATE TOPIC)
  // ==========================================
  {
    id: 'spiral-matrix',
    number: 54,
    title: '54. Spiral Matrix (Spiral Traversal on Matrix)',
    difficulty: 'Medium',
    topic: 'matrix',
    leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/',
    description: `Given an \`m x n\` \`matrix\`, return *all elements of the \`matrix\` in spiral order*.`,
    examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' }],
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 10'],
    entryFunction: 'spiralOrder',
    starterTemplates: {
      javascript: `function spiralOrder(matrix) {\n    \n};`,
      python: `class Solution:\n    def spiralOrder(self, matrix: list[list[int]]) -> list[int]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        \n    }\n};`,
      java: `class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expectedOutput: [1, 2, 3, 6, 9, 8, 7, 4, 5], isSecret: false },
      { input: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expectedOutput: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7], isSecret: false },
      { input: [[[1]]], expectedOutput: [1], isSecret: true }
    ]
  },
  {
    id: 'rotate-image',
    number: 48,
    title: '48. Rotate Image (Rotate Matrix 90 Degrees)',
    difficulty: 'Medium',
    topic: 'matrix',
    leetcodeUrl: 'https://leetcode.com/problems/rotate-image/',
    description: `You are given an \`n x n\` 2D \`matrix\` representing an image, rotate the image by 90 degrees (clockwise) in-place.`,
    examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' }],
    constraints: ['n == matrix.length == matrix[i].length', '1 <= n <= 20'],
    entryFunction: 'rotate',
    starterTemplates: {
      javascript: `function rotate(matrix) {\n    \n};`,
      python: `class Solution:\n    def rotate(self, matrix: list[list[int]]) -> None:\n        pass`,
      cpp: `class Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        \n    }\n};`,
      java: `class Solution {\n    public void rotate(int[][] matrix) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expectedOutput: [[7, 4, 1], [8, 5, 2], [9, 6, 3]], isSecret: false },
      { input: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]], expectedOutput: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]], isSecret: false },
      { input: [[[1, 2], [3, 4]]], expectedOutput: [[3, 1], [4, 2]], isSecret: true }
    ]
  },
  {
    id: 'search-a-2d-matrix',
    number: 74,
    title: '74. Search a 2D Matrix (Search Element in Matrix)',
    difficulty: 'Medium',
    topic: 'matrix',
    leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/',
    description: `Write an efficient algorithm that searches for a value \`target\` in an \`m x n\` integer matrix \`matrix\`.`,
    examples: [{ input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', output: 'true' }],
    constraints: ['m == matrix.length', 'n == matrix[i].length'],
    entryFunction: 'searchMatrix',
    starterTemplates: {
      javascript: `function searchMatrix(matrix, target) {\n    \n};`,
      python: `class Solution:\n    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool searchMatrix(vector<vector<int>>& matrix, int target) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expectedOutput: true, isSecret: false },
      { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expectedOutput: false, isSecret: false },
      { input: [[[1]], 1], expectedOutput: true, isSecret: true }
    ]
  },

  // ==========================================
  // 3. STRINGS 🔤
  // ==========================================
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
      { input: ["ab_a"], expectedOutput: true, isSecret: true }
    ]
  },
  {
    id: 'longest-palindromic-substring',
    number: 5,
    title: '5. Longest Palindromic Substring',
    difficulty: 'Medium',
    topic: 'strings',
    leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/',
    description: `Given a string \`s\`, return *the longest palindromic substring* in \`s\`.`,
    examples: [{ input: 's = "babad"', output: '"bab"' }],
    constraints: ['1 <= s.length <= 1000'],
    entryFunction: 'longestPalindrome',
    starterTemplates: {
      javascript: `function longestPalindrome(s) {\n    \n};`,
      python: `class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass`,
      cpp: `class Solution {\npublic:\n    string longestPalindrome(string s) {\n        \n    }\n};`,
      java: `class Solution {\n    public String longestPalindrome(String s) {\n        \n    }\n}`
    },
    testCases: [
      { input: ["babad"], expectedOutput: "bab", isSecret: false },
      { input: ["cbbd"], expectedOutput: "bb", isSecret: false },
      { input: ["a"], expectedOutput: "a", isSecret: true }
    ]
  },

  // ==========================================
  // 4. SEARCHING & SORTING 🔍
  // ==========================================
  {
    id: 'binary-search',
    number: 704,
    title: '704. Binary Search',
    difficulty: 'Easy',
    topic: 'searching-sorting',
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
      { input: [[1, 3, 5, 7, 9], 1], expectedOutput: 0, isSecret: true }
    ]
  },
  {
    id: 'find-first-and-last-position-of-element-in-sorted-array',
    number: 34,
    title: '34. Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    topic: 'searching-sorting',
    leetcodeUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
    description: `Given an array of integers \`nums\` sorted in non-decreasing order, find the starting and ending position of a given \`target\` value.`,
    examples: [{ input: 'nums = [5,7,7,8,8,10], target = 8', output: '[3,4]' }],
    constraints: ['0 <= nums.length <= 10^5'],
    entryFunction: 'searchRange',
    starterTemplates: {
      javascript: `function searchRange(nums, target) {\n    \n};`,
      python: `class Solution:\n    def searchRange(self, nums: list[int], target: int) -> list[int]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<int> searchRange(vector<int>& nums, int target) {\n        \n    }\n};`,
      java: `class Solution {\n    public int[] searchRange(int[] nums, int target) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[5, 7, 7, 8, 8, 10], 8], expectedOutput: [3, 4], isSecret: false },
      { input: [[5, 7, 7, 8, 8, 10], 6], expectedOutput: [-1, -1], isSecret: false },
      { input: [[], 0], expectedOutput: [-1, -1], isSecret: true }
    ]
  },

  // ==========================================
  // 5. LINKED LIST 🔗
  // ==========================================
  {
    id: 'reverse-linked-list',
    number: 206,
    title: '206. Reverse Linked List',
    difficulty: 'Easy',
    topic: 'linked-list',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }],
    constraints: ['0 <= number of nodes <= 5000'],
    entryFunction: 'reverseList',
    starterTemplates: {
      javascript: `function reverseList(head) {\n    \n};`,
      python: `class Solution:\n    def reverseList(self, head):\n        pass`,
      cpp: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};`,
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expectedOutput: [5, 4, 3, 2, 1], isSecret: false },
      { input: [[1, 2]], expectedOutput: [2, 1], isSecret: false },
      { input: [[]], expectedOutput: [], isSecret: true }
    ]
  },
  {
    id: 'linked-list-cycle',
    number: 141,
    title: '141. Linked List Cycle (Detect Loop in Linked List)',
    difficulty: 'Easy',
    topic: 'linked-list',
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.`,
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
      { input: [[1]], expectedOutput: false, isSecret: true }
    ]
  },

  // ==========================================
  // 6. BINARY TREES 🌲
  // ==========================================
  {
    id: 'binary-tree-inorder-traversal',
    number: 94,
    title: '94. Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    topic: 'binary-trees',
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
    description: `Given the \`root\` of a binary tree, return *the inorder traversal of its nodes' values*.`,
    examples: [{ input: 'root = [1,null,2,3]', output: '[1,3,2]' }],
    constraints: ['0 <= number of nodes <= 100'],
    entryFunction: 'inorderTraversal',
    starterTemplates: {
      javascript: `function inorderTraversal(root) {\n    \n};`,
      python: `class Solution:\n    def inorderTraversal(self, root) -> list[int]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<int> inorderTraversal(TreeNode* root) {\n        \n    }\n};`,
      java: `class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[1, null, 2, 3]], expectedOutput: [1, 3, 2], isSecret: false },
      { input: [[]], expectedOutput: [], isSecret: false },
      { input: [[1]], expectedOutput: [1], isSecret: true }
    ]
  },

  // ==========================================
  // 7. BINARY SEARCH TREES 🌴
  // ==========================================
  {
    id: 'validate-binary-search-tree',
    number: 98,
    title: '98. Validate Binary Search Tree',
    difficulty: 'Medium',
    topic: 'bst',
    leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
    description: `Given the \`root\` of a binary tree, determine if it is a valid binary search tree (BST).`,
    examples: [{ input: 'root = [2,1,3]', output: 'true' }],
    constraints: ['1 <= number of nodes <= 10^4'],
    entryFunction: 'isValidBST',
    starterTemplates: {
      javascript: `function isValidBST(root) {\n    \n};`,
      python: `class Solution:\n    def isValidBST(self, root) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean isValidBST(TreeNode root) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[2, 1, 3]], expectedOutput: true, isSecret: false },
      { input: [[5, 1, 4, null, null, 3, 6]], expectedOutput: false, isSecret: false },
      { input: [[10]], expectedOutput: true, isSecret: true }
    ]
  },

  // ==========================================
  // 8. GREEDY ALGORITHMS 💰
  // ==========================================
  {
    id: 'jump-game',
    number: 55,
    title: '55. Jump Game',
    difficulty: 'Medium',
    topic: 'greedy',
    leetcodeUrl: 'https://leetcode.com/problems/jump-game/',
    description: `Given an integer array \`nums\`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return \`true\` if you can reach the last index, or \`false\` otherwise.`,
    examples: [{ input: 'nums = [2,3,1,1,4]', output: 'true' }],
    constraints: ['1 <= nums.length <= 10^4'],
    entryFunction: 'canJump',
    starterTemplates: {
      javascript: `function canJump(nums) {\n    \n};`,
      python: `class Solution:\n    def canJump(self, nums: list[int]) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean canJump(int[] nums) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[2, 3, 1, 1, 4]], expectedOutput: true, isSecret: false },
      { input: [[3, 2, 1, 0, 4]], expectedOutput: false, isSecret: false },
      { input: [[0]], expectedOutput: true, isSecret: true }
    ]
  },

  // ==========================================
  // 9. BACKTRACKING & RECURSION 🔄
  // ==========================================
  {
    id: 'n-queens',
    number: 51,
    title: '51. N-Queens',
    difficulty: 'Hard',
    topic: 'backtracking',
    leetcodeUrl: 'https://leetcode.com/problems/n-queens/',
    description: `The n-queens puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other. Return all distinct solutions.`,
    examples: [{ input: 'n = 4', output: '[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]' }],
    constraints: ['1 <= n <= 9'],
    entryFunction: 'solveNQueens',
    starterTemplates: {
      javascript: `function solveNQueens(n) {\n    \n};`,
      python: `class Solution:\n    def solveNQueens(self, n: int) -> list[list[str]]:\n        pass`,
      cpp: `class Solution {\npublic:\n    vector<vector<string>> solveNQueens(int n) {\n        \n    }\n};`,
      java: `class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        \n    }\n}`
    },
    testCases: [
      { input: [4], expectedOutput: [
        [".Q..", "...Q", "Q...", "..Q."],
        ["..Q.", "Q...", "...Q", ".Q.."]
      ], isSecret: false },
      { input: [1], expectedOutput: [["Q"]], isSecret: true }
    ]
  },

  // ==========================================
  // 10. STACK & QUEUE 🥞
  // ==========================================
  {
    id: 'valid-parentheses',
    number: 20,
    title: '20. Valid Parentheses (Balanced Parentheses)',
    difficulty: 'Easy',
    topic: 'stack-queue',
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.`,
    examples: [{ input: 's = "()[]{}"', output: 'true' }],
    constraints: ['1 <= s.length <= 10^4'],
    entryFunction: 'isValid',
    starterTemplates: {
      javascript: `function isValid(s) {\n    \n};`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}`
    },
    testCases: [
      { input: ["()[]{}"], expectedOutput: true, isSecret: false },
      { input: ["(]"], expectedOutput: false, isSecret: false },
      { input: ["{[]}"], expectedOutput: true, isSecret: true }
    ]
  },

  // ==========================================
  // 11. HEAP & PRIORITY QUEUE ⚡
  // ==========================================
  {
    id: 'kth-largest-element-in-an-array',
    number: 215,
    title: '215. Kth Largest Element in an Array',
    difficulty: 'Medium',
    topic: 'heap',
    leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    description: `Given an integer array \`nums\` and an integer \`k\`, return *the \`kth\` largest element in the array*.`,
    examples: [{ input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' }],
    constraints: ['1 <= k <= nums.length <= 10^5'],
    entryFunction: 'findKthLargest',
    starterTemplates: {
      javascript: `function findKthLargest(nums, k) {\n    return nums.sort((a,b) => b-a)[k-1];\n};`,
      python: `class Solution:\n    def findKthLargest(self, nums: list[int], k: int) -> int:\n        nums.sort(reverse=True)\n        return nums[k-1]`,
      cpp: `class Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        sort(nums.rbegin(), nums.rend());\n        return nums[k-1];\n    }\n};`,
      java: `class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        Arrays.sort(nums);\n        return nums[nums.length - k];\n    }\n}`
    },
    testCases: [
      { input: [[3, 2, 1, 5, 6, 4], 2], expectedOutput: 5, isSecret: false },
      { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expectedOutput: 4, isSecret: false },
      { input: [[1], 1], expectedOutput: 1, isSecret: true }
    ]
  },

  // ==========================================
  // 12. GRAPH ALGORITHMS 🌐
  // ==========================================
  {
    id: 'number-of-islands',
    number: 200,
    title: '200. Number of Islands',
    difficulty: 'Medium',
    topic: 'graph',
    leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return *the number of islands*.`,
    examples: [{ input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' }],
    constraints: ['m == grid.length', 'n == grid[i].length'],
    entryFunction: 'numIslands',
    starterTemplates: {
      javascript: `function numIslands(grid) {\n    \n};`,
      python: `class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass`,
      cpp: `class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}`
    },
    testCases: [
      { input: [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]], expectedOutput: 1, isSecret: false },
      { input: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], expectedOutput: 3, isSecret: false },
      { input: [[["0"]]], expectedOutput: 0, isSecret: true }
    ]
  },

  // ==========================================
  // 13. TRIE 🎋
  // ==========================================
  {
    id: 'implement-trie-prefix-tree',
    number: 208,
    title: '208. Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    topic: 'trie',
    leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
    description: `A **trie** (pronounced as "try") or **prefix tree** is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.`,
    examples: [{ input: '["Trie", "insert", "search", "startsWith"]', output: '[null, null, true, true]' }],
    constraints: ['1 <= word.length, prefix.length <= 2000'],
    entryFunction: 'Trie',
    starterTemplates: {
      javascript: `var Trie = function() {\n    this.root = {};\n};\nTrie.prototype.insert = function(word) {};\nTrie.prototype.search = function(word) {};\nTrie.prototype.startsWith = function(prefix) {};`,
      python: `class Trie:\n    def __init__(self):\n        pass`,
      cpp: `class Trie {\npublic:\n    Trie() {}\n};`,
      java: `class Trie {\n    public Trie() {}\n}`
    },
    testCases: [
      { input: [["insert", "apple"], ["search", "apple"]], expectedOutput: [null, true], isSecret: false }
    ]
  },

  // ==========================================
  // 14. DYNAMIC PROGRAMMING 🧠
  // ==========================================
  {
    id: 'climbing-stairs',
    number: 70,
    title: '70. Climbing Stairs',
    difficulty: 'Easy',
    topic: 'dynamic-programming',
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
      { input: [10], expectedOutput: 89, isSecret: true }
    ]
  },
  {
    id: 'coin-change',
    number: 322,
    title: '322. Coin Change',
    difficulty: 'Medium',
    topic: 'dynamic-programming',
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
      { input: [[1], 0], expectedOutput: 0, isSecret: true }
    ]
  },

  // ==========================================
  // 15. BIT MANIPULATION 🔢
  // ==========================================
  {
    id: 'number-of-1-bits',
    number: 191,
    title: '191. Number of 1 Bits (Count Set Bits)',
    difficulty: 'Easy',
    topic: 'bit-manipulation',
    leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/',
    description: `Given a positive integer \`n\`, write a function that returns the number of set bits it has (also known as the Hamming weight).`,
    examples: [{ input: 'n = 11', output: '3', explanation: '11 in binary is 1011 (3 set bits).' }],
    constraints: ['1 <= n <= 2^31 - 1'],
    entryFunction: 'hammingWeight',
    starterTemplates: {
      javascript: `function hammingWeight(n) {\n    return n.toString(2).split('1').length - 1;\n};`,
      python: `class Solution:\n    def hammingWeight(self, n: int) -> int:\n        return bin(n).count('1')`,
      cpp: `class Solution {\npublic:\n    int hammingWeight(uint32_t n) {\n        return __builtin_popcount(n);\n    }\n};`,
      java: `class Solution {\n    public int hammingWeight(int n) {\n        return Integer.bitCount(n);\n    }\n}`
    },
    testCases: [
      { input: [11], expectedOutput: 3, isSecret: false },
      { input: [128], expectedOutput: 1, isSecret: false },
      { input: [2147483645], expectedOutput: 30, isSecret: true }
    ]
  }
];
