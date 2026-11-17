/**
 * 4-Week DSA & OOPS Mastery Homework Plan & Interview Roadmap
 * Exact syllabus compiled from curriculum guidelines
 */

export const DSA_NOTES_PLAN = {
  id: '4-week-dsa-oops-plan',
  title: '4-Week DSA & OOPS Mastery Homework Plan',
  subtitle: 'The Ultimate Industry & Placement Preparation Roadmap with 60+ Curated LeetCode Problems & OOPS Design Exercises',
  originalPrice: 199,
  price: 19,
  currency: '₹',
  rating: 4.9,
  reviewsCount: 1420,
  badge: '🔥 90% OFF Flash Deal',
  features: [
    '60+ Handpicked LeetCode Problems with Direct Links & Solution Patterns',
    'Full 4-Week Daily Structured Breakdown (Array, Strings, Linked Lists, Stacks, Queues, Trees)',
    'Real-World OOPS Interview Design Problems (Interfaces, Abstract Classes, Polymorphism, Packages)',
    'High-Yield Pattern Strategies (Sliding Window, Two Pointers, Monotonic Stack, BST Traversals)',
    'Interactive Progress Tracker (Track Solved Problems)',
    'Lifetime Access & One-Click PDF Printable Download'
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'WEEK 1 — Arrays + Basic Strings',
      description: 'Master core array manipulation, two pointers, sliding windows, prefix sums, matrices, and fundamental string checks.',
      days: [
        {
          day: 'Day 1: Array Basics',
          problems: [
            {
              id: 'two-sum',
              name: 'Two Sum',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/two-sum/',
              pattern: 'Hash Map Lookup / Complements'
            },
            {
              id: 'remove-duplicates-from-sorted-array',
              name: 'Remove Duplicates from Sorted Array',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
              pattern: 'Two Pointers (Slow & Fast)'
            },
            {
              id: 'best-time-to-buy-and-sell-stock',
              name: 'Best Time to Buy and Sell Stock',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
              pattern: 'Single Pass / Running Minimum'
            }
          ]
        },
        {
          day: 'Day 2: Prefix Sum / Sliding Window',
          problems: [
            {
              id: 'maximum-subarray',
              name: 'Maximum Subarray (Kadane’s Algorithm)',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/maximum-subarray/',
              pattern: "Kadane's Dynamic Programming"
            },
            {
              id: 'contains-duplicate',
              name: 'Contains Duplicate',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/contains-duplicate/',
              pattern: 'Hash Set Lookup'
            },
            {
              id: 'maximum-average-subarray-i',
              name: 'Maximum Average Subarray I',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
              pattern: 'Fixed Size Sliding Window'
            }
          ]
        },
        {
          day: 'Day 3: Two Pointer',
          problems: [
            {
              id: 'move-zeroes',
              name: 'Move Zeroes',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/move-zeroes/',
              pattern: 'In-place Array Partitioning'
            },
            {
              id: 'squares-of-a-sorted-array',
              name: 'Squares of a Sorted Array',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
              pattern: 'Two Pointers Converging from Ends'
            },
            {
              id: 'container-with-most-water',
              name: 'Container With Most Water',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/container-with-most-water/',
              pattern: 'Greedy Two Pointers'
            }
          ]
        },
        {
          day: 'Day 4: Matrix Problems',
          problems: [
            {
              id: 'matrix-diagonal-sum',
              name: 'Matrix Diagonal Sum',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/matrix-diagonal-sum/',
              pattern: 'Single Loop Diagonal Traversal'
            },
            {
              id: 'reshape-the-matrix',
              name: 'Reshape the Matrix',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/reshape-the-matrix/',
              pattern: '2D Coordinates Index Mapping'
            },
            {
              id: 'spiral-matrix',
              name: 'Spiral Matrix',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/spiral-matrix/',
              pattern: 'Boundary Boundary Shrinking'
            }
          ]
        },
        {
          day: 'Day 5: String Basics',
          problems: [
            {
              id: 'valid-palindrome',
              name: 'Valid Palindrome',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/valid-palindrome/',
              pattern: 'Two Pointers Alphanumeric Check'
            },
            {
              id: 'reverse-string',
              name: 'Reverse String',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/reverse-string/',
              pattern: 'In-place Character Swap'
            },
            {
              id: 'longest-common-prefix',
              name: 'Longest Common Prefix',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/longest-common-prefix/',
              pattern: 'Horizontal / Vertical Scanning'
            }
          ]
        }
      ],
      oopsProblem: {
        topic: 'INTERFACE — Online Library Management System',
        description: `A library needs an online application for two roles: Adults and Children. Both should be able to register an account.
• Any user under 12 years of age registers as a child and can borrow a "Kids" category book for 10 days.
• An adult (> 12 years) can borrow "Fiction" category books returned within 7 days.

Specifications:
1. Interface 'LibraryUser' with methods:
   - void registerAccount();
   - void requestBook();
2. Implement 'KidUsers' & 'AdultUser' classes with instance variables: age (int), bookType (String).
3. Logic for KidUsers:
   - registerAccount(): if age < 12 -> "You have successfully registered under a Kids Account", else "Sorry, Age must be less than 12 to register as a kid".
   - requestBook(): if bookType is "Kids" -> "Book Issued successfully, please return the book within 10 days", else "Oops, you are allowed to take only kids books".
4. Logic for AdultUser:
   - registerAccount(): if age > 12 -> "You have successfully registered under an Adult Account", else "Sorry, Age must be greater than 12 to register as an adult".
   - requestBook(): if bookType is "Fiction" -> "Book Issued successfully, please return the book within 7 days", else "Oops, you are allowed to take only adult Fiction books".
5. Driver class 'LibraryInterfaceDemo.java' testing test cases for both roles.`
      }
    },
    {
      weekNumber: 2,
      title: 'WEEK 2 — Strings (Advanced)',
      description: 'Conquer advanced string hashing, variable sliding windows, pattern matching algorithms, and recursion on strings.',
      days: [
        {
          day: 'Day 1: Hashing in Strings',
          problems: [
            {
              id: 'valid-anagram',
              name: 'Valid Anagram',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/valid-anagram/',
              pattern: 'Frequency Array / Hash Map'
            },
            {
              id: 'first-unique-character-in-a-string',
              name: 'First Unique Character in a String',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/first-unique-character-in-a-string/',
              pattern: 'Two-Pass Hash Frequency'
            },
            {
              id: 'ransom-note',
              name: 'Ransom Note',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/ransom-note/',
              pattern: 'Character Bucket Counting'
            }
          ]
        },
        {
          day: 'Day 2: Sliding Window on Strings',
          problems: [
            {
              id: 'longest-substring-without-repeating-characters',
              name: 'Longest Substring Without Repeating Characters',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
              pattern: 'Dynamic Sliding Window with Hash Set/Map'
            },
            {
              id: 'permutation-in-string',
              name: 'Permutation in String',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/permutation-in-string/',
              pattern: 'Fixed Size Frequency Window'
            },
            {
              id: 'find-all-anagrams-in-a-string',
              name: 'Find All Anagrams in a String',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
              pattern: 'Sliding Window Frequency Matching'
            }
          ]
        },
        {
          day: 'Day 3: Pattern Matching',
          problems: [
            {
              id: 'find-the-index-of-the-first-occurrence-in-a-string',
              name: 'Find Index of First Occurrence in String (strStr)',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
              pattern: 'Substrings / KMP / Rabin-Karp'
            },
            {
              id: 'is-subsequence',
              name: 'Is Subsequence',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/is-subsequence/',
              pattern: 'Two Pointers Sequence Matching'
            },
            {
              id: 'repeated-substring-pattern',
              name: 'Repeated Substring Pattern',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/repeated-substring-pattern/',
              pattern: 'String Concatenation Trick / Periodicity'
            }
          ]
        },
        {
          day: 'Day 4: Recursion + Strings',
          problems: [
            {
              id: 'reverse-words-in-a-string-iii',
              name: 'Reverse Words in a String III',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/reverse-words-in-a-string-iii/',
              pattern: 'Word by Word Inversion'
            },
            {
              id: 'decode-string',
              name: 'Decode String',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/decode-string/',
              pattern: 'Stack / Recursion Evaluation'
            },
            {
              id: 'generate-parentheses',
              name: 'Generate Parentheses',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/generate-parentheses/',
              pattern: 'Backtracking with Open & Close Counters'
            }
          ]
        },
        {
          day: 'Day 5: Mixed String Problems',
          problems: [
            {
              id: 'group-anagrams',
              name: 'Group Anagrams',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/group-anagrams/',
              pattern: 'Categorize by Sorted String or Character Count'
            },
            {
              id: 'string-compression',
              name: 'String Compression',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/string-compression/',
              pattern: 'Two Pointers In-place Run-Length Encoding'
            },
            {
              id: 'longest-palindromic-substring',
              name: 'Longest Palindromic Substring',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/longest-palindromic-substring/',
              pattern: 'Expand Around Center / DP'
            }
          ]
        }
      ],
      oopsProblem: {
        topic: 'PACKAGES & INTERFACES — Musical Instruments Architecture',
        description: `Design a package-based modular object-oriented musical system:
1. Interface 'Playable' with method:
   void play();
   Placed in package 'music'.
2. Class 'Veena' implementing 'Playable' placed in package 'music.string'.
3. Class 'Saxophone' implementing 'Playable' placed in package 'music.wind'.
4. Driver class 'Test' in package 'live':
   a. Instantiate Veena and call play().
   b. Instantiate Saxophone and call play().
   c. Assign both instances polymorphically to a variable of type Playable and call play().`
      }
    },
    {
      weekNumber: 3,
      title: 'WEEK 3 — Linked List + Stack + Queue',
      description: 'Master pointer navigation in linked lists, monotonic stack concepts, parenthesis matching, and sliding window maximum with queues.',
      days: [
        {
          day: 'Part A — Linked List (Days 1 & 2)',
          problems: [
            {
              id: 'linked-list-cycle',
              name: 'Linked List Cycle',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/linked-list-cycle/',
              pattern: "Floyd's Tortoise and Hare Cycle Detection"
            },
            {
              id: 'reverse-linked-list',
              name: 'Reverse Linked List',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/reverse-linked-list/',
              pattern: 'Iterative 3-Pointers (prev, curr, next)'
            },
            {
              id: 'middle-of-the-linked-list',
              name: 'Middle of the Linked List',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
              pattern: 'Slow & Fast Pointers'
            },
            {
              id: 'merge-two-sorted-lists',
              name: 'Merge Two Sorted Lists',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
              pattern: 'Dummy Node & Pointer Splicing'
            },
            {
              id: 'remove-nth-node-from-end-of-list',
              name: 'Remove Nth Node From End of List',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
              pattern: 'Two Pointers with Offset N'
            },
            {
              id: 'palindrome-linked-list',
              name: 'Palindrome Linked List',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/palindrome-linked-list/',
              pattern: 'Find Middle, Reverse 2nd Half, Compare'
            }
          ]
        },
        {
          day: 'Part B — Stack (Days 3 & 4)',
          problems: [
            {
              id: 'valid-parentheses',
              name: 'Valid Parentheses',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/valid-parentheses/',
              pattern: 'LIFO Bracket Matching Stack'
            },
            {
              id: 'min-stack',
              name: 'Min Stack',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/min-stack/',
              pattern: 'Auxiliary Stack / Pair Tracking O(1)'
            },
            {
              id: 'next-greater-element-i',
              name: 'Next Greater Element I',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/next-greater-element-i/',
              pattern: 'Monotonic Decreasing Stack'
            },
            {
              id: 'daily-temperatures',
              name: 'Daily Temperatures',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/daily-temperatures/',
              pattern: 'Monotonic Stack of Indices'
            },
            {
              id: 'evaluate-reverse-polish-notation',
              name: 'Evaluate Reverse Polish Notation (RPN)',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
              pattern: 'Postfix Arithmetic Stack Evaluation'
            },
            {
              id: 'largest-rectangle-in-histogram',
              name: 'Largest Rectangle in Histogram',
              difficulty: 'Hard',
              url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
              pattern: 'Monotonic Stack of Heights'
            }
          ]
        },
        {
          day: 'Part C — Queue / Deque (Day 5)',
          problems: [
            {
              id: 'implement-queue-using-stacks',
              name: 'Implement Queue using Stacks',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/implement-queue-using-stacks/',
              pattern: 'In-Stack & Out-Stack Amortized O(1)'
            },
            {
              id: 'number-of-recent-calls',
              name: 'Number of Recent Calls',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/number-of-recent-calls/',
              pattern: 'FIFO Queue Window [t - 3000, t]'
            },
            {
              id: 'sliding-window-maximum',
              name: 'Sliding Window Maximum',
              difficulty: 'Hard',
              url: 'https://leetcode.com/problems/sliding-window-maximum/',
              pattern: 'Monotonic Double-Ended Queue (Deque)'
            }
          ]
        }
      ],
      oopsProblem: {
        topic: 'ABSTRACT CLASSES & POLYMORPHISM — Rail Coach Management System',
        description: `Design a railway compartment hierarchy demonstrating run-time polymorphism:
1. Abstract class 'Compartment' with abstract method:
   public abstract String notice();
2. Derived classes:
   - FirstClass: returns notice for First Class passengers.
   - Ladies: returns notice for Ladies compartment.
   - General: returns notice for General passengers.
   - Luggage: returns notice for Goods/Luggage compartment.
3. Test class 'TestCompartment.java':
   - Declare an array of Compartment of size 10.
   - Allocate random compartment instances using random integer (1 to 4).
   - Iterate and invoke notice() to verify dynamic method dispatch / polymorphism.`
      }
    },
    {
      weekNumber: 4,
      title: 'WEEK 4 — Trees & Advanced OOPS',
      description: 'Master binary tree recursion, BFS level order traversals, Binary Search Tree properties, path sums, tree serialization, and comprehensive OOP designs.',
      days: [
        {
          day: 'Day 1: Binary Tree Basics',
          problems: [
            {
              id: 'maximum-depth-of-binary-tree',
              name: 'Maximum Depth of Binary Tree',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
              pattern: 'Post-order DFS / Recursion'
            },
            {
              id: 'invert-binary-tree',
              name: 'Invert Binary Tree',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/invert-binary-tree/',
              pattern: 'Recursive Subtree Swap'
            },
            {
              id: 'same-tree',
              name: 'Same Tree',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/same-tree/',
              pattern: 'Simultaneous Dual Tree DFS'
            }
          ]
        },
        {
          day: 'Day 2: Traversals',
          problems: [
            {
              id: 'binary-tree-inorder-traversal',
              name: 'Binary Tree Inorder Traversal',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
              pattern: 'DFS Inorder (Left, Root, Right)'
            },
            {
              id: 'binary-tree-level-order-traversal',
              name: 'Binary Tree Level Order Traversal',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
              pattern: 'BFS Queue by Level Size'
            },
            {
              id: 'binary-tree-zigzag-level-order-traversal',
              name: 'Binary Tree Zigzag Level Order Traversal',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/',
              pattern: 'BFS with Alternating Deque Direction'
            }
          ]
        },
        {
          day: 'Day 3: Binary Search Tree (BST)',
          problems: [
            {
              id: 'search-in-a-binary-search-tree',
              name: 'Search in a Binary Search Tree',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/',
              pattern: 'BST Property Navigation'
            },
            {
              id: 'validate-binary-search-tree',
              name: 'Validate Binary Search Tree',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/validate-binary-search-tree/',
              pattern: 'Valid Range Bounds (low, high)'
            },
            {
              id: 'lowest-common-ancestor-of-a-binary-search-tree',
              name: 'Lowest Common Ancestor of a BST',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
              pattern: 'BST Split Point'
            }
          ]
        },
        {
          day: 'Day 4: Path Based Problems',
          problems: [
            {
              id: 'path-sum',
              name: 'Path Sum',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/path-sum/',
              pattern: 'DFS Remaining Target Subtraction'
            },
            {
              id: 'diameter-of-binary-tree',
              name: 'Diameter of Binary Tree',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
              pattern: 'Global Max Path through Node'
            },
            {
              id: 'binary-tree-maximum-path-sum',
              name: 'Binary Tree Maximum Path Sum',
              difficulty: 'Hard',
              url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
              pattern: 'DFS Max Gain Contribution'
            }
          ]
        },
        {
          day: 'Day 5: Advanced Trees',
          problems: [
            {
              id: 'symmetric-tree',
              name: 'Symmetric Tree',
              difficulty: 'Easy',
              url: 'https://leetcode.com/problems/symmetric-tree/',
              pattern: 'Mirror Reflection DFS'
            },
            {
              id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
              name: 'Construct Binary Tree from Preorder & Inorder Traversal',
              difficulty: 'Medium',
              url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
              pattern: 'Root Index Split via Inorder Map'
            },
            {
              id: 'serialize-and-deserialize-binary-tree',
              name: 'Serialize and Deserialize Binary Tree',
              difficulty: 'Hard',
              url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
              pattern: 'Preorder / Level Order String Encoding'
            }
          ]
        }
      ],
      oopsProblem: {
        topic: 'OOP ESSENTIALS — Interfaces, Nested Classes & Inheritance',
        description: `Comprehensive 4-part OOP design challenges:
1. Interface & Implementation:
   - Create interface 'test' with member function square().
   - Implement in class 'arithmetic'.
   - Create 'ToTestInt' using the object of arithmetic class.
2. Nested Classes:
   - Create outer class with function display().
   - Inside outer class, create inner class named 'inner' with display().
   - Instantiate and invoke both from main.
3. Encapsulation:
   - Class 'Point' with private fields int x, y.
   - Constructors: Point(), Point(int x, int y).
   - Mutator methods: setX(int), setY(int), setXY(int, int).
4. Inheritance & Geometric Computation:
   - Base class 'Box' and derived class 'Box3d'.
   - Constructor sets length, breadth, height.
   - Calculate surface area and volume across inheritance hierarchy.`
      }
    }
  ]
};
