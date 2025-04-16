const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Career = require('./models/Career');
const { Assessment } = require('./models/Assessment');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample career data
const careers = [
  {
    title: 'Software Developer',
    description: 'Design, develop, and maintain software applications and systems.',
    skills: ['JavaScript', 'Python', 'Problem Solving', 'Teamwork', 'Communication'],
    education: 'Bachelor\'s degree in Computer Science or related field',
    salary: {
      min: 65000,
      max: 150000,
      currency: 'USD'
    },
    jobOutlook: {
      growth: 22,
      outlook: 'Much faster than average'
    },
    industries: ['Technology', 'Finance', 'Healthcare', 'Education']
  },
  {
    title: 'Data Scientist',
    description: 'Analyze and interpret complex data to help organizations make better decisions.',
    skills: ['Python', 'R', 'Statistics', 'Machine Learning', 'Data Visualization'],
    education: 'Master\'s degree in Statistics, Computer Science, or related field',
    salary: {
      min: 75000,
      max: 160000,
      currency: 'USD'
    },
    jobOutlook: {
      growth: 31,
      outlook: 'Much faster than average'
    },
    industries: ['Technology', 'Finance', 'Healthcare', 'Research']
  },
  {
    title: 'UX Designer',
    description: 'Design user-friendly interfaces and enhance user experience for digital products.',
    skills: ['UI Design', 'User Research', 'Wireframing', 'Prototyping', 'Communication'],
    education: 'Bachelor\'s degree in Design, HCI, or related field',
    salary: {
      min: 60000,
      max: 120000,
      currency: 'USD'
    },
    jobOutlook: {
      growth: 13,
      outlook: 'Faster than average'
    },
    industries: ['Technology', 'Marketing', 'E-commerce', 'Entertainment']
  }
];

// Sample assessments
const assessments = [
  {
    title: 'Career Interest Assessment',
    description: 'Discover which career fields align with your interests and preferences.',
    type: 'interest',
    questions: [
      {
        question: 'How much do you enjoy working with computers and technology?',
        options: [
          { text: 'Not at all', value: 1 },
          { text: 'Slightly', value: 2 },
          { text: 'Moderately', value: 3 },
          { text: 'Very much', value: 4 },
          { text: 'Extremely', value: 5 }
        ]
      },
      {
        question: 'How interested are you in analyzing data and identifying patterns?',
        options: [
          { text: 'Not at all', value: 1 },
          { text: 'Slightly', value: 2 },
          { text: 'Moderately', value: 3 },
          { text: 'Very much', value: 4 },
          { text: 'Extremely', value: 5 }
        ]
      },
      {
        question: 'Do you enjoy creative tasks like design and visual arts?',
        options: [
          { text: 'Not at all', value: 1 },
          { text: 'Slightly', value: 2 },
          { text: 'Moderately', value: 3 },
          { text: 'Very much', value: 4 },
          { text: 'Extremely', value: 5 }
        ]
      },
      {
        question: 'How much do you enjoy problem-solving and critical thinking?',
        options: [
          { text: 'Not at all', value: 1 },
          { text: 'Slightly', value: 2 },
          { text: 'Moderately', value: 3 },
          { text: 'Very much', value: 4 },
          { text: 'Extremely', value: 5 }
        ]
      },
      {
        question: 'How comfortable are you with working in a team environment?',
        options: [
          { text: 'Not at all', value: 1 },
          { text: 'Slightly', value: 2 },
          { text: 'Moderately', value: 3 },
          { text: 'Very much', value: 4 },
          { text: 'Extremely', value: 5 }
        ]
      }
    ]
  },
  {
    title: 'Skills Assessment',
    description: 'Evaluate your technical and soft skills to identify suitable career paths.',
    type: 'skills',
    questions: [
      {
        question: 'Rate your proficiency in programming languages (JavaScript, Python, etc.)',
        options: [
          { text: 'No experience', value: 1 },
          { text: 'Beginner', value: 2 },
          { text: 'Intermediate', value: 3 },
          { text: 'Advanced', value: 4 },
          { text: 'Expert', value: 5 }
        ]
      },
      {
        question: 'Rate your data analysis skills',
        options: [
            { text: 'No experience', value: 1 },
            { text: 'Beginner', value: 2 },
            { text: 'Intermediate', value: 3 },
            { text: 'Advanced', value: 4 },
            { text: 'Expert', value: 5 }
          ]
        },
        {
          question: 'Rate your design and visual thinking abilities',
          options: [
            { text: 'No experience', value: 1 },
            { text: 'Beginner', value: 2 },
            { text: 'Intermediate', value: 3 },
            { text: 'Advanced', value: 4 },
            { text: 'Expert', value: 5 }
          ]
        },
        {
          question: 'Rate your project management capabilities',
          options: [
            { text: 'No experience', value: 1 },
            { text: 'Beginner', value: 2 },
            { text: 'Intermediate', value: 3 },
            { text: 'Advanced', value: 4 },
            { text: 'Expert', value: 5 }
          ]
        },
        {
          question: 'Rate your communication and presentation skills',
          options: [
            { text: 'No experience', value: 1 },
            { text: 'Beginner', value: 2 },
            { text: 'Intermediate', value: 3 },
            { text: 'Advanced', value: 4 },
            { text: 'Expert', value: 5 }
          ]
        }
      ]
    }
  ];
  
  // Import data function
  const importData = async () => {
    try {
      // Clear existing data
      await Career.deleteMany();
      await Assessment.deleteMany();
      
      // Import new data
      const createdCareers = await Career.insertMany(careers);
      
      // Add related careers
      for (let i = 0; i < createdCareers.length; i++) {
        const relatedCareers = createdCareers.filter(c => c._id !== createdCareers[i]._id);
        createdCareers[i].relatedCareers = relatedCareers.map(rc => rc._id);
        await createdCareers[i].save();
      }
      
      await Assessment.insertMany(assessments);
      
      console.log('Data imported successfully');
      process.exit();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
  
  // Delete data function
  const destroyData = async () => {
    try {
      await Career.deleteMany();
      await Assessment.deleteMany();
      await User.deleteMany();
      
      console.log('Data destroyed successfully');
      process.exit();
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
  
  // Execute based on command line argument
  if (process.argv[2] === '-d') {
    destroyData();
  } else {
    importData();
  }