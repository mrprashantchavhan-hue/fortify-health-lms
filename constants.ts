import { Module } from './types';

export const DEFAULT_SUPER_ADMIN = {
  username: 'prashant.chavhan@fortifyhealth.global',
  password: 'Pashya@3335'
};

export const INITIAL_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Module 1: Introduction',
    description: 'Ensuring quality in Wheat Flour Fortification. A simple overview of the training, why fortification matters, the regulatory context, and the role of quality officers.',
    quizLink: '#quiz-m1',
    topics: [
      {
        id: 't1-1',
        title: 'Introduction to Quality Training Modules',
        summary: 'Walkthrough of the overall training module',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't1-2',
        title: 'FSSAI guidelines for premix and fortified atta',
        summary: 'Clear guidance on permitted micronutrients, regulatory norms, and labelling standards for fortified wheat flour.',
        links: [
          { label: 'View Part 1', url: '#' },
          { label: 'View Part 2', url: '#' }
        ]
      },
      {
        id: 't1-3',
        title: 'Roles and responsibilities of the Quality Officer (QO)',
        summary: 'Covers the complete QO lifecycle—from onboarding to routine monitoring and mill engagement.',
        links: [{ label: 'Watch Video', url: '#' }]
      }
    ],
    questions: [
      {
        id: 'q1-1',
        question: 'What is the primary role of a Quality Officer?',
        options: ['To sell flour', 'To monitor fortification compliance', 'To repair machinery', 'To drive the delivery truck'],
        correctAnswer: 1
      },
      {
        id: 'q1-2',
        question: 'Which regulatory body sets the standards for fortified atta?',
        options: ['WHO', 'FSSAI', 'FDA', 'UNICEF'],
        correctAnswer: 1
      },
      {
        id: 'q1-3',
        question: 'Fortified atta must contain which of the following?',
        options: ['Iron, Folic Acid, Vitamin B12', 'Sugar and Salt', 'Calcium only', 'None of the above'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'm2',
    title: 'Module 2: Quality System Tools',
    description: 'Practical guides to the tools and digital systems QOs use for monitoring and documentation.',
    quizLink: '#quiz-m2',
    topics: [
      {
        id: 't2-1',
        title: 'Uploading production and premix dilution data to Survey CTO',
        summary: 'Demonstrates how to upload production and premix dilution data with accuracy and avoid common errors.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't2-2',
        title: 'Fortification Process Observation Checklist (FPOC)',
        summary: 'Detailed walkthrough of the FPOC and how to use it during a mill visit.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't2-3',
        title: 'Sample tracking sheet: calibration and composite samples',
        summary: 'Shows how to maintain calibration and composite sample records for traceability.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't2-4',
        title: 'Issue log walkthrough',
        summary: 'Covers how to log issues, classify them, and follow up until resolution.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't2-5',
        title: 'QO Weekly Checklist',
        summary: 'A short guide on using the weekly checklist to maintain routine QA discipline.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't2-6',
        title: 'Navigating internal dashboards',
        summary: 'Demonstrates how to interpret daily and weekly mill performance data through dashboards.',
        links: [
          { label: 'Part 1', url: '#' },
          { label: 'Part 2', url: '#' }
        ]
      }
    ],
    questions: [
      {
        id: 'q2-1',
        question: 'Where should production data be uploaded?',
        options: ['WhatsApp', 'Excel Sheet', 'Survey CTO', 'Email'],
        correctAnswer: 2
      },
      {
        id: 'q2-2',
        question: 'What does FPOC stand for?',
        options: ['Flour Production Official Count', 'Fortification Process Observation Checklist', 'Final Product Quality Check', 'Factory Process Optimization Chart'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'm3',
    title: 'Module 3: Quality Testing',
    description: 'Practical demonstrations of testing protocols and quick interpretation tools for on-site use.',
    quizLink: '#quiz-m3',
    topics: [
      {
        id: 't3-1',
        title: 'How to conduct IST procedure',
        summary: 'Walks through the IST process step-by-step to ensure consistent iron detection at mills.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't3-2',
        title: 'AI Iron Spot Test (AI interface for QOs)',
        summary: 'Shows how to upload IST images and interpret AI-generated compliance decisions.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't3-3',
        title: 'Retest request: process and criteria',
        summary: 'Explains when retests are required and how to document and submit them correctly.',
        links: [{ label: 'Watch Video', url: '#' }]
      }
    ],
    questions: [
      {
        id: 'q3-1',
        question: 'What is the purpose of the Iron Spot Test (IST)?',
        options: ['To measure moisture', 'To detect presence of Iron', 'To check packaging quality', 'To measure weight'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'm4',
    title: 'Module 4: Troubleshooting tools',
    description: 'An overview of essential troubleshooting tools—from iCheck reviews to complaint handling.',
    quizLink: '#quiz-m4',
    topics: [
      {
        id: 't4-1',
        title: 'iCheck results and troubleshooting logs',
        summary: 'Walkthrough of the iCheck result log and related troubleshooting entries.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't4-2',
        title: 'Complaint troubleshooting workflow',
        summary: 'Steps from receiving a complaint to resolution, including documentation and escalation.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't4-3',
        title: 'Non-compliance at mills',
        summary: 'Common non-compliance cases and recommended corrective actions.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't4-4',
        title: 'QSMV overview',
        summary: 'Introduction to QSMV processes and required documentation.',
        links: [{ label: 'Watch Video', url: '#' }]
      }
    ],
    questions: [
      {
        id: 'q4-1',
        question: 'When should a complaint be logged?',
        options: ['Only if it is serious', 'Immediately upon receipt', 'At the end of the year', 'Never'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'm5',
    title: 'Module 5: Microfeeder & premix',
    description: 'Covers premix dilution, microfeeder adjustments, and good storage & hygiene for premix.',
    quizLink: '#quiz-m5',
    topics: [
      {
        id: 't5-1',
        title: 'Premix dilution process',
        summary: 'Structured view of dilution steps and critical checks to ensure correct ratios.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't5-2',
        title: 'Premix output factors & adjustment',
        summary: 'Explains key factors affecting premix output and how to use calibration charts.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't5-3',
        title: 'Premix handling and storage',
        summary: 'Covers safe storage, FIFO/FEFO, and hygiene practices.',
        links: [{ label: 'View Here', url: '#' }]
      }
    ],
    questions: [
      {
        id: 'q5-1',
        question: 'What storage method is recommended for premix?',
        options: ['LIFO (Last In First Out)', 'FIFO (First In First Out)', 'Random', 'Sunlight exposure'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'm6',
    title: 'Module 6: Sampling Protocol',
    description: 'Correct sampling methodology and sample handling to ensure representative and reliable test results.',
    quizLink: '#quiz-m6',
    topics: [
      {
        id: 't6-1',
        title: 'Manual and composite sample methodology',
        summary: 'How to prepare and collect manual and composite samples correctly.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't6-2',
        title: 'Sample labelling and courier handling',
        summary: 'Guidelines for correct labelling, documentation, and safe courier practices.',
        links: [{ label: 'Watch Video', url: '#' }]
      }
    ],
    questions: [
      {
        id: 'q6-1',
        question: 'Why is sample labelling important?',
        options: ['It looks professional', 'To ensure traceability and accurate results', 'To use extra stickers', 'It is not important'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'm7',
    title: 'Module 7: Mill staff role',
    description: 'Role clarity for mill staff on daily sampling, logs, and record-keeping duties.',
    quizLink: '#quiz-m7',
    topics: [
      {
        id: 't7-1',
        title: 'Daily sample collection, labeling and storage',
        summary: 'Steps to follow to collect, label, and store samples in mills.',
        links: [{ label: 'Watch Video', url: '#' }]
      },
      {
        id: 't7-2',
        title: 'Daily production log and premix dilution log',
        summary: 'Explanation and demo of the two log sheets that mill staff must maintain.',
        links: [{ label: 'Watch Video', url: '#' }]
      }
    ],
    questions: [
      {
        id: 'q7-1',
        question: 'Who is responsible for daily sample collection?',
        options: ['The security guard', 'The Mill Staff', 'The CEO', 'The Truck Driver'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'm8',
    title: 'Module 8: External Vendor processes',
    description: 'Processes for ordering IST, procurement requirements and vendor interactions.',
    quizLink: '#quiz-m8',
    topics: [
      {
        id: 't8-1',
        title: 'Process for IST kits procurement',
        summary: 'Steps for ordering monthly IST kits requirements and guidelines for interacting with IST kit vendors.',
        links: [{ label: 'Watch Video', url: '#' }]
      }
    ],
    questions: [
      {
        id: 'q8-1',
        question: 'When should you order new IST kits?',
        options: ['When you run out completely', 'Before the current stock expires/runs out', 'Never', 'Every day'],
        correctAnswer: 1
      }
    ]
  }
];