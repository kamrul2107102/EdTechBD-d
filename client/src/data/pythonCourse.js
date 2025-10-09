export const pythonCourse = {
  id: "python-basics",
  title: "Python for Beginners",
  description: "Learn Python programming from scratch",
  chapters: [
    {
      id: 1,
      title: "Introduction to Python",
      lessons: [
        {
          id: 1,
          title: "What is Python?",
          content: `# What is Python?

Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. It's designed to be easy to read and write, making it perfect for beginners.

## Why Learn Python?

**1. Easy to Learn**: Python has a simple syntax that reads like English, making it beginner-friendly.

**2. Versatile**: Used in web development, data science, AI, automation, and more.

**3. Popular**: One of the most in-demand programming languages in the job market.

**4. Large Community**: Extensive libraries and frameworks, plus a supportive community.

## Where is Python Used?

- **Web Development**: Django, Flask
- **Data Science**: Pandas, NumPy, Matplotlib
- **Machine Learning**: TensorFlow, Scikit-learn
- **Automation**: Scripting, testing
- **Game Development**: Pygame

Let's start your Python journey!`,
        },
        {
          id: 2,
          title: "Installing Python",
          content: `# Installing Python

To start programming in Python, you need to install it on your computer.

## Download Python

1. Visit **python.org**
2. Click on "Downloads"
3. Choose the latest version (Python 3.11+)
4. Download the installer for your operating system

## Installation Steps

### Windows:
1. Run the downloaded installer
2. ✅ **IMPORTANT**: Check "Add Python to PATH"
3. Click "Install Now"
4. Wait for installation to complete

### macOS:
1. Run the downloaded .pkg file
2. Follow the installation wizard
3. Python will be installed in /usr/local/bin

### Linux:
Most Linux distributions come with Python pre-installed. Check by running:
\`\`\`bash
python3 --version
\`\`\`

## Verify Installation

Open terminal/command prompt and type:
\`\`\`bash
python --version
\`\`\`

You should see something like: **Python 3.11.0**

Congratulations! Python is now installed on your system.`,
        },
        {
          id: 3,
          title: "Your First Python Program",
          content: `# Your First Python Program

Let's write your first Python program - the traditional "Hello, World!"

## Hello World

Open your terminal or Python IDE and type:

\`\`\`python
print("Hello, World!")
\`\`\`

**Output:**
\`\`\`
Hello, World!
\`\`\`

That's it! You've written your first Python program.

## Understanding the Code

**print()**: A built-in function that displays output to the screen.

**"Hello, World!"**: A string (text) enclosed in quotes.

## Try It Yourself

Modify your program:

\`\`\`python
print("Welcome to Python!")
print("Python is awesome!")
\`\`\`

**Output:**
\`\`\`
Welcome to Python!
Python is awesome!
\`\`\`

## Multiple Prints

You can print multiple things:

\`\`\`python
print("My name is", "Python")
print("I am", 30, "years old")
\`\`\`

**Output:**
\`\`\`
My name is Python
I am 30 years old
\`\`\`

Great job! You're now a Python programmer! 🐍`,
        },
      ],
    },
    {
      id: 2,
      title: "Variables and Data Types",
      lessons: [
        {
          id: 4,
          title: "Variables in Python",
          content: `# Variables in Python

Variables are containers for storing data values. Think of them as labeled boxes.

## Creating Variables

In Python, you don't need to declare the type. Just assign a value:

\`\`\`python
name = "Alice"
age = 25
height = 5.6
is_student = True
\`\`\`

## Variable Naming Rules

✅ **Valid names:**
- \`my_variable\`
- \`myVariable\`
- \`my_variable_2\`
- \`_my_variable\`

❌ **Invalid names:**
- \`2my_variable\` (can't start with number)
- \`my-variable\` (no hyphens)
- \`my variable\` (no spaces)

## Using Variables

\`\`\`python
name = "Bob"
print("Hello, " + name)
\`\`\`

**Output:**
\`\`\`
Hello, Bob
\`\`\`

## Changing Variables

Variables can be updated:

\`\`\`python
score = 10
print(score)  # 10

score = 20
print(score)  # 20
\`\`\`

## Multiple Assignment

\`\`\`python
x, y, z = 5, 10, 15
print(x, y, z)  # 5 10 15
\`\`\`

Variables make your programs dynamic and reusable!`,
        },
        {
          id: 5,
          title: "Numbers and Strings",
          content: `# Numbers and Strings

Python has several data types. Let's explore the most common ones.

## Numbers

### Integers (whole numbers)
\`\`\`python
age = 25
year = 2024
\`\`\`

### Floats (decimal numbers)
\`\`\`python
price = 19.99
temperature = 36.6
\`\`\`

### Basic Math Operations
\`\`\`python
x = 10 + 5   # 15 (addition)
y = 10 - 5   # 5 (subtraction)
z = 10 * 5   # 50 (multiplication)
w = 10 / 5   # 2.0 (division)
p = 10 ** 2  # 100 (power)
m = 10 % 3   # 1 (remainder)
\`\`\`

## Strings

Strings are text enclosed in quotes:

\`\`\`python
name = "Python"
message = 'Hello World'
\`\`\`

### String Operations

**Concatenation (joining):**
\`\`\`python
first = "Hello"
last = "World"
full = first + " " + last
print(full)  # Hello World
\`\`\`

**Repetition:**
\`\`\`python
laugh = "ha" * 3
print(laugh)  # hahaha
\`\`\`

**Length:**
\`\`\`python
text = "Python"
print(len(text))  # 6
\`\`\`

### String Methods

\`\`\`python
text = "hello world"
print(text.upper())      # HELLO WORLD
print(text.capitalize()) # Hello world
print(text.replace("world", "Python"))  # hello Python
\`\`\`

Strings and numbers are the building blocks of programming!`,
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

If statements let your program make decisions based on conditions.

## Basic If Statement

\`\`\`python
age = 18

if age >= 18:
    print("You are an adult")
\`\`\`

**Output:** \`You are an adult\`

## If-Else

\`\`\`python
temperature = 15

if temperature > 20:
    print("It's warm outside")
else:
    print("It's cold outside")
\`\`\`

**Output:** \`It's cold outside\`

## If-Elif-Else

\`\`\`python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")
\`\`\`

**Output:** \`Grade: B\`

## Comparison Operators

- \`==\` Equal to
- \`!=\` Not equal to
- \`>\` Greater than
- \`<\` Less than
- \`>=\` Greater than or equal to
- \`<=\` Less than or equal to

## Logical Operators

**and:** Both conditions must be True
\`\`\`python
age = 20
has_license = True

if age >= 18 and has_license:
    print("You can drive!")
\`\`\`

**or:** At least one condition must be True
\`\`\`python
is_weekend = True
is_holiday = False

if is_weekend or is_holiday:
    print("Time to relax!")
\`\`\`

**not:** Reverses the condition
\`\`\`python
is_raining = False

if not is_raining:
    print("Let's go outside!")
\`\`\`

Now your programs can think and make decisions!`,
        },
        {
          id: 7,
          title: "Loops",
          content: `# Loops

Loops allow you to repeat code multiple times without writing it again.

## For Loops

Repeat a specific number of times:

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

**Output:**
\`\`\`
0
1
2
3
4
\`\`\`

### Loop Through a List

\`\`\`python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
\`\`\`

**Output:**
\`\`\`
apple
banana
cherry
\`\`\`

### Loop Through a String

\`\`\`python
for letter in "Python":
    print(letter)
\`\`\`

**Output:**
\`\`\`
P
y
t
h
o
n
\`\`\`

## While Loops

Repeat while a condition is True:

\`\`\`python
count = 0

while count < 5:
    print(count)
    count += 1
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

**break:** Exit the loop early
\`\`\`python
for i in range(10):
    if i == 5:
        break
    print(i)
# Prints 0 to 4, then stops
\`\`\`

**continue:** Skip to next iteration
\`\`\`python
for i in range(5):
    if i == 2:
        continue
    print(i)
# Prints 0, 1, 3, 4 (skips 2)
\`\`\`

## Nested Loops

\`\`\`python
for i in range(3):
    for j in range(3):
        print(f"i={i}, j={j}")
\`\`\`

Loops help you avoid repetition and process collections of data!`,
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

Functions are reusable blocks of code that perform specific tasks.

## Why Use Functions?

1. **Reusability**: Write once, use many times
2. **Organization**: Keep code clean and structured
3. **Maintainability**: Easier to update and debug

## Basic Function

\`\`\`python
def greet():
    print("Hello, World!")

# Call the function
greet()
\`\`\`

**Output:** \`Hello, World!\`

## Functions with Parameters

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
greet("Bob")
\`\`\`

**Output:**
\`\`\`
Hello, Alice!
Hello, Bob!
\`\`\`

## Multiple Parameters

\`\`\`python
def add(a, b):
    result = a + b
    print(f"{a} + {b} = {result}")

add(5, 3)
add(10, 20)
\`\`\`

**Output:**
\`\`\`
5 + 3 = 8
10 + 20 = 30
\`\`\`

## Return Values

Functions can send back results:

\`\`\`python
def multiply(x, y):
    return x * y

result = multiply(4, 5)
print(result)  # 20
\`\`\`

## Default Parameters

\`\`\`python
def greet(name="Guest"):
    print(f"Hello, {name}!")

greet()           # Hello, Guest!
greet("Alice")    # Hello, Alice!
\`\`\`

## Practical Example

\`\`\`python
def calculate_area(length, width):
    area = length * width
    return area

room_area = calculate_area(10, 15)
print(f"Room area: {room_area} sq ft")
\`\`\`

**Output:** \`Room area: 150 sq ft\`

Functions make your code modular and professional!`,
        },
      ],
    },
    {
      id: 5,
      title: "Lists and Dictionaries",
      lessons: [
        {
          id: 9,
          title: "Working with Lists",
          content: `# Lists

Lists store multiple items in a single variable. Think of them as ordered collections.

## Creating Lists

\`\`\`python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]
\`\`\`

## Accessing Elements

Lists use **zero-based indexing**:

\`\`\`python
fruits = ["apple", "banana", "cherry"]

print(fruits[0])   # apple
print(fruits[1])   # banana
print(fruits[-1])  # cherry (last item)
\`\`\`

## List Methods

### Adding Items

\`\`\`python
fruits = ["apple", "banana"]

fruits.append("cherry")      # Add to end
print(fruits)  # ['apple', 'banana', 'cherry']

fruits.insert(1, "orange")   # Add at position
print(fruits)  # ['apple', 'orange', 'banana', 'cherry']
\`\`\`

### Removing Items

\`\`\`python
fruits = ["apple", "banana", "cherry"]

fruits.remove("banana")      # Remove by value
print(fruits)  # ['apple', 'cherry']

last = fruits.pop()          # Remove and return last
print(last)    # cherry
\`\`\`

## List Operations

\`\`\`python
numbers = [1, 2, 3, 4, 5]

print(len(numbers))      # 5 (length)
print(max(numbers))      # 5 (maximum)
print(min(numbers))      # 1 (minimum)
print(sum(numbers))      # 15 (sum)
\`\`\`

## Slicing Lists

\`\`\`python
numbers = [0, 1, 2, 3, 4, 5]

print(numbers[1:4])    # [1, 2, 3]
print(numbers[:3])     # [0, 1, 2]
print(numbers[3:])     # [3, 4, 5]
\`\`\`

## List Comprehension

Create lists in one line:

\`\`\`python
squares = [x**2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]

evens = [x for x in range(10) if x % 2 == 0]
print(evens)    # [0, 2, 4, 6, 8]
\`\`\`

Lists are one of the most useful data structures in Python!`,
        },
        {
          id: 10,
          title: "Dictionaries",
          content: `# Dictionaries

Dictionaries store data in key-value pairs. Like a real dictionary: word → definition.

## Creating Dictionaries

\`\`\`python
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}
\`\`\`

## Accessing Values

\`\`\`python
print(person["name"])   # Alice
print(person["age"])    # 25

# Safer way (returns None if key doesn't exist)
print(person.get("name"))   # Alice
print(person.get("email"))  # None
\`\`\`

## Adding/Updating Items

\`\`\`python
person = {"name": "Alice", "age": 25}

person["email"] = "alice@example.com"  # Add new
person["age"] = 26                      # Update existing

print(person)
# {'name': 'Alice', 'age': 26, 'email': 'alice@example.com'}
\`\`\`

## Removing Items

\`\`\`python
person = {"name": "Alice", "age": 25, "city": "NYC"}

del person["city"]      # Remove specific key
print(person)  # {'name': 'Alice', 'age': 25}

person.pop("age")       # Remove and return value
\`\`\`

## Dictionary Methods

\`\`\`python
person = {"name": "Alice", "age": 25}

print(person.keys())    # dict_keys(['name', 'age'])
print(person.values())  # dict_values(['Alice', 25])
print(person.items())   # dict_items([('name', 'Alice'), ('age', 25)])
\`\`\`

## Looping Through Dictionaries

\`\`\`python
person = {"name": "Alice", "age": 25, "city": "NYC"}

# Loop through keys
for key in person:
    print(key, ":", person[key])

# Loop through key-value pairs
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

**Output:**
\`\`\`
name: Alice
age: 25
city: NYC
\`\`\`

## Practical Example

\`\`\`python
student = {
    "name": "Bob",
    "subjects": ["Math", "Science"],
    "grades": {
        "Math": 90,
        "Science": 85
    }
}

print(f"{student['name']}'s Math grade: {student['grades']['Math']}")
# Bob's Math grade: 90
\`\`\`

Dictionaries are perfect for storing structured, labeled data!`,
        },
      ],
    },
  ],
};
