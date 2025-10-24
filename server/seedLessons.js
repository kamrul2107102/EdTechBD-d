import mongoose from "mongoose";
import Lesson from "./models/Lesson.js";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI;

const sampleLessons = [
  // Section 1 - Getting Started
  {
    lessonId: "ml-cert-lesson-01",
    courseId: "ml-certification-course",
    sectionNumber: 1,
    unitNumber: 0,
    lessonTitle: "Introduction to Machine Learning",
    lessonDescription: "Learn the fundamental concepts of Machine Learning",
    lessonType: "lesson",
    isFree: true,
    estimatedTime: 15,
    contentBlocks: [
      {
        blockId: "block-01",
        blockType: "text",
        content: "# Welcome to Machine Learning!\n\nMachine Learning is a subset of Artificial Intelligence that enables computers to learn from data without being explicitly programmed.",
      },
      {
        blockId: "block-02",
        blockType: "image",
        content: "Machine Learning Overview",
        imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800",
      },
      {
        blockId: "block-03",
        blockType: "text",
        content: "## Types of Machine Learning\n\nThere are three main types:\n\n1. **Supervised Learning** - Learning from labeled data\n2. **Unsupervised Learning** - Finding patterns in unlabeled data\n3. **Reinforcement Learning** - Learning through trial and error",
      },
      {
        blockId: "block-04",
        blockType: "tip",
        content: "💡 Think of supervised learning like learning with a teacher, and unsupervised learning like exploring on your own!",
      },
      {
        blockId: "block-05",
        blockType: "example",
        content: "**Real-world Example:**\n\nNetflix uses machine learning to recommend movies based on your viewing history. This is an example of supervised learning!",
      },
    ],
    questions: [
      {
        questionId: "q1",
        questionType: "multiple-choice",
        questionText: "What is Machine Learning?",
        options: [
          {
            optionId: "a",
            optionText: "Programming computers to learn from data",
            isCorrect: true,
          },
          {
            optionId: "b",
            optionText: "Building physical machines",
            isCorrect: false,
          },
          {
            optionId: "c",
            optionText: "Creating websites",
            isCorrect: false,
          },
          {
            optionId: "d",
            optionText: "Designing hardware",
            isCorrect: false,
          },
        ],
        explanation: "Machine Learning is about teaching computers to learn patterns from data without explicit programming.",
        points: 10,
      },
      {
        questionId: "q2",
        questionType: "multiple-choice",
        questionText: "Which type of ML uses labeled data?",
        options: [
          {
            optionId: "a",
            optionText: "Unsupervised Learning",
            isCorrect: false,
          },
          {
            optionId: "b",
            optionText: "Supervised Learning",
            isCorrect: true,
          },
          {
            optionId: "c",
            optionText: "Reinforcement Learning",
            isCorrect: false,
          },
          {
            optionId: "d",
            optionText: "None of the above",
            isCorrect: false,
          },
        ],
        explanation: "Supervised Learning uses labeled data where we know the correct answers.",
        points: 10,
      },
      {
        questionId: "q3",
        questionType: "true-false",
        questionText: "Netflix uses machine learning for movie recommendations.",
        options: [
          {
            optionId: "true",
            optionText: "True",
            isCorrect: true,
          },
          {
            optionId: "false",
            optionText: "False",
            isCorrect: false,
          },
        ],
        explanation: "True! Netflix uses sophisticated ML algorithms to analyze your viewing patterns and recommend content.",
        points: 10,
      },
    ],
    requiredScore: 70,
    rewards: {
      xp: 50,
      gems: 5,
      badges: ["first-lesson"],
    },
  },

  // Section 2 - Foundation Concepts
  {
    lessonId: "ml-cert-lesson-02",
    courseId: "ml-certification-course",
    sectionNumber: 2,
    unitNumber: 1,
    lessonTitle: "Data Preprocessing",
    lessonDescription: "Learn how to clean and prepare data for ML models",
    lessonType: "lesson",
    isFree: false,
    estimatedTime: 20,
    contentBlocks: [
      {
        blockId: "block-11",
        blockType: "text",
        content: "# Data Preprocessing\n\nData preprocessing is a crucial step in machine learning. Raw data is often messy and needs cleaning before we can use it.",
      },
      {
        blockId: "block-12",
        blockType: "text",
        content: "## Common Preprocessing Steps\n\n1. **Handling Missing Values** - Dealing with incomplete data\n2. **Data Normalization** - Scaling features to similar ranges\n3. **Encoding Categorical Data** - Converting text to numbers\n4. **Feature Selection** - Choosing relevant features",
      },
      {
        blockId: "block-13",
        blockType: "code",
        content: "import pandas as pd\nfrom sklearn.preprocessing import StandardScaler\n\n# Load data\ndata = pd.read_csv('data.csv')\n\n# Handle missing values\ndata = data.fillna(data.mean())\n\n# Normalize data\nscaler = StandardScaler()\ndata_scaled = scaler.fit_transform(data)",
        language: "python",
      },
      {
        blockId: "block-14",
        blockType: "tip",
        content: "💡 Always check for missing values and outliers before training your model!",
      },
    ],
    questions: [
      {
        questionId: "q4",
        questionType: "multiple-choice",
        questionText: "Why is data preprocessing important?",
        options: [
          {
            optionId: "a",
            optionText: "To clean and prepare data for ML models",
            isCorrect: true,
          },
          {
            optionId: "b",
            optionText: "To make data look prettier",
            isCorrect: false,
          },
          {
            optionId: "c",
            optionText: "It's not important",
            isCorrect: false,
          },
          {
            optionId: "d",
            optionText: "To slow down the process",
            isCorrect: false,
          },
        ],
        explanation: "Data preprocessing ensures our data is clean, consistent, and ready for training ML models.",
        points: 10,
      },
      {
        questionId: "q5",
        questionType: "code-completion",
        questionText: "Complete the code to handle missing values:",
        codeSnippet: "data = data.______(data.mean())",
        correctAnswer: "fillna",
        explanation: "The fillna() method is used to fill missing values with a specified value (in this case, the mean).",
        points: 15,
      },
    ],
    requiredScore: 80,
    rewards: {
      xp: 75,
      gems: 10,
      badges: [],
    },
  },

  // Section 2 - Unit Checkpoint
  {
    lessonId: "ml-cert-lesson-03",
    courseId: "ml-certification-course",
    sectionNumber: 2,
    unitNumber: 2,
    lessonTitle: "Unit Checkpoint",
    lessonDescription: "Test your knowledge of foundation concepts",
    lessonType: "test",
    isFree: false,
    estimatedTime: 10,
    contentBlocks: [
      {
        blockId: "block-21",
        blockType: "text",
        content: "# Unit Checkpoint\n\nTime to test what you've learned! Answer these questions to move forward.",
      },
    ],
    questions: [
      {
        questionId: "q6",
        questionType: "multiple-choice",
        questionText: "What does StandardScaler do?",
        options: [
          {
            optionId: "a",
            optionText: "Normalizes data to have mean=0 and std=1",
            isCorrect: true,
          },
          {
            optionId: "b",
            optionText: "Removes missing values",
            isCorrect: false,
          },
          {
            optionId: "c",
            optionText: "Sorts the data",
            isCorrect: false,
          },
          {
            optionId: "d",
            optionText: "None of the above",
            isCorrect: false,
          },
        ],
        explanation: "StandardScaler standardizes features by removing the mean and scaling to unit variance.",
        points: 20,
      },
      {
        questionId: "q7",
        questionType: "true-false",
        questionText: "You should always normalize your data before training.",
        options: [
          {
            optionId: "true",
            optionText: "True",
            isCorrect: true,
          },
          {
            optionId: "false",
            optionText: "False",
            isCorrect: false,
          },
        ],
        explanation: "True! Normalization helps many ML algorithms converge faster and perform better.",
        points: 10,
      },
    ],
    requiredScore: 80,
    rewards: {
      xp: 100,
      gems: 15,
      badges: ["checkpoint-master"],
    },
  },

  // Section 3 - Supervised Learning
  {
    lessonId: "ml-cert-lesson-04",
    courseId: "ml-certification-course",
    sectionNumber: 3,
    unitNumber: 3,
    lessonTitle: "Linear Regression",
    lessonDescription: "Learn to predict continuous values",
    lessonType: "lesson",
    isFree: false,
    estimatedTime: 25,
    contentBlocks: [
      {
        blockId: "block-31",
        blockType: "text",
        content: "# Linear Regression\n\nLinear Regression is one of the simplest and most widely used ML algorithms. It's used to predict continuous numerical values.",
      },
      {
        blockId: "block-32",
        blockType: "text",
        content: "## The Formula\n\nLinear Regression finds a line that best fits the data:\n\n**y = mx + b**\n\nWhere:\n- y = predicted value\n- m = slope\n- x = input feature\n- b = y-intercept",
      },
      {
        blockId: "block-33",
        blockType: "code",
        content: "from sklearn.linear_model import LinearRegression\nimport numpy as np\n\n# Training data\nX = np.array([[1], [2], [3], [4], [5]])\ny = np.array([2, 4, 6, 8, 10])\n\n# Create and train model\nmodel = LinearRegression()\nmodel.fit(X, y)\n\n# Make prediction\nprediction = model.predict([[6]])\nprint(f'Prediction: {prediction[0]}')",
        language: "python",
      },
      {
        blockId: "block-34",
        blockType: "example",
        content: "**Real-world Example:**\n\nPredicting house prices based on square footage is a classic linear regression problem!",
      },
    ],
    questions: [
      {
        questionId: "q8",
        questionType: "multiple-choice",
        questionText: "What does Linear Regression predict?",
        options: [
          {
            optionId: "a",
            optionText: "Categories",
            isCorrect: false,
          },
          {
            optionId: "b",
            optionText: "Continuous numerical values",
            isCorrect: true,
          },
          {
            optionId: "c",
            optionText: "Images",
            isCorrect: false,
          },
          {
            optionId: "d",
            optionText: "Text",
            isCorrect: false,
          },
        ],
        explanation: "Linear Regression is used for predicting continuous numerical values like prices, temperatures, etc.",
        points: 10,
      },
      {
        questionId: "q9",
        questionType: "fill-in-blank",
        questionText: "In the formula y = mx + b, 'm' represents the ______.",
        correctAnswer: "slope",
        explanation: "In linear regression, 'm' represents the slope of the line.",
        points: 15,
      },
    ],
    requiredScore: 75,
    rewards: {
      xp: 80,
      gems: 12,
      badges: ["regression-rookie"],
    },
  },

  // Unit 4 is "Treasure Chest" - a reward type, no lesson needed

  // Section 3 - Classification
  {
    lessonId: "ml-cert-lesson-05",
    courseId: "ml-certification-course",
    sectionNumber: 3,
    unitNumber: 5,
    lessonTitle: "Classification",
    lessonDescription: "Learn to categorize data into classes",
    lessonType: "lesson",
    isFree: false,
    estimatedTime: 20,
    contentBlocks: [
      {
        blockId: "block-41",
        blockType: "text",
        content: "# Classification\n\nClassification is a type of supervised learning where we predict which category or class an input belongs to.",
      },
      {
        blockId: "block-42",
        blockType: "text",
        content: "## Common Classification Algorithms\n\n1. **Logistic Regression** - Binary classification\n2. **Decision Trees** - Tree-based decisions\n3. **Random Forest** - Ensemble of decision trees\n4. **Support Vector Machines (SVM)** - Finding optimal boundaries",
      },
      {
        blockId: "block-43",
        blockType: "code",
        content: "from sklearn.tree import DecisionTreeClassifier\nimport numpy as np\n\n# Training data\nX = np.array([[1, 2], [2, 3], [3, 4], [4, 5]])\ny = np.array([0, 0, 1, 1])\n\n# Create and train classifier\nclf = DecisionTreeClassifier()\nclf.fit(X, y)\n\n# Make prediction\nprediction = clf.predict([[2.5, 3.5]])\nprint(f'Predicted class: {prediction[0]}')",
        language: "python",
      },
      {
        blockId: "block-44",
        blockType: "example",
        content: "**Real-world Example:**\n\nEmail spam detection is a classification problem: emails are classified as either 'spam' or 'not spam'.",
      },
    ],
    questions: [
      {
        questionId: "q10",
        questionType: "multiple-choice",
        questionText: "What does classification predict?",
        options: [
          {
            optionId: "a",
            optionText: "Continuous values",
            isCorrect: false,
          },
          {
            optionId: "b",
            optionText: "Categories or classes",
            isCorrect: true,
          },
          {
            optionId: "c",
            optionText: "Probabilities",
            isCorrect: false,
          },
          {
            optionId: "d",
            optionText: "Nothing",
            isCorrect: false,
          },
        ],
        explanation: "Classification predicts which category or class an input belongs to (e.g., spam/not spam, cat/dog).",
        points: 10,
      },
      {
        questionId: "q11",
        questionType: "true-false",
        questionText: "Email spam detection is an example of classification.",
        options: [
          {
            optionId: "true",
            optionText: "True",
            isCorrect: true,
          },
          {
            optionId: "false",
            optionText: "False",
            isCorrect: false,
          },
        ],
        explanation: "True! Spam detection classifies emails into two categories: spam or not spam.",
        points: 10,
      },
    ],
    requiredScore: 75,
    rewards: {
      xp: 75,
      gems: 10,
      badges: ["classifier"],
    },
  },

  // Section 4 - Advanced Topics
  {
    lessonId: "ml-cert-lesson-06",
    courseId: "ml-certification-course",
    sectionNumber: 4,
    unitNumber: 6,
    lessonTitle: "Neural Networks",
    lessonDescription: "Introduction to deep learning fundamentals",
    lessonType: "lesson",
    isFree: false,
    estimatedTime: 30,
    contentBlocks: [
      {
        blockId: "block-51",
        blockType: "text",
        content: "# Neural Networks\n\nNeural Networks are computing systems inspired by biological neural networks in the human brain. They're the foundation of deep learning!",
      },
      {
        blockId: "block-52",
        blockType: "text",
        content: "## Key Components\n\n1. **Input Layer** - Receives the data\n2. **Hidden Layers** - Process the information\n3. **Output Layer** - Produces predictions\n4. **Weights & Biases** - Learnable parameters\n5. **Activation Functions** - Add non-linearity",
      },
      {
        blockId: "block-53",
        blockType: "code",
        content: "from sklearn.neural_network import MLPClassifier\nimport numpy as np\n\n# Training data\nX = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])\ny = np.array([0, 1, 1, 0])  # XOR problem\n\n# Create neural network\nnn = MLPClassifier(hidden_layer_sizes=(4,), max_iter=10000)\nnn.fit(X, y)\n\n# Make predictions\nfor i in range(len(X)):\n    prediction = nn.predict([X[i]])\n    print(f'Input: {X[i]}, Predicted: {prediction[0]}')",
        language: "python",
      },
      {
        blockId: "block-54",
        blockType: "tip",
        content: "💡 Neural networks can learn complex patterns that traditional algorithms struggle with!",
      },
    ],
    questions: [
      {
        questionId: "q12",
        questionType: "multiple-choice",
        questionText: "What are neural networks inspired by?",
        options: [
          {
            optionId: "a",
            optionText: "Computer circuits",
            isCorrect: false,
          },
          {
            optionId: "b",
            optionText: "Biological neural networks in the brain",
            isCorrect: true,
          },
          {
            optionId: "c",
            optionText: "Mathematical equations",
            isCorrect: false,
          },
          {
            optionId: "d",
            optionText: "Internet protocols",
            isCorrect: false,
          },
        ],
        explanation: "Neural networks are inspired by the biological neural networks that make up animal brains.",
        points: 10,
      },
      {
        questionId: "q13",
        questionType: "multiple-choice",
        questionText: "Which layer receives the input data?",
        options: [
          {
            optionId: "a",
            optionText: "Hidden layer",
            isCorrect: false,
          },
          {
            optionId: "b",
            optionText: "Output layer",
            isCorrect: false,
          },
          {
            optionId: "c",
            optionText: "Input layer",
            isCorrect: true,
          },
          {
            optionId: "d",
            optionText: "Activation layer",
            isCorrect: false,
          },
        ],
        explanation: "The input layer is the first layer that receives the raw data.",
        points: 10,
      },
    ],
    requiredScore: 75,
    rewards: {
      xp: 100,
      gems: 15,
      badges: ["neural-novice"],
    },
  },

  // Unit 7 is "Unit Review" - practice type, no lesson needed

  // Section 4 - Final Assessment
  {
    lessonId: "ml-cert-lesson-08",
    courseId: "ml-certification-course",
    sectionNumber: 4,
    unitNumber: 8,
    lessonTitle: "Final Assessment",
    lessonDescription: "Complete the course and earn your certificate",
    lessonType: "test",
    isFree: false,
    estimatedTime: 15,
    contentBlocks: [
      {
        blockId: "block-61",
        blockType: "text",
        content: "# Final Assessment\n\nCongratulations on making it this far! This is your final test to demonstrate everything you've learned.",
      },
    ],
    questions: [
      {
        questionId: "q14",
        questionType: "multiple-choice",
        questionText: "Which algorithm is best for predicting house prices?",
        options: [
          {
            optionId: "a",
            optionText: "Classification",
            isCorrect: false,
          },
          {
            optionId: "b",
            optionText: "Linear Regression",
            isCorrect: true,
          },
          {
            optionId: "c",
            optionText: "Clustering",
            isCorrect: false,
          },
          {
            optionId: "d",
            optionText: "Association Rules",
            isCorrect: false,
          },
        ],
        explanation: "Linear Regression is used for predicting continuous values like prices.",
        points: 20,
      },
      {
        questionId: "q15",
        questionType: "multiple-choice",
        questionText: "What is the first step in any ML project?",
        options: [
          {
            optionId: "a",
            optionText: "Training the model",
            isCorrect: false,
          },
          {
            optionId: "b",
            optionText: "Data preprocessing",
            isCorrect: true,
          },
          {
            optionId: "c",
            optionText: "Model deployment",
            isCorrect: false,
          },
          {
            optionId: "d",
            optionText: "Testing",
            isCorrect: false,
          },
        ],
        explanation: "Data preprocessing is crucial before training any model.",
        points: 20,
      },
      {
        questionId: "q16",
        questionType: "true-false",
        questionText: "Neural networks can only solve simple problems.",
        options: [
          {
            optionId: "true",
            optionText: "True",
            isCorrect: false,
          },
          {
            optionId: "false",
            optionText: "False",
            isCorrect: true,
          },
        ],
        explanation: "False! Neural networks excel at solving complex problems that traditional algorithms struggle with.",
        points: 10,
      },
    ],
    requiredScore: 85,
    rewards: {
      xp: 200,
      gems: 25,
      badges: ["ml-certified", "course-complete"],
    },
  },
];

async function seedLessons() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing lessons for this course
    await Lesson.deleteMany({ courseId: "ml-certification-course" });
    console.log("🗑️  Cleared existing lessons");

    // Insert sample lessons
    const result = await Lesson.insertMany(sampleLessons);
    console.log(`✅ Inserted ${result.length} lessons successfully`);

    console.log("\n📚 Sample lessons created:");
    result.forEach((lesson) => {
      console.log(`   - ${lesson.lessonTitle} (${lesson.isFree ? "FREE" : "PREMIUM"})`);
    });

    mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
    process.exit(1);
  }
}

seedLessons();
