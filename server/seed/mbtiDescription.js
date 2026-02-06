// MBTI trait, strengths, and work style data
const mbtiData = {
  ESTP: {
    traitBreakdown: {
      energy: "Extraverted — energized by action and people",
      information: "Sensing — practical and detail-focused",
      decisions: "Thinking — logical and objective decision-maker",
      lifestyle: "Perceiving — flexible and spontaneous",
    },
    keyStrengths: [
      "Fast decision-making",
      "Highly adaptable",
      "Excellent problem-solving",
      "Bold and confident",
    ],
    workStylePreferences: [
      "Fast-paced environments",
      "Hands-on tasks",
      "Immediate results",
      "High autonomy",
    ],
  },
  ESFP: {
    traitBreakdown: {
      energy: "Extraverted — thrives in social settings",
      information: "Sensing — practical and present-focused",
      decisions: "Feeling — values harmony and people",
      lifestyle: "Perceiving — spontaneous and flexible",
    },
    keyStrengths: [
      "Charismatic and energetic",
      "Great team motivator",
      "Strong social intuition",
      "Enjoys variety",
    ],
    workStylePreferences: [
      "Collaborative teams",
      "Fun and dynamic workplace",
      "Flexible roles",
      "People-focused tasks",
    ],
  },
  ISTP: {
    traitBreakdown: {
      energy: "Introverted — works best alone",
      information: "Sensing — detail-oriented",
      decisions: "Thinking — analytical and logical",
      lifestyle: "Perceiving — adaptable and hands-on",
    },
    keyStrengths: [
      "Calm under pressure",
      "Excellent troubleshooting",
      "Strong technical skills",
      "Independent",
    ],
    workStylePreferences: [
      "Hands-on projects",
      "Minimal supervision",
      "Problem-solving tasks",
      "Structured but flexible",
    ],
  },
  ISFP: {
    traitBreakdown: {
      energy: "Introverted — reflective and calm",
      information: "Sensing — observant and realistic",
      decisions: "Feeling — values personal meaning",
      lifestyle: "Perceiving — relaxed and adaptable",
    },
    keyStrengths: [
      "Strong aesthetic sense",
      "Compassionate",
      "Patient and calm",
      "Highly observant",
    ],
    workStylePreferences: [
      "Quiet, calm environments",
      "Creative tasks",
      "Freedom to work independently",
      "Flexible schedules",
    ],
  },
  ENTP: {
    traitBreakdown: {
      energy: "Extraverted — idea-driven and social",
      information: "Intuitive — innovative and future-focused",
      decisions: "Thinking — logical and strategic",
      lifestyle: "Perceiving — adaptable and curious",
    },
    keyStrengths: [
      "Innovative thinking",
      "Excellent communication",
      "Big-picture focus",
      "Great at debate",
    ],
    workStylePreferences: [
      "Fast-changing roles",
      "Brainstorming sessions",
      "Freedom to explore ideas",
      "Flexible structure",
    ],
  },
  ENFP: {
    traitBreakdown: {
      energy: "Extraverted — energetic and enthusiastic",
      information: "Intuitive — imaginative and visionary",
      decisions: "Feeling — values people and meaning",
      lifestyle: "Perceiving — flexible and spontaneous",
    },
    keyStrengths: [
      "Highly creative",
      "Strong empathy",
      "Inspires others",
      "Passionate and motivating",
    ],
    workStylePreferences: [
      "Collaborative teams",
      "Meaningful projects",
      "Flexible roles",
      "Creative freedom",
    ],
  },
  INTP: {
    traitBreakdown: {
      energy: "Introverted — quiet and thoughtful",
      information: "Intuitive — theoretical and abstract",
      decisions: "Thinking — logical and analytical",
      lifestyle: "Perceiving — flexible and open-ended",
    },
    keyStrengths: [
      "Strong analytical skills",
      "Independent thinker",
      "Deep problem-solving",
      "Loves research",
    ],
    workStylePreferences: [
      "Independent work",
      "Deep focus time",
      "Minimal interruptions",
      "Structured ideas, flexible process",
    ],
  },
  INFP: {
    traitBreakdown: {
      energy: "Introverted — reflective and calm",
      information: "Intuitive — imaginative and values-driven",
      decisions: "Feeling — empathetic and idealistic",
      lifestyle: "Perceiving — flexible and open",
    },
    keyStrengths: [
      "Deep empathy",
      "Strong creativity",
      "Values-driven",
      "Excellent listener",
    ],
    workStylePreferences: [
      "Purpose-driven projects",
      "Quiet and calm environments",
      "Flexible schedules",
      "Freedom to be creative",
    ],
  },
  ESTJ: {
    traitBreakdown: {
      energy: "Extraverted — organized and decisive",
      information: "Sensing — practical and realistic",
      decisions: "Thinking — logical and rule-based",
      lifestyle: "Judging — structured and organized",
    },
    keyStrengths: [
      "Strong leadership",
      "Highly organized",
      "Great at planning",
      "Clear decision-maker",
    ],
    workStylePreferences: [
      "Structured tasks",
      "Clear rules and hierarchy",
      "Fast execution",
      "Team leadership roles",
    ],
  },
  ESFJ: {
    traitBreakdown: {
      energy: "Extraverted — people-focused and warm",
      information: "Sensing — practical and observant",
      decisions: "Feeling — empathetic and supportive",
      lifestyle: "Judging — organized and dependable",
    },
    keyStrengths: [
      "Great team support",
      "Strong empathy",
      "Reliable and responsible",
      "Excellent communicator",
    ],
    workStylePreferences: [
      "Team collaboration",
      "Supportive roles",
      "Clear expectations",
      "Stable environment",
    ],
  },
  ISTJ: {
    traitBreakdown: {
      energy: "Introverted — focused and reserved",
      information: "Sensing — detail-oriented and realistic",
      decisions: "Thinking — logical and structured",
      lifestyle: "Judging — disciplined and organized",
    },
    keyStrengths: [
      "Highly responsible",
      "Strong attention to detail",
      "Dependable",
      "Strong planning ability",
    ],
    workStylePreferences: [
      "Clear rules and goals",
      "Independent work",
      "Structured environment",
      "Long-term planning",
    ],
  },
  ISFJ: {
    traitBreakdown: {
      energy: "Introverted — caring and calm",
      information: "Sensing — practical and observant",
      decisions: "Feeling — supportive and empathetic",
      lifestyle: "Judging — organized and dependable",
    },
    keyStrengths: [
      "Strong loyalty",
      "Highly responsible",
      "Excellent support skills",
      "Detail-focused",
    ],
    workStylePreferences: [
      "Stable and calm environments",
      "Team support roles",
      "Clear expectations",
      "Helping others",
    ],
  },
  ENTJ: {
    traitBreakdown: {
      energy: "Extraverted — strategic and bold",
      information: "Intuitive — big-picture thinker",
      decisions: "Thinking — logical and objective",
      lifestyle: "Judging — organized and goal-driven",
    },
    keyStrengths: [
      "Strong leadership",
      "Visionary planning",
      "Great decision-making",
      "Competitive and ambitious",
    ],
    workStylePreferences: [
      "Leadership roles",
      "Strategic planning",
      "Fast results",
      "High responsibility",
    ],
  },
  ENFJ: {
    traitBreakdown: {
      energy: "Extraverted — inspiring and social",
      information: "Intuitive — future-oriented",
      decisions: "Feeling — empathetic and supportive",
      lifestyle: "Judging — organized and purposeful",
    },
    keyStrengths: [
      "Strong people skills",
      "Inspiring leadership",
      "Excellent communication",
      "Highly empathetic",
    ],
    workStylePreferences: [
      "Team leadership",
      "Mentoring others",
      "Meaningful projects",
      "Collaborative environment",
    ],
  },
  INTJ: {
    traitBreakdown: {
      energy: "Introverted — strategic and independent",
      information: "Intuitive — future-focused",
      decisions: "Thinking — logical and analytical",
      lifestyle: "Judging — structured and determined",
    },
    keyStrengths: [
      "Strategic thinker",
      "Highly independent",
      "Strong planning ability",
      "Problem-solving genius",
    ],
    workStylePreferences: [
      "Independent work",
      "Long-term planning",
      "Deep focus time",
      "Strategic projects",
    ],
  },
  INFJ: {
    traitBreakdown: {
      energy: "Introverted — reflective and calm",
      information: "Intuitive — insight-driven",
      decisions: "Feeling — empathetic and values-driven",
      lifestyle: "Judging — organized and purposeful",
    },
    keyStrengths: [
      "Insightful and visionary",
      "Strong empathy",
      "Great listener",
      "Values-driven",
    ],
    workStylePreferences: [
      "Purpose-driven work",
      "Quiet environments",
      "Long-term goals",
      "Helping others",
    ],
  },
};

module.exports = mbtiData;
