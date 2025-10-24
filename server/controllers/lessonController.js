import Lesson from "../models/Lesson.js";
import LessonProgress from "../models/LessonProgress.js";

// Get all lessons for a course
export const getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ courseId }).sort({
      sectionNumber: 1,
      unitNumber: 1,
    });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lessons", error: error.message });
  }
};

// Get a single lesson by ID
export const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findOne({ lessonId });
    
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lesson", error: error.message });
  }
};

// Get user's progress for a lesson
export const getLessonProgress = async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    
    let progress = await LessonProgress.findOne({ userId, lessonId });
    
    if (!progress) {
      // Create new progress if doesn't exist
      progress = new LessonProgress({
        userId,
        lessonId,
        courseId: req.query.courseId || "ml-certification-course",
      });
      await progress.save();
    }
    
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress", error: error.message });
  }
};

// Update lesson progress
export const updateLessonProgress = async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    const progressData = req.body;
    
    const progress = await LessonProgress.findOneAndUpdate(
      { userId, lessonId },
      { $set: progressData },
      { new: true, upsert: true }
    );
    
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error: error.message });
  }
};

// Submit lesson answers
export const submitLessonAnswers = async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    const { answers } = req.body;
    
    // Get the lesson
    const lesson = await Lesson.findOne({ lessonId });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    
    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    
    const answeredQuestions = answers.map((answer) => {
      const question = lesson.questions.find((q) => q.questionId === answer.questionId);
      if (!question) return null;
      
      totalPoints += question.points;
      let isCorrect = false;
      
      // Check answer based on question type
      if (question.questionType === "multiple-choice" || question.questionType === "true-false") {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        isCorrect = answer.answer === correctOption?.optionId;
      } else if (question.questionType === "code-completion" || question.questionType === "fill-in-blank") {
        isCorrect = answer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      }
      
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }
      
      return {
        questionId: answer.questionId,
        userAnswer: answer.answer,
        isCorrect,
        attemptedAt: new Date(),
      };
    }).filter(Boolean);
    
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= lesson.requiredScore;
    
    // Update progress
    const progress = await LessonProgress.findOneAndUpdate(
      { userId, lessonId },
      {
        $set: {
          isCompleted: passed,
          score,
          lastAttemptDate: new Date(),
          answeredQuestions,
          earnedXP: passed ? lesson.rewards.xp : 0,
          earnedGems: passed ? lesson.rewards.gems : 0,
        },
        $inc: { attempts: 1 },
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      passed,
      score,
      correctAnswers,
      totalQuestions: lesson.questions.length,
      earnedXP: passed ? lesson.rewards.xp : 0,
      earnedGems: passed ? lesson.rewards.gems : 0,
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting answers", error: error.message });
  }
};

// Get all progress for a user in a course
export const getUserCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progress = await LessonProgress.find({ userId, courseId }).sort({ createdAt: 1 });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress", error: error.message });
  }
};
