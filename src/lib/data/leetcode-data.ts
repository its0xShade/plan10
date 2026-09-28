export interface LeetProblem {
  s: string; // slug for URL
  t: string; // title
  d: "E" | "M" | "H";
  g: string; // group
}

export const LEET_DIFF_LABEL: Record<LeetProblem["d"], string> = { E: "آسان", M: "متوسط", H: "سخت" };

/** تخته LeetCode — ۹۰ سؤال پرتکرار مصاحبه‌ای جونیور */
export const LEET_PROBLEMS: LeetProblem[] = [
  // رشته‌ها و آرایه‌ها
  { s: "two-sum", t: "Two Sum", d: "E", g: "رشته و آرایه" },
  { s: "best-time-to-buy-and-sell-stock", t: "Best Time to Buy and Sell Stock", d: "E", g: "رشته و آرایه" },
  { s: "contains-duplicate", t: "Contains Duplicate", d: "E", g: "رشته و آرایه" },
  { s: "product-of-array-except-self", t: "Product of Array Except Self", d: "M", g: "رشته و آرایه" },
  { s: "maximum-subarray", t: "Maximum Subarray", d: "M", g: "رشته و آرایه" },
  { s: "merge-intervals", t: "Merge Intervals", d: "M", g: "رشته و آرایه" },
  { s: "rotate-array", t: "Rotate Array", d: "M", g: "رشته و آرایه" },
  { s: "move-zeroes", t: "Move Zeroes", d: "E", g: "رشته و آرایه" },
  { s: "trapping-rain-water", t: "Trapping Rain Water", d: "H", g: "رشته و آرایه" },
  { s: "longest-substring-without-repeating-characters", t: "Longest Substring Without Repeating Characters", d: "M", g: "رشته و آرایه" },
  { s: "longest-palindromic-substring", t: "Longest Palindromic Substring", d: "M", g: "رشته و آرایه" },
  { s: "string-compression", t: "String Compression", d: "M", g: "رشته و آرایه" },
  { s: "reverse-string", t: "Reverse String", d: "E", g: "رشته و آرایه" },
  { s: "valid-anagram", t: "Valid Anagram", d: "E", g: "رشته و آرایه" },
  { s: "group-anagrams", t: "Group Anagrams", d: "M", g: "رشته و آرایه" },
  // دو اشاره‌گر / لغزش پنجره
  { s: "two-pointer-ii", t: "Two Sum II - Input Array Is Sorted", d: "M", g: "دو اشاره‌گر" },
  { s: "container-with-most-water", t: "Container With Most Water", d: "M", g: "دو اشاره‌گر" },
  { s: "three-sum", t: "3Sum", d: "M", g: "دو اشاره‌گر" },
  { s: "remove-duplicates-from-sorted-array", t: "Remove Duplicates from Sorted Array", d: "E", g: "دو اشاره‌گر" },
  { s: "sliding-window-maximum", t: "Sliding Window Maximum", d: "H", g: "دو اشاره‌گر" },
  // هش‌مپ
  { s: "valid-sudoku", t: "Valid Sudoku", d: "M", g: "هش‌مپ" },
  { s: "top-k-frequent-elements", t: "Top K Frequent Elements", d: "M", g: "هش‌مپ" },
  { s: "longest-consecutive-sequence", t: "Longest Consecutive Sequence", d: "M", g: "هش‌مپ" },
  { s: "subarray-sum-equals-k", t: "Subarray Sum Equals K", d: "M", g: "هش‌مپ" },
  // لیست پیوندی
  { s: "reverse-linked-list", t: "Reverse Linked List", d: "E", g: "لیست پیوندی" },
  { s: "merge-two-sorted-lists", t: "Merge Two Sorted Lists", d: "E", g: "لیست پیوندی" },
  { s: "linked-list-cycle", t: "Linked List Cycle", d: "E", g: "لیست پیوندی" },
  { s: "remove-nth-node-from-end-of-list", t: "Remove Nth Node From End of List", d: "M", g: "لیست پیوندی" },
  { s: "reorder-list", t: "Reorder List", d: "M", g: "لیست پیوندی" },
  { s: "add-two-numbers", t: "Add Two Numbers", d: "M", g: "لیست پیوندی" },
  { s: "lru-cache", t: "LRU Cache", d: "M", g: "لیست پیوندی" },
  { s: "merge-k-sorted-lists", t: "Merge k Sorted Lists", d: "H", g: "لیست پیوندی" },
  // درخت
  { s: "maximum-depth-of-binary-tree", t: "Maximum Depth of Binary Tree", d: "E", g: "درخت" },
  { s: "same-tree", t: "Same Tree", d: "E", g: "درخت" },
  { s: "invert-binary-tree", t: "Invert Binary Tree", d: "E", g: "درخت" },
  { s: "binary-tree-level-order-traversal", t: "Binary Tree Level Order Traversal", d: "M", g: "درخت" },
  { s: "validate-binary-search-tree", t: "Validate Binary Search Tree", d: "M", g: "درخت" },
  { s: "lowest-common-ancestor-of-a-binary-tree", t: "Lowest Common Ancestor of a Binary Tree", d: "M", g: "درخت" },
  { s: "binary-tree-right-side-view", t: "Binary Tree Right Side View", d: "M", g: "درخت" },
  { s: "diameter-of-binary-tree", t: "Diameter of Binary Tree", d: "E", g: "درخت" },
  { s: "serialize-and-deserialize-binary-tree", t: "Serialize and Deserialize Binary Tree", d: "H", g: "درخت" },
  { s: "number-of-islands", t: "Number of Islands", d: "M", g: "درخت" },
  // گراف
  { s: "course-schedule", t: "Course Schedule", d: "M", g: "گراف" },
  { s: "course-schedule-ii", t: "Course Schedule II", d: "M", g: "گراف" },
  { s: "clone-graph", t: "Clone Graph", d: "M", g: "گراف" },
  { s: "pacific-atlantic-water-flow", t: "Pacific Atlantic Water Flow", d: "M", g: "گراف" },
  { s: "word-ladder", t: "Word Ladder", d: "H", g: "گراف" },
  { s: "min-cost-to-connect-all-points", t: "Min Cost to Connect All Points", d: "M", g: "گراف" },
  // دینامیک برنامه‌ریزی
  { s: "climbing-stairs", t: "Climbing Stairs", d: "E", g: "دینامیک" },
  { s: "house-robber", t: "House Robber", d: "M", g: "دینامیک" },
  { s: "house-robber-ii", t: "House Robber II", d: "M", g: "دینامیک" },
  { s: "coin-change", t: "Coin Change", d: "M", g: "دینامیک" },
  { s: "longest-increasing-subsequence", t: "Longest Increasing Subsequence", d: "M", g: "دینامیک" },
  { s: "word-break", t: "Word Break", d: "M", g: "دینامیک" },
  { s: "partition-equal-subset-sum", t: "Partition Equal Subset Sum", d: "M", g: "دینامیک" },
  { s: "unique-paths", t: "Unique Paths", d: "M", g: "دینامیک" },
  { s: "minimum-path-sum", t: "Minimum Path Sum", d: "M", g: "دینامیک" },
  { s: "edit-distance", t: "Edit Distance", d: "M", g: "دینامیک" },
  // باینری سرچ
  { s: "binary-search", t: "Binary Search", d: "E", g: "باینری سرچ" },
  { s: "search-a-2d-matrix", t: "Search a 2D Matrix", d: "M", g: "باینری سرچ" },
  { s: "find-peak-element", t: "Find Peak Element", d: "M", g: "باینری سرچ" },
  { s: "search-in-rotated-sorted-array", t: "Search in Rotated Sorted Array", d: "M", g: "باینری سرچ" },
  { s: "koko-eating-bananas", t: "Koko Eating Bananas", d: "M", g: "باینری سرچ" },
  { s: "capacity-to-ship-packages-within-d-days", t: "Capacity To Ship Packages Within D Days", d: "M", g: "باینری سرچ" },
  // پشته/صف
  { s: "valid-parentheses", t: "Valid Parentheses", d: "E", g: "پشته و صف" },
  { s: "min-stack", t: "Min Stack", d: "M", g: "پشته و صف" },
  { s: "daily-temperatures", t: "Daily Temperatures", d: "M", g: "پشته و صف" },
  { s: "implement-queue-using-stacks", t: "Implement Queue using Stacks", d: "E", g: "پشته و صف" },
  { s: "next-greater-element-i", t: "Next Greater Element I", d: "E", g: "پشته و صف" },
  { s: "evaluate-reverse-polish-notation", t: "Evaluate Reverse Polish Notation", d: "M", g: "پشته و صف" },
  // هیپ
  { s: "kth-largest-element-in-an-array", t: "Kth Largest Element in an Array", d: "M", g: "هیپ" },
  { s: "top-k-frequent-words", t: "Top K Frequent Words", d: "M", g: "هیپ" },
  { s: "task-scheduler", t: "Task Scheduler", d: "M", g: "هیپ" },
  { s: "find-median-from-data-stream", t: "Find Median from Data Stream", d: "H", g: "هیپ" },
  { s: "last-stone-weight", t: "Last Stone Weight", d: "E", g: "هیپ" },
  // بازگشتی
  { s: "subsets", t: "Subsets", d: "M", g: "بازگشتی" },
  { s: "permutations", t: "Permutations", d: "M", g: "بازگشتی" },
  { s: "combination-sum", t: "Combination Sum", d: "M", g: "بازگشتی" },
  { s: "letter-combinations-of-a-phone-number", t: "Letter Combinations of a Phone Number", d: "M", g: "بازگشتی" },
  { s: "word-search", t: "Word Search", d: "M", g: "بازگشتی" },
  { s: "generate-parentheses", t: "Generate Parentheses", d: "M", g: "بازگشتی" },
  // ریاضی و متفرقه
  { s: "fizz-buzz", t: "Fizz Buzz", d: "E", g: "ریاضی و متفرقه" },
  { s: "count-primes", t: "Count Primes", d: "M", g: "ریاضی و متفرقه" },
  { s: "single-number", t: "Single Number", d: "E", g: "ریاضی و متفرقه" },
  { s: "missing-number", t: "Missing Number", d: "E", g: "ریاضی و متفرقه" },
  { s: "number-of-1-bits", t: "Number of 1 Bits", d: "E", g: "ریاضی و متفرقه" },
  { s: "minesweeper", t: "Minesweeper", d: "M", g: "ریاضی و متفرقه" },
];

export const LEET_GROUPS = [...new Set(LEET_PROBLEMS.map((p) => p.g))];
