const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Application = require('../models/Application');

// Load env vars if running directly via CLI
dotenv.config();

const sampleApplications = [
  {
    company: 'Stripe',
    jobTitle: 'Senior Full Stack Engineer',
    location: 'San Francisco, CA (Remote)',
    applicationDate: new Date('2026-10-15'),
    status: 'Interview',
    jobType: 'Full-time',
    jobPostingUrl: 'https://stripe.com/jobs/senior-full-stack',
    notes: 'Completed technical screen with hiring manager. System design round scheduled for next Tuesday.',
  },
  {
    company: 'Vercel',
    jobTitle: 'Frontend Platform Developer',
    location: 'Remote, US',
    applicationDate: new Date('2026-10-18'),
    status: 'Offer',
    jobType: 'Full-time',
    jobPostingUrl: 'https://vercel.com/careers/frontend-platform',
    notes: 'Received competitive offer package! Reviewing benefits and equity vest schedule by Friday.',
  },
  {
    company: 'Google',
    jobTitle: 'Software Engineer III - Cloud',
    location: 'Mountain View, CA',
    applicationDate: new Date('2026-10-02'),
    status: 'Reviewing',
    jobType: 'Full-time',
    jobPostingUrl: 'https://careers.google.com/jobs/results/12345',
    notes: 'Referred by alumni colleague. Recruiter confirmed profile is currently under committee review.',
  },
  {
    company: 'Spotify',
    jobTitle: 'Backend API Developer',
    location: 'New York, NY (Hybrid)',
    applicationDate: new Date('2026-10-22'),
    status: 'Applied',
    jobType: 'Full-time',
    jobPostingUrl: 'https://spotifyjobs.com/jobs/backend-engineer',
    notes: 'Applied via company careers portal. Tailored resume highlighting microservices and Node.js expertise.',
  },
  {
    company: 'Figma',
    jobTitle: 'Design Systems Engineer',
    location: 'San Francisco, CA',
    applicationDate: new Date('2026-10-08'),
    status: 'Interview',
    jobType: 'Full-time',
    jobPostingUrl: 'https://figma.com/careers/design-systems-engineer',
    notes: 'Completed take-home component library exercise. Met with Lead UI Designer; final panel next week.',
  },
  {
    company: 'Datadog',
    jobTitle: 'Site Reliability Engineering Intern',
    location: 'Boston, MA (Hybrid)',
    applicationDate: new Date('2026-09-25'),
    status: 'Rejected',
    jobType: 'Internship',
    jobPostingUrl: 'https://datadoghq.com/careers/detail/?id=sre-intern',
    notes: 'Standard polite rejection email received after initial resume screen. Re-apply for full-time cycle next season.',
  },
  {
    company: 'Linear',
    jobTitle: 'Product Engineer - Web',
    location: 'Remote, Global',
    applicationDate: new Date('2026-10-26'),
    status: 'Applied',
    jobType: 'Full-time',
    jobPostingUrl: 'https://linear.app/careers/product-engineer',
    notes: 'Submitted application with loom demo link showcasing custom React state management project.',
  },
  {
    company: 'GitHub',
    jobTitle: 'DevOps & CI/CD Contractor',
    location: 'Remote',
    applicationDate: new Date('2026-10-10'),
    status: 'Reviewing',
    jobType: 'Contract',
    jobPostingUrl: 'https://github.com/careers/devops-contractor',
    notes: '6-month rolling contract supporting GitHub Actions automated runner infrastructure.',
  },
];

/**
 * Seed the database with sample applications
 */
const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is missing.');
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }

    console.log('Clearing existing applications...');
    await Application.deleteMany({});

    console.log(`Inserting ${sampleApplications.length} sample applications...`);
    const inserted = await Application.insertMany(sampleApplications);

    console.log(`✅ Successfully seeded ${inserted.length} applications into MongoDB Atlas!`);

    if (require.main === module) {
      await mongoose.disconnect();
      process.exit(0);
    }
    return inserted;
  } catch (error) {
    console.error('❌ Failed to seed database:', error.message);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = {
  sampleApplications,
  seedDatabase,
};
