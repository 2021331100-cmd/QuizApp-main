# Quiz App - New Features

## Quiz Creation & Management System

### Features Added:

#### 1. **Create Custom Quizzes**
- Create quizzes for any technology (HTML, CSS, JS, React, Node, MongoDB, Java, Python, C++, Bootstrap, or Other)
- Set difficulty levels: Basic, Intermediate, Advanced
- Add multiple-choice questions with 2 or more options
- Include explanations for answers
- Full validation to ensure data integrity

#### 2. **Browse & Filter Quizzes**
- View all available quizzes
- Filter by technology and difficulty level
- See quiz details (question count, estimated time, difficulty)

#### 3. **Take Quizzes**
- Interactive quiz-taking interface
- Progress tracking
- Navigate between questions
- Submit when ready

#### 4. **View Results**
- Detailed score breakdown
- See correct and incorrect answers
- Read explanations for each question
- Option to retake quizzes

### API Endpoints:

#### Quiz Management
- `POST /api/quizzes` - Create a new quiz (requires authentication)
- `GET /api/quizzes` - Get all quizzes (with optional filters)
- `GET /api/quizzes/:id` - Get a specific quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers and get results
- `PUT /api/quizzes/:id` - Update a quiz (requires authentication)
- `DELETE /api/quizzes/:id` - Delete a quiz (requires authentication)

### Frontend Routes:

- `/quizzes` - Browse all quizzes
- `/quiz/:id` - Take a specific quiz
- `/create-quiz` - Create a new quiz (protected, requires login)

### How to Create a Quiz:

1. **Login** to your account (required for creating quizzes)
2. Click **"Create Quiz"** in the navigation bar or from the home page
3. Fill in quiz information:
   - Title
   - Technology/Subject
   - Difficulty Level
4. Add questions:
   - Question text
   - At least 2 options
   - Correct answer (must match one option exactly)
   - Optional explanation
5. Click **"Add Question to Quiz"** to add each question
6. Review your questions in the list below
7. Click **"Save Quiz"** when done

### How to Take a Quiz:

1. Go to **"Quizzes"** page
2. Filter by technology or level (optional)
3. Click **"Start Quiz"** on any quiz card
4. Answer each question
5. Use **"Next"** to move forward or **"Previous"** to go back
6. Click **"Submit"** on the last question
7. View your detailed results with score, correct/wrong answers, and explanations

### Technologies Used:

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- RESTful API design

**Frontend:**
- React with React Router
- Axios for API calls
- Lucide React icons
- Tailwind CSS for styling
- React Toastify for notifications

### Database Models:

**Quiz Model:**
```javascript
{
  title: String,
  technology: String (enum),
  level: String (enum: basic, intermediate, advanced),
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  createdBy: ObjectId (ref: User),
  isActive: Boolean,
  timestamps: true
}
```

### Example Quiz Creation Request:

```json
{
  "title": "JavaScript Fundamentals",
  "technology": "js",
  "level": "basic",
  "questions": [
    {
      "question": "What is the correct way to declare a variable in JavaScript?",
      "options": ["var x = 5", "variable x = 5", "x := 5", "dim x = 5"],
      "correctAnswer": "var x = 5",
      "explanation": "In JavaScript, variables can be declared using var, let, or const keywords."
    }
  ]
}
```

### Security:

- Quiz creation, updates, and deletion require authentication
- JWT tokens are validated for protected routes
- User information is attached to created quizzes
- Quiz answers are not exposed until submission

### Future Enhancements:

- Quiz categories and tags
- Quiz sharing and collaboration
- Time limits for quizzes
- Leaderboards
- Quiz analytics and statistics
- Image support in questions
- Multiple question types (true/false, fill-in-the-blank)
