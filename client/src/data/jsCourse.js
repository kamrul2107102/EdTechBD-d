export const jsCourse = {
    id: "javascript-basics",
    title: "JavaScript for Beginners",
    description: "Learn JavaScript programming from scratch",
    chapters: [
      {
        id: 1,
        title: "Introduction to JavaScript",
        lessons: [
          {
            id: 1,
            title: "What is JavaScript?",
            content: `# What is JavaScript?
  
  JavaScript is a high-level, interpreted programming language that runs in web browsers. It was created by Brendan Eich in 1995 and is one of the core technologies of the web, along with HTML and CSS.
  
  ## Why Learn JavaScript?
  
  **1. Universal Language**: Runs in all modern browsers and powers most of the web.
  
  **2. Beginner-Friendly**: Easy syntax and instant feedback via browsers.
  
  **3. Versatile**: Used for frontend, backend, mobile apps, and even game development.
  
  **4. High Demand**: One of the most popular and in-demand programming languages worldwide.
  
  ## Where is JavaScript Used?
  
  - **Web Development**: React, Angular, Vue
  - **Backend Development**: Node.js, Express
  - **Mobile Apps**: React Native
  - **Game Development**: Phaser, Three.js
  - **Automation & Tools**: Scripts, bots, and CLI tools
  
  Let’s start your JavaScript journey! 🚀`,
          },
          {
            id: 2,
            title: "Setting Up JavaScript",
            content: `# Setting Up JavaScript
  
  You don’t need to install anything special to start writing JavaScript — all you need is a browser!
  
  ## Option 1: Run in Browser Console
  
  1. Open **Google Chrome**
  2. Press **F12** or right-click → **Inspect**
  3. Go to the **Console** tab
  4. Type JavaScript code directly
  
  Example:
  \`\`\`js
  console.log("Hello, World!");
  \`\`\`
  
  ## Option 2: Run in an HTML File
  
  Create a file named \`index.html\`:
  
  \`\`\`html
  <!DOCTYPE html>
  <html>
    <body>
      <script>
        console.log("Hello from JavaScript!");
      </script>
    </body>
  </html>
  \`\`\`
  
  Open it in your browser — you’ll see the message in the console.
  
  ## Option 3: Using Node.js
  
  If you want to run JavaScript outside the browser:
  
  1. Go to **nodejs.org**
  2. Download the **LTS version**
  3. Install Node.js (includes npm)
  
  Verify installation:
  \`\`\`bash
  node -v
  \`\`\`
  
  You’re ready to run JavaScript anywhere!`,
          },
          {
            id: 3,
            title: "Your First JavaScript Program",
            content: `# Your First JavaScript Program
  
  Let’s write the classic “Hello, World!” example.
  
  ## Hello World
  
  \`\`\`js
  console.log("Hello, World!");
  \`\`\`
  
  **Output:**
  \`\`\`
  Hello, World!
  \`\`\`
  
  ## Understanding the Code
  
  **console.log()**: Displays output in the browser console or terminal.
  
  **"Hello, World!"**: A string (text) enclosed in quotes.
  
  ## Try It Yourself
  
  \`\`\`js
  console.log("Welcome to JavaScript!");
  console.log("JavaScript is awesome!");
  \`\`\`
  
  **Output:**
  \`\`\`
  Welcome to JavaScript!
  JavaScript is awesome!
  \`\`\`
  
  ## Multiple Logs
  
  \`\`\`js
  console.log("My name is JavaScript");
  console.log("I am 25 years old");
  \`\`\`
  
  You just wrote your first JavaScript program! 🎉`,
          },
        ],
      },
      {
        id: 2,
        title: "Variables and Data Types",
        lessons: [
          {
            id: 4,
            title: "Variables in JavaScript",
            content: `# Variables in JavaScript
  
  Variables store data values. You can think of them as boxes with labels.
  
  ## Creating Variables
  
  In JavaScript, you can declare variables using \`let\`, \`const\`, or \`var\`.
  
  \`\`\`js
  let name = "Alice";
  let age = 25;
  let height = 5.6;
  let isStudent = true;
  \`\`\`
  
  ✅ Use \`let\` for variables that can change  
  ✅ Use \`const\` for variables that should not change
  
  ## Naming Rules
  
  ✅ **Valid names:**
  - \`myVariable\`
  - \`_total\`
  - \`user2\`
  
  ❌ **Invalid names:**
  - \`2name\` (can’t start with a number)
  - \`my-variable\` (no hyphens)
  - \`my variable\` (no spaces)
  
  ## Using Variables
  
  \`\`\`js
  let name = "Bob";
  console.log("Hello, " + name);
  \`\`\`
  
  **Output:**
  \`\`\`
  Hello, Bob
  \`\`\`
  
  ## Updating Variables
  
  \`\`\`js
  let score = 10;
  console.log(score); // 10
  
  score = 20;
  console.log(score); // 20
  \`\`\`
  
  ## Multiple Declarations
  
  \`\`\`js
  let x = 5, y = 10, z = 15;
  console.log(x, y, z); // 5 10 15
  \`\`\`
  
  Variables make your programs flexible and dynamic!`,
          },
          {
            id: 5,
            title: "Numbers and Strings",
            content: `# Numbers and Strings
  
  JavaScript supports several basic data types. Let’s look at two important ones.
  
  ## Numbers
  
  ### Integers and Floats
  \`\`\`js
  let age = 25;
  let price = 19.99;
  \`\`\`
  
  ### Math Operations
  \`\`\`js
  let x = 10 + 5;   // 15
  let y = 10 - 5;   // 5
  let z = 10 * 5;   // 50
  let w = 10 / 5;   // 2
  let p = 10 ** 2;  // 100 (power)
  let m = 10 % 3;   // 1 (remainder)
  \`\`\`
  
  ## Strings
  
  Strings are text wrapped in quotes.
  
  \`\`\`js
  let name = "JavaScript";
  let message = 'Hello World';
  \`\`\`
  
  ### String Operations
  
  **Concatenation:**
  \`\`\`js
  let first = "Hello";
  let last = "World";
  let full = first + " " + last;
  console.log(full); // Hello World
  \`\`\`
  
  **Repetition (using repeat):**
  \`\`\`js
  let laugh = "ha".repeat(3);
  console.log(laugh); // hahaha
  \`\`\`
  
  **Length:**
  \`\`\`js
  let text = "JavaScript";
  console.log(text.length); // 10
  \`\`\`
  
  ### String Methods
  
  \`\`\`js
  let text = "hello world";
  console.log(text.toUpperCase());      // HELLO WORLD
  console.log(text.charAt(0));          // h
  console.log(text.replace("world", "JS")); // hello JS
  \`\`\`
  
  Strings and numbers are the building blocks of JavaScript!`,
          },
        ],
      },
      {
        id: 3,
        title: "Control Flow",
        lessons: [
          {
            id: 6,
            title: "If Statements",
            content: `# If Statements
  
  If statements let your code make decisions.
  
  ## Basic If
  
  \`\`\`js
  let age = 18;
  
  if (age >= 18) {
    console.log("You are an adult");
  }
  \`\`\`
  
  ## If-Else
  
  \`\`\`js
  let temperature = 15;
  
  if (temperature > 20) {
    console.log("It's warm outside");
  } else {
    console.log("It's cold outside");
  }
  \`\`\`
  
  ## If-Else If-Else
  
  \`\`\`js
  let score = 85;
  
  if (score >= 90) {
    console.log("Grade: A");
  } else if (score >= 80) {
    console.log("Grade: B");
  } else if (score >= 70) {
    console.log("Grade: C");
  } else {
    console.log("Grade: F");
  }
  \`\`\`
  
  ## Comparison Operators
  
  - \`===\` Equal to (strict)
  - \`!==\` Not equal to (strict)
  - \`>\`, \`<\`, \`>=\`, \`<=\`
  
  ## Logical Operators
  
  **and (&&)**:
  \`\`\`js
  let age = 20;
  let hasLicense = true;
  
  if (age >= 18 && hasLicense) {
    console.log("You can drive!");
  }
  \`\`\`
  
  **or (||)**:
  \`\`\`js
  let isWeekend = true;
  let isHoliday = false;
  
  if (isWeekend || isHoliday) {
    console.log("Time to relax!");
  }
  \`\`\`
  
  **not (!)**:
  \`\`\`js
  let isRaining = false;
  
  if (!isRaining) {
    console.log("Let's go outside!");
  }
  \`\`\`
  
  Now your programs can make decisions!`,
          },
          {
            id: 7,
            title: "Loops",
            content: `# Loops
  
  Loops let you repeat actions efficiently.
  
  ## For Loop
  
  \`\`\`js
  for (let i = 0; i < 5; i++) {
    console.log(i);
  }
  \`\`\`
  
  **Output:**
  \`\`\`
  0
  1
  2
  3
  4
  \`\`\`
  
  ### Loop Through an Array
  
  \`\`\`js
  let fruits = ["apple", "banana", "cherry"];
  
  for (let fruit of fruits) {
    console.log(fruit);
  }
  \`\`\`
  
  **Output:**
  \`\`\`
  apple
  banana
  cherry
  \`\`\`
  
  ### While Loop
  
  \`\`\`js
  let count = 0;
  
  while (count < 5) {
    console.log(count);
    count++;
  }
  \`\`\`
  
  **Output:**
  \`\`\`
  0
  1
  2
  3
  4
  \`\`\`
  
  ## Break and Continue
  
  **break:**
  \`\`\`js
  for (let i = 0; i < 10; i++) {
    if (i === 5) break;
    console.log(i);
  }
  \`\`\`
  
  **continue:**
  \`\`\`js
  for (let i = 0; i < 5; i++) {
    if (i === 2) continue;
    console.log(i);
  }
  \`\`\`
  
  ## Nested Loops
  
  \`\`\`js
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      console.log(\`i=\${i}, j=\${j}\`);
    }
  }
  \`\`\`
  
  Loops make repetitive tasks simple and efficient!`,
          },
        ],
      },
      {
        id: 4,
        title: "Functions",
        lessons: [
          {
            id: 8,
            title: "Defining Functions",
            content: `# Functions
  
  Functions are reusable pieces of code that perform specific actions.
  
  ## Why Use Functions?
  
  1. Reusability
  2. Organization
  3. Maintainability
  
  ## Basic Function
  
  \`\`\`js
  function greet() {
    console.log("Hello, World!");
  }
  
  greet();
  \`\`\`
  
  ## Parameters
  
  \`\`\`js
  function greet(name) {
    console.log(\`Hello, \${name}!\`);
  }
  
  greet("Alice");
  greet("Bob");
  \`\`\`
  
  ## Multiple Parameters
  
  \`\`\`js
  function add(a, b) {
    console.log(\`\${a} + \${b} = \${a + b}\`);
  }
  
  add(5, 3);
  add(10, 20);
  \`\`\`
  
  ## Return Values
  
  \`\`\`js
  function multiply(x, y) {
    return x * y;
  }
  
  let result = multiply(4, 5);
  console.log(result); // 20
  \`\`\`
  
  ## Default Parameters
  
  \`\`\`js
  function greet(name = "Guest") {
    console.log(\`Hello, \${name}!\`);
  }
  
  greet();       // Hello, Guest!
  greet("Alice"); // Hello, Alice!
  \`\`\`
  
  ## Example
  
  \`\`\`js
  function calculateArea(length, width) {
    return length * width;
  }
  
  let area = calculateArea(10, 15);
  console.log(\`Room area: \${area} sq ft\`);
  \`\`\`
  
  Functions make your JavaScript modular and powerful!`,
          },
        ],
      },
      {
        id: 5,
        title: "Arrays and Objects",
        lessons: [
          {
            id: 9,
            title: "Working with Arrays",
            content: `# Arrays
  
  Arrays store multiple values in a single variable.
  
  ## Creating Arrays
  
  \`\`\`js
  let fruits = ["apple", "banana", "cherry"];
  let numbers = [1, 2, 3, 4, 5];
  let mixed = ["hello", 42, true, 3.14];
  \`\`\`
  
  ## Accessing Elements
  
  \`\`\`js
  let fruits = ["apple", "banana", "cherry"];
  
  console.log(fruits[0]);  // apple
  console.log(fruits[1]);  // banana
  console.log(fruits[fruits.length - 1]);  // cherry
  \`\`\`
  
  ## Array Methods
  
  ### Adding Items
  
  \`\`\`js
  let fruits = ["apple", "banana"];
  
  fruits.push("cherry"); // Add to end
  console.log(fruits);
  
  fruits.splice(1, 0, "orange"); // Insert at position
  console.log(fruits);
  \`\`\`
  
  ### Removing Items
  
  \`\`\`js
  let fruits = ["apple", "banana", "cherry"];
  
  fruits.splice(1, 1); // Remove banana
  console.log(fruits);
  
  let last = fruits.pop(); // Remove last
  console.log(last); // cherry
  \`\`\`
  
  ## Array Operations
  
  \`\`\`js
  let numbers = [1, 2, 3, 4, 5];
  
  console.log(numbers.length); // 5
  console.log(Math.max(...numbers)); // 5
  console.log(Math.min(...numbers)); // 1
  console.log(numbers.reduce((a, b) => a + b)); // 15
  \`\`\`
  
  ## Array Slicing
  
  \`\`\`js
  let numbers = [0, 1, 2, 3, 4, 5];
  
  console.log(numbers.slice(1, 4)); // [1, 2, 3]
  console.log(numbers.slice(0, 3)); // [0, 1, 2]
  console.log(numbers.slice(3));    // [3, 4, 5]
  \`\`\`
  
  ## Array Mapping
  
  \`\`\`js
  let squares = [0, 1, 2, 3, 4].map(x => x ** 2);
  console.log(squares);
  
  let evens = Array.from({length: 10}, (_, i) => i).filter(x => x % 2 === 0);
  console.log(evens);
  \`\`\`
  
  Arrays are fundamental in JavaScript for managing collections!`,
          },
          {
            id: 10,
            title: "Objects",
            content: `# Objects
  
  Objects store data in key-value pairs.
  
  ## Creating Objects
  
  \`\`\`js
  let person = {
    name: "Alice",
    age: 25,
    city: "New York"
  };
  \`\`\`
  
  ## Accessing Values
  
  \`\`\`js
  console.log(person.name);  // Alice
  console.log(person["age"]); // 25
  \`\`\`
  
  ## Adding/Updating Values
  
  \`\`\`js
  person.email = "alice@example.com";
  person.age = 26;
  console.log(person);
  \`\`\`
  
  ## Removing Properties
  
  \`\`\`js
  delete person.city;
  console.log(person);
  \`\`\`
  
  ## Looping Through Objects
  
  \`\`\`js
  for (let key in person) {
    console.log(key + ": " + person[key]);
  }
  \`\`\`
  
  **Output:**
  \`\`\`
  name: Alice
  age: 26
  email: alice@example.com
  \`\`\`
  
  ## Nested Objects
  
  \`\`\`js
  let student = {
    name: "Bob",
    subjects: ["Math", "Science"],
    grades: {
      Math: 90,
      Science: 85
    }
  };
  
  console.log(\`\${student.name}'s Math grade: \${student.grades.Math}\`);
  \`\`\`
  
  Objects are the backbone of most JavaScript data structures!`,
          },
        ],
      },
    ],
  };
  