import { PrismaClient, ResumeSectionType, StoryCategory, PracticeRoomStatus, ParticipantRole, SessionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const pmResumeText = `Avery Dlamini
Senior Product Manager

Summary
Product manager with 8 years leading B2B SaaS discovery, roadmap strategy, and analytics-led growth.

Experience
Lead Product Manager, Northstar SaaS
- Led pricing experiment that improved expansion revenue by 14%.
- Rebuilt onboarding funnel and reduced time-to-value by 32%.
- Coordinated engineering, design, and support across three regions.

Senior Product Manager, Orbit Systems
- Shipped workflow automation suite used by 4,000+ teams.
- Built KPI reviews with finance and customer success partners.

Skills
Product strategy, experimentation, SQL, stakeholder management, roadmap planning, analytics

Education
BCom Information Systems`;

const baResumeText = `Jordan Naidoo
Business Analyst

Summary
Business analyst with 6 years of experience in process improvement, requirements gathering, and dashboard delivery.

Experience
Business Analyst, Metro Operations
- Reduced reporting turnaround from 5 days to 1 day.
- Facilitated workshops across sales, finance, and operations.
- Documented requirements for CRM migration and UAT.

Skills
Requirements gathering, SQL, Tableau, stakeholder management, process mapping, data analysis

Education
BSc Business Information Systems`;

const jdText = `Senior Product Manager
Acme Cloud

Responsibilities
- Lead product discovery and roadmap planning for workflow products.
- Partner with engineering, design, analytics, and sales leadership.
- Define KPIs and communicate outcomes to executives.

Required skills
- Product strategy
- Experimentation
- Analytics
- Stakeholder management
- SQL

Preferred skills
- B2B SaaS
- Pricing
- Onboarding optimization`;

async function main() {
  await prisma.feedbackReport.deleteMany();
  await prisma.sessionAnswer.deleteMany();
  await prisma.sessionQuestion.deleteMany();
  await prisma.session.deleteMany();
  await prisma.roomParticipant.deleteMany();
  await prisma.practiceRoom.deleteMany();
  await prisma.analysisReport.deleteMany();
  await prisma.story.deleteMany();
  await prisma.resumeSection.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.jobDescription.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = bcrypt.hashSync("Password123!", 10);

  const pmUser = await prisma.user.create({
    data: {
      email: "pm@example.com",
      passwordHash,
      name: "Avery Dlamini",
      profile: {
        create: {
          targetRole: "Senior Product Manager",
          seniority: "Senior",
          industries: ["B2B SaaS", "Workflow Automation"],
          answerTone: "Confident and concrete",
          introStyle: "Metrics-first"
        }
      },
      settings: {
        create: {
          aiProviderPriority: ["mock", "openai", "groq", "openrouter", "ollama"],
          defaultModel: "mock-1",
          transcriptionProvider: "browser",
          coachingLevel: "balanced",
          localOnlyMode: true,
          storeAudio: false,
          darkMode: true
        }
      }
    }
  });

  const baUser = await prisma.user.create({
    data: {
      email: "ba@example.com",
      passwordHash,
      name: "Jordan Naidoo",
      profile: {
        create: {
          targetRole: "Senior Business Analyst",
          seniority: "Mid-Senior",
          industries: ["Operations", "Enterprise Software"],
          answerTone: "Structured",
          introStyle: "Problem-action-result"
        }
      },
      settings: {
        create: {
          aiProviderPriority: ["mock", "ollama", "openai"],
          defaultModel: "mock-1",
          transcriptionProvider: "browser",
          coachingLevel: "light",
          localOnlyMode: true,
          storeAudio: false,
          darkMode: true
        }
      }
    }
  });

  const pmResume = await prisma.resume.create({
    data: {
      userId: pmUser.id,
      title: "Product Manager Resume",
      originalFileName: "avery-pm.txt",
      rawText: pmResumeText,
      parsedJson: {
        headline: "Senior Product Manager",
        summary: "Product manager with 8 years leading B2B SaaS discovery, roadmap strategy, and analytics-led growth.",
        experience: [
          {
            title: "Lead Product Manager",
            company: "Northstar SaaS",
            bullets: [
              "Led pricing experiment that improved expansion revenue by 14%.",
              "Rebuilt onboarding funnel and reduced time-to-value by 32%.",
              "Coordinated engineering, design, and support across three regions."
            ]
          }
        ],
        achievements: [
          "Improved expansion revenue by 14%",
          "Reduced time-to-value by 32%"
        ],
        skills: ["Product strategy", "Experimentation", "SQL", "Stakeholder management", "Analytics"],
        tools: ["Amplitude", "Looker", "Jira"],
        education: ["BCom Information Systems"],
        certifications: [],
        projects: []
      },
      sections: {
        create: [
          {
            type: ResumeSectionType.HEADLINE,
            heading: "Headline",
            content: "Senior Product Manager",
            sortOrder: 0
          },
          {
            type: ResumeSectionType.SUMMARY,
            heading: "Summary",
            content: "Product manager with 8 years leading B2B SaaS discovery, roadmap strategy, and analytics-led growth.",
            sortOrder: 1
          },
          {
            type: ResumeSectionType.EXPERIENCE,
            heading: "Experience",
            content: "Lead Product Manager, Northstar SaaS",
            sortOrder: 2
          },
          {
            type: ResumeSectionType.SKILL,
            heading: "Skills",
            content: "Product strategy, experimentation, SQL, stakeholder management, analytics",
            sortOrder: 3
          }
        ]
      }
    }
  });

  await prisma.resume.create({
    data: {
      userId: baUser.id,
      title: "Business Analyst Resume",
      originalFileName: "jordan-ba.txt",
      rawText: baResumeText,
      parsedJson: {
        headline: "Business Analyst",
        summary: "Business analyst with 6 years of experience in process improvement, requirements gathering, and dashboard delivery.",
        experience: [
          {
            title: "Business Analyst",
            company: "Metro Operations",
            bullets: [
              "Reduced reporting turnaround from 5 days to 1 day.",
              "Facilitated workshops across sales, finance, and operations.",
              "Documented requirements for CRM migration and UAT."
            ]
          }
        ],
        achievements: ["Reduced reporting turnaround by 80%"],
        skills: ["Requirements gathering", "SQL", "Tableau", "Stakeholder management", "Process mapping"],
        tools: ["Tableau", "SQL Server"],
        education: ["BSc Business Information Systems"],
        certifications: [],
        projects: []
      }
    }
  });

  const job = await prisma.jobDescription.create({
    data: {
      userId: pmUser.id,
      title: "Senior Product Manager",
      company: "Acme Cloud",
      rawText: jdText,
      parsedJson: {
        roleTitle: "Senior Product Manager",
        company: "Acme Cloud",
        seniority: "Senior",
        responsibilities: [
          "Lead product discovery and roadmap planning for workflow products.",
          "Partner with engineering, design, analytics, and sales leadership.",
          "Define KPIs and communicate outcomes to executives."
        ],
        requiredSkills: ["Product strategy", "Experimentation", "Analytics", "Stakeholder management", "SQL"],
        preferredSkills: ["B2B SaaS", "Pricing", "Onboarding optimization"],
        toolsPlatforms: ["Analytics", "Roadmapping tools"],
        businessDomain: "B2B SaaS",
        behavioralTraits: ["Ownership", "Communication", "Strategic thinking"],
        keywords: ["product strategy", "experimentation", "analytics", "stakeholder management", "sql", "pricing"]
      }
    }
  });

  const analysis = await prisma.analysisReport.create({
    data: {
      userId: pmUser.id,
      resumeId: pmResume.id,
      jobDescriptionId: job.id,
      matchScore: 88,
      matchedKeywords: ["product strategy", "experimentation", "analytics", "stakeholder management", "sql"],
      missingKeywords: ["executive communication"],
      strengths: [
        "Strong B2B SaaS product leadership background",
        "Clear experimentation and onboarding impact",
        "Evidence of cross-functional ownership"
      ],
      gapFraming: [
        "Frame executive communication through KPI reviews and decision memos.",
        "Show pricing ownership with concrete hypotheses and outcomes."
      ],
      likelyQuestions: [
        "How did you decide what to prioritize on your roadmap?",
        "Tell me about a pricing experiment you ran.",
        "How do you align engineering and GTM teams?"
      ],
      intro30: "I am a senior product manager with B2B SaaS experience focused on experimentation, onboarding, and measurable growth outcomes.",
      intro60: "I lead B2B SaaS products with a strong focus on experimentation, analytics, and cross-functional alignment. In my most recent role I improved expansion revenue by 14% through pricing work and reduced time-to-value by 32% by rebuilding onboarding.",
      intro90: "I am a senior product manager with eight years in B2B SaaS, where I have led roadmap strategy, experimentation, and operational alignment across product, engineering, design, support, and go-to-market teams. My recent work includes a pricing experiment that improved expansion revenue by 14% and an onboarding redesign that reduced time-to-value by 32%, which is the kind of customer and business impact I want to keep driving."
    }
  });

  await prisma.story.createMany({
    data: [
      {
        userId: pmUser.id,
        title: "Pricing experiment turnaround",
        category: StoryCategory.ANALYTICS,
        tags: ["pricing", "growth", "sql"],
        scenario: "Revenue expansion was flattening in the self-serve segment.",
        task: "Design and validate a pricing test that could improve expansion.",
        action: "Partnered with analytics, identified upgrade friction, defined the experiment, and aligned sales enablement.",
        result: "Expansion revenue improved by 14% within the first release cycle.",
        evidence: "Experiment readout and revenue dashboard.",
        exampleQuestions: ["Tell me about a time you used data to make a decision."]
      },
      {
        userId: pmUser.id,
        title: "Onboarding simplification",
        category: StoryCategory.CUSTOMER_FOCUS,
        tags: ["onboarding", "activation", "journey"],
        scenario: "New users were struggling to reach first value quickly.",
        task: "Reduce friction in the onboarding journey.",
        action: "Mapped the funnel, cut redundant steps, and introduced contextual guidance with design and engineering.",
        result: "Time-to-value dropped by 32% and activation improved.",
        evidence: "Funnel dashboard and release notes.",
        exampleQuestions: ["Describe a product improvement you led end to end."]
      }
    ]
  });

  const room = await prisma.practiceRoom.create({
    data: {
      ownerId: pmUser.id,
      roomCode: "PM-ROOM",
      title: "PM Mock Interview",
      status: PracticeRoomStatus.ENDED,
      durationMinutes: 15,
      startedAt: new Date(Date.now() - 1000 * 60 * 15),
      endedAt: new Date(Date.now() - 1000 * 60 * 5)
    }
  });

  await prisma.roomParticipant.createMany({
    data: [
      {
        roomId: room.id,
        userId: pmUser.id,
        displayName: pmUser.name,
        role: ParticipantRole.CANDIDATE
      },
      {
        roomId: room.id,
        displayName: "Sam Interviewer",
        role: ParticipantRole.INTERVIEWER
      }
    ]
  });

  const session = await prisma.session.create({
    data: {
      roomId: room.id,
      candidateUserId: pmUser.id,
      status: SessionStatus.ENDED,
      transcript: "Interviewer: Tell me about a pricing decision you made.\nCandidate: I ran a pricing experiment that improved expansion revenue by 14%.",
      transcriptJson: [
        {
          speakerLabel: "Interviewer",
          text: "Tell me about a pricing decision you made.",
          role: "INTERVIEWER",
          timestampMs: 1000
        },
        {
          speakerLabel: "Candidate",
          text: "I ran a pricing experiment that improved expansion revenue by 14%.",
          role: "CANDIDATE",
          timestampMs: 8000
        }
      ],
      startedAt: new Date(Date.now() - 1000 * 60 * 15),
      endedAt: new Date(Date.now() - 1000 * 60 * 5)
    }
  });

  const question = await prisma.sessionQuestion.create({
    data: {
      sessionId: session.id,
      text: "Tell me about a pricing decision you made.",
      timestampMs: 1000,
      detectedTopic: "pricing"
    }
  });

  await prisma.sessionAnswer.create({
    data: {
      sessionId: session.id,
      questionId: question.id,
      speakerLabel: "Candidate",
      text: "I ran a pricing experiment that improved expansion revenue by 14%.",
      score: 86,
      strengths: ["Specific metric", "Strong ownership"],
      weaknesses: ["Could add stakeholder context"],
      improvedAnswer: "I noticed upgrade friction in our pricing tiers, designed an experiment with analytics and sales, and increased expansion revenue by 14%.",
      starRewrite: "Situation: expansion revenue stalled. Task: validate a pricing change. Action: built the hypothesis, aligned cross-functional teams, and launched the experiment. Result: 14% expansion revenue lift.",
      conciseRewrite: "I led a pricing experiment that lifted expansion revenue by 14% through analytics-backed segmentation and cross-functional alignment.",
      executiveRewrite: "I identified pricing friction, aligned the commercial teams, and shipped an experiment that improved expansion revenue by 14%."
    }
  });

  await prisma.feedbackReport.create({
    data: {
      sessionId: session.id,
      summary: "Strong impact evidence and a credible ownership narrative. Next step is to tighten structure and mention collaboration earlier.",
      topStrengths: ["Metric-backed answer", "Clear decision ownership", "Relevant example selection"],
      topImprovements: ["Lead with context faster", "Mention collaborators", "Close with business impact"],
      fillerWordNotes: ["Minimal filler words detected in sample transcript."]
    }
  });

  console.log("Seed complete", { pmUser: pmUser.email, baUser: baUser.email, analysis: analysis.id, session: session.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
