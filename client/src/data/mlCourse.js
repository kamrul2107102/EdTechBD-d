export const mlCourse = {
    title: "Machine Learning Basics",
    description:
      "An introductory course to Machine Learning. Understand core ML concepts, algorithms, and how to train models with Python.",
    chapters: [
      {
        id: 1,
        title: "Introduction to Machine Learning",
        lessons: [
          {
            id: "ml-1-1",
            title: "What is Machine Learning?",
            content: `
  ### 🤖 What is Machine Learning?
  
  Machine Learning (ML) is a subset of **Artificial Intelligence (AI)** that enables systems to **learn patterns from data** and make predictions without being explicitly programmed.
  
  \`\`\`python
  # Example: Simple linear regression concept
  y = mx + b
  \`\`\`
  
  Machine learning powers recommendations, speech recognition, and image classification.
            `,
          },
          {
            id: "ml-1-2",
            title: "Types of Machine Learning",
            content: `
  ### 🧠 Main Types of Machine Learning
  
  1. **Supervised Learning** – Learning from labeled data  
  2. **Unsupervised Learning** – Discovering hidden patterns in unlabeled data  
  3. **Reinforcement Learning** – Learning through trial and feedback
  
  \`\`\`python
  # Example of supervised learning using scikit-learn
  from sklearn.linear_model import LinearRegression
  
  model = LinearRegression()
  model.fit(X_train, y_train)
  \`\`\`
            `,
          },
        ],
      },
      {
        id: 2,
        title: "Supervised Learning Algorithms",
        lessons: [
          {
            id: "ml-2-1",
            title: "Linear Regression",
            content: `
  ### 📈 Linear Regression
  
  Predict continuous values using a line that best fits the data.
  
  \`\`\`python
  from sklearn.linear_model import LinearRegression
  model = LinearRegression()
  model.fit(X, y)
  predictions = model.predict(X_test)
  \`\`\`
            `,
          },
          {
            id: "ml-2-2",
            title: "Decision Trees",
            content: `
  ### 🌳 Decision Trees
  
  Decision Trees split data into smaller subsets to make predictions based on feature conditions.
  
  \`\`\`python
  from sklearn.tree import DecisionTreeClassifier
  model = DecisionTreeClassifier()
  model.fit(X_train, y_train)
  \`\`\`
            `,
          },
        ],
      },
      {
        id: 3,
        title: "Unsupervised Learning",
        lessons: [
          {
            id: "ml-3-1",
            title: "Clustering with K-Means",
            content: `
  ### 🌀 K-Means Clustering
  
  K-Means groups data into K clusters based on similarity.
  
  \`\`\`python
  from sklearn.cluster import KMeans
  model = KMeans(n_clusters=3)
  model.fit(X)
  \`\`\`
            `,
          },
          {
            id: "ml-3-2",
            title: "Dimensionality Reduction (PCA)",
            content: `
  ### 🔍 Principal Component Analysis (PCA)
  
  PCA reduces the number of features while retaining key information.
  
  \`\`\`python
  from sklearn.decomposition import PCA
  pca = PCA(n_components=2)
  X_reduced = pca.fit_transform(X)
  \`\`\`
            `,
          },
        ],
      },
    ],
  };
  