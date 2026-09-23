export type Question = {
  id: string;
  sentence: string;
  choices: string[];
  answer: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "t-1",
    sentence:
      "The meeting was moved to a later date due to unforeseen circumstances.",
    choices: ["cancel", "postpone", "organize", "confirm"],
    answer: "postpone",
  },
  {
    id: "t-2",
    sentence:
      "Employees are required to follow the rules established by the company.",
    choices: ["policy", "budget", "salary", "promotion"],
    answer: "policy",
  },
  {
    id: "t-3",
    sentence:
      "The factory plans to increase output in response to rising demand.",
    choices: ["reduce", "expand", "delay", "limit"],
    answer: "expand",
  },
  {
    id: "t-4",
    sentence:
      "Attendance at the safety training session is required for all staff.",
    choices: ["optional", "mandatory", "temporary", "flexible"],
    answer: "mandatory",
  },
  {
    id: "t-5",
    sentence:
      "The manager carefully examined the document before approving it.",
    choices: ["ignored", "reviewed", "printed", "shared"],
    answer: "reviewed",
  },
  {
    id: "t-6",
    sentence: "The company reduced spending by cutting unnecessary costs.",
    choices: ["increase", "monitor", "eliminate", "estimate"],
    answer: "eliminate",
  },
  {
    id: "t-7",
    sentence: "The construction work was finished ahead of schedule.",
    choices: ["delayed", "completed", "cancelled", "revised"],
    answer: "completed",
  },
  {
    id: "t-8",
    sentence: "The new regulations will begin to be used next month.",
    choices: ["expire", "apply", "remove", "reject"],
    answer: "apply",
  },
  {
    id: "t-9",
    sentence: "Customer opinions are very valuable for improving services.",
    choices: ["optional", "important", "rare", "temporary"],
    answer: "important",
  },
  {
    id: "t-10",
    sentence: "Both sides finally reached an agreement after long discussions.",
    choices: ["delay", "consent", "conflict", "proposal"],
    answer: "consent",
  },

  {
    id: "t-11",
    sentence:
      "The company gave workers additional money for their extra efforts.",
    choices: ["bonus", "penalty", "loan", "budget"],
    answer: "bonus",
  },
  {
    id: "t-12",
    sentence: "The instructions were not clear enough to understand easily.",
    choices: ["complex", "vague", "precise", "detailed"],
    answer: "vague",
  },
  {
    id: "t-13",
    sentence: "The manager asked the team to finish the task before Friday.",
    choices: ["delay", "assign", "complete", "cancel"],
    answer: "complete",
  },
  {
    id: "t-14",
    sentence: "Sales figures improved as a direct result of the new strategy.",
    choices: ["cause", "result", "condition", "risk"],
    answer: "result",
  },
  {
    id: "t-15",
    sentence: "The company officially announced its new partnership.",
    choices: ["denied", "confirmed", "ignored", "avoided"],
    answer: "confirmed",
  },
  {
    id: "t-16",
    sentence:
      "Employees should submit expense reports by the end of the month.",
    choices: ["approve", "delay", "submit", "review"],
    answer: "submit",
  },
  {
    id: "t-17",
    sentence: "The office was temporarily closed because of a power failure.",
    choices: ["permanently", "briefly", "officially", "frequently"],
    answer: "briefly",
  },
  {
    id: "t-18",
    sentence: "The manager distributed tasks evenly among team members.",
    choices: ["fairly", "randomly", "poorly", "secretly"],
    answer: "fairly",
  },
  {
    id: "t-19",
    sentence: "The deadline was extended to give staff more time.",
    choices: ["shortened", "removed", "extended", "ignored"],
    answer: "extended",
  },
  {
    id: "t-20",
    sentence: "The company aims to improve customer satisfaction.",
    choices: ["reduce", "maintain", "enhance", "ignore"],
    answer: "enhance",
  },

  {
    id: "t-21",
    sentence: "The equipment needs to be checked on a regular basis.",
    choices: ["occasionally", "rarely", "regularly", "never"],
    answer: "regularly",
  },
  {
    id: "t-22",
    sentence: "The manager is responsible for overseeing daily operations.",
    choices: ["ignoring", "managing", "ending", "delaying"],
    answer: "managing",
  },
  {
    id: "t-23",
    sentence: "The proposal was rejected because it was too expensive.",
    choices: ["accepted", "approved", "rejected", "revised"],
    answer: "rejected",
  },
  {
    id: "t-24",
    sentence: "Employees are encouraged to share new ideas.",
    choices: ["forced", "discouraged", "encouraged", "prevented"],
    answer: "encouraged",
  },
  {
    id: "t-25",
    sentence: "The company experienced a sudden increase in sales.",
    choices: ["decline", "growth", "delay", "loss"],
    answer: "growth",
  },
  {
    id: "t-26",
    sentence: "The product was designed to meet customer needs.",
    choices: ["fail", "satisfy", "ignore", "predict"],
    answer: "satisfy",
  },
  {
    id: "t-27",
    sentence: "The manager decided to change the original plan.",
    choices: ["maintain", "revise", "reject", "approve"],
    answer: "revise",
  },
  {
    id: "t-28",
    sentence: "The employee showed excellent performance during the year.",
    choices: ["poor", "average", "outstanding", "limited"],
    answer: "outstanding",
  },
  {
    id: "t-29",
    sentence: "The company provides training to improve employee skills.",
    choices: ["reduce", "enhance", "test", "replace"],
    answer: "enhance",
  },
  {
    id: "t-30",
    sentence: "The manager asked for feedback from customers.",
    choices: ["complaints", "opinions", "orders", "payments"],
    answer: "opinions",
  },

  {
    id: "t-31",
    sentence: "The company plans to hire additional staff next year.",
    choices: ["fire", "train", "employ", "transfer"],
    answer: "employ",
  },
  {
    id: "t-32",
    sentence: "The project was delayed because of a lack of resources.",
    choices: ["shortage", "abundance", "supply", "access"],
    answer: "shortage",
  },
  {
    id: "t-33",
    sentence: "The employee was praised for her contribution to the team.",
    choices: ["criticism", "reward", "contribution", "absence"],
    answer: "contribution",
  },
  {
    id: "t-34",
    sentence: "The manager handled the complaint in a professional manner.",
    choices: ["careless", "rude", "professional", "casual"],
    answer: "professional",
  },
  {
    id: "t-35",
    sentence: "The company announced changes to its schedule.",
    choices: ["ignored", "revealed", "postponed", "cancelled"],
    answer: "revealed",
  },
  {
    id: "t-36",
    sentence: "The office supplies were delivered earlier than expected.",
    choices: ["returned", "delivered", "ordered", "packed"],
    answer: "delivered",
  },
  {
    id: "t-37",
    sentence: "The company must comply with industry standards.",
    choices: ["ignore", "violate", "follow", "question"],
    answer: "follow",
  },
  {
    id: "t-38",
    sentence: "The employee requested time off for personal reasons.",
    choices: ["vacation", "promotion", "transfer", "training"],
    answer: "vacation",
  },
  {
    id: "t-39",
    sentence: "The manager approved the request after careful consideration.",
    choices: ["rejected", "delayed", "approved", "questioned"],
    answer: "approved",
  },
  {
    id: "t-40",
    sentence: "The company operates branches in several countries.",
    choices: ["closes", "owns", "runs", "sells"],
    answer: "runs",
  },

  {
    id: "t-41",
    sentence: "The report contains accurate and reliable information.",
    choices: ["false", "accurate", "limited", "outdated"],
    answer: "accurate",
  },
  {
    id: "t-42",
    sentence: "The manager delegated tasks to team members.",
    choices: ["assigned", "removed", "ignored", "simplified"],
    answer: "assigned",
  },
  {
    id: "t-43",
    sentence: "The company offers flexible working hours.",
    choices: ["strict", "rigid", "adaptable", "fixed"],
    answer: "adaptable",
  },
  {
    id: "t-44",
    sentence: "The project requires careful planning and coordination.",
    choices: ["luck", "effort", "planning", "speed"],
    answer: "planning",
  },
  {
    id: "t-45",
    sentence: "The manager emphasized the importance of teamwork.",
    choices: ["ignored", "highlighted", "questioned", "reduced"],
    answer: "highlighted",
  },
  {
    id: "t-46",
    sentence: "The company experienced financial difficulties last year.",
    choices: ["success", "stability", "problems", "growth"],
    answer: "problems",
  },
  {
    id: "t-47",
    sentence: "The employee demonstrated strong leadership skills.",
    choices: ["weak", "poor", "effective", "limited"],
    answer: "effective",
  },
  {
    id: "t-48",
    sentence: "The office will remain closed during the holiday period.",
    choices: ["open", "closed", "busy", "staffed"],
    answer: "closed",
  },
  {
    id: "t-49",
    sentence: "The company introduced new measures to improve safety.",
    choices: ["removed", "introduced", "avoided", "ignored"],
    answer: "introduced",
  },
  {
    id: "t-50",
    sentence: "The manager requested a detailed explanation.",
    choices: ["summary", "schedule", "explanation", "decision"],
    answer: "explanation",
  },

  // t-51〜t-100（後半）も同一品質で続く

  {
    id: "t-51",
    sentence:
      "The manager asked employees to arrive earlier than usual for the meeting.",
    choices: ["punctual", "early", "late", "absent"],
    answer: "early",
  },
  {
    id: "t-52",
    sentence:
      "The company decided to stop offering the service due to low demand.",
    choices: ["continue", "expand", "discontinue", "improve"],
    answer: "discontinue",
  },
  {
    id: "t-53",
    sentence: "The instructions were easy to understand and follow.",
    choices: ["confusing", "clear", "complex", "technical"],
    answer: "clear",
  },
  {
    id: "t-54",
    sentence:
      "The employee was promoted because of consistent high performance.",
    choices: ["demoted", "evaluated", "advanced", "transferred"],
    answer: "advanced",
  },
  {
    id: "t-55",
    sentence: "The company plans to launch the product in several countries.",
    choices: ["delay", "cancel", "introduce", "test"],
    answer: "introduce",
  },
  {
    id: "t-56",
    sentence: "The manager expressed concern about declining sales figures.",
    choices: ["interest", "approval", "worry", "confidence"],
    answer: "worry",
  },
  {
    id: "t-57",
    sentence: "Employees were asked to complete the survey honestly.",
    choices: ["accurately", "quickly", "secretly", "casually"],
    answer: "accurately",
  },
  {
    id: "t-58",
    sentence: "The project was finished using fewer resources than expected.",
    choices: ["efficiently", "slowly", "carelessly", "expensively"],
    answer: "efficiently",
  },
  {
    id: "t-59",
    sentence: "The manager refused the proposal due to insufficient data.",
    choices: ["accepted", "declined", "reviewed", "explained"],
    answer: "declined",
  },
  {
    id: "t-60",
    sentence: "The company plans to move its headquarters to another city.",
    choices: ["relocate", "expand", "close", "rebuild"],
    answer: "relocate",
  },

  {
    id: "t-61",
    sentence: "The employee was recognized for her dedication to the project.",
    choices: ["punished", "praised", "ignored", "replaced"],
    answer: "praised",
  },
  {
    id: "t-62",
    sentence: "The company must reduce spending to avoid losses.",
    choices: ["increase", "control", "cut", "predict"],
    answer: "cut",
  },
  {
    id: "t-63",
    sentence: "The manager asked the team to focus on their main objectives.",
    choices: ["goals", "mistakes", "methods", "limits"],
    answer: "goals",
  },
  {
    id: "t-64",
    sentence: "The office equipment was replaced with newer models.",
    choices: ["repaired", "updated", "removed", "sold"],
    answer: "updated",
  },
  {
    id: "t-65",
    sentence: "The company experienced rapid expansion over the past year.",
    choices: ["growth", "failure", "delay", "reduction"],
    answer: "growth",
  },
  {
    id: "t-66",
    sentence:
      "Employees are encouraged to improve their professional abilities.",
    choices: ["skills", "salaries", "positions", "benefits"],
    answer: "skills",
  },
  {
    id: "t-67",
    sentence: "The manager handled the situation calmly and effectively.",
    choices: ["poorly", "professionally", "angrily", "carelessly"],
    answer: "professionally",
  },
  {
    id: "t-68",
    sentence: "The company issued a statement regarding the recent changes.",
    choices: ["announcement", "complaint", "warning", "request"],
    answer: "announcement",
  },
  {
    id: "t-69",
    sentence: "The employee was absent because of a medical appointment.",
    choices: ["meeting", "conference", "illness", "training"],
    answer: "illness",
  },
  {
    id: "t-70",
    sentence: "The project requires approval from senior management.",
    choices: ["permission", "feedback", "payment", "planning"],
    answer: "permission",
  },

  {
    id: "t-71",
    sentence:
      "The company decided to limit access to confidential information.",
    choices: ["protect", "share", "restrict", "publish"],
    answer: "restrict",
  },
  {
    id: "t-72",
    sentence: "The manager requested an update on the project’s progress.",
    choices: ["delay", "report", "budget", "contract"],
    answer: "report",
  },
  {
    id: "t-73",
    sentence: "The company provides benefits to attract skilled workers.",
    choices: ["customers", "employees", "investors", "managers"],
    answer: "employees",
  },
  {
    id: "t-74",
    sentence: "The deadline was missed due to unexpected technical issues.",
    choices: ["achieved", "extended", "missed", "ignored"],
    answer: "missed",
  },
  {
    id: "t-75",
    sentence: "The manager encouraged open communication within the team.",
    choices: ["honest", "limited", "formal", "silent"],
    answer: "honest",
  },
  {
    id: "t-76",
    sentence: "The company gained a strong position in the global market.",
    choices: ["advantage", "loss", "delay", "risk"],
    answer: "advantage",
  },
  {
    id: "t-77",
    sentence: "The employee completed the assignment without assistance.",
    choices: ["alone", "quickly", "poorly", "carefully"],
    answer: "alone",
  },
  {
    id: "t-78",
    sentence: "The manager arranged the meeting to discuss future plans.",
    choices: ["cancelled", "organized", "delayed", "attended"],
    answer: "organized",
  },
  {
    id: "t-79",
    sentence: "The company’s decision had a positive effect on profits.",
    choices: ["impact", "cause", "problem", "risk"],
    answer: "impact",
  },
  {
    id: "t-80",
    sentence: "Employees must complete the training before starting work.",
    choices: ["optional", "required", "delayed", "recommended"],
    answer: "required",
  },

  {
    id: "t-81",
    sentence: "The manager provided guidance to new staff members.",
    choices: ["instructions", "warnings", "complaints", "orders"],
    answer: "instructions",
  },
  {
    id: "t-82",
    sentence: "The company plans to reduce environmental impact.",
    choices: ["measure", "effect", "damage", "influence"],
    answer: "damage",
  },
  {
    id: "t-83",
    sentence: "The employee handled customer complaints politely.",
    choices: ["rudely", "professionally", "angrily", "carelessly"],
    answer: "professionally",
  },
  {
    id: "t-84",
    sentence: "The project was completed within the allocated budget.",
    choices: ["limit", "expense", "schedule", "resource"],
    answer: "limit",
  },
  {
    id: "t-85",
    sentence: "The company expanded its services to meet customer needs.",
    choices: ["reduce", "adjust", "broaden", "remove"],
    answer: "broaden",
  },
  {
    id: "t-86",
    sentence: "The manager expects employees to act responsibly.",
    choices: ["carefully", "independently", "seriously", "responsibly"],
    answer: "responsibly",
  },
  {
    id: "t-87",
    sentence: "The company received positive feedback from clients.",
    choices: ["criticism", "praise", "complaints", "requests"],
    answer: "praise",
  },
  {
    id: "t-88",
    sentence: "The employee agreed to take on additional duties.",
    choices: ["refused", "accepted", "questioned", "avoided"],
    answer: "accepted",
  },
  {
    id: "t-89",
    sentence: "The manager resolved the issue quickly.",
    choices: ["created", "ignored", "solved", "explained"],
    answer: "solved",
  },
  {
    id: "t-90",
    sentence: "The company improved efficiency by updating its systems.",
    choices: ["speed", "accuracy", "efficiency", "cost"],
    answer: "efficiency",
  },

  {
    id: "t-91",
    sentence: "The employee followed instructions carefully.",
    choices: ["ignored", "obeyed", "changed", "questioned"],
    answer: "obeyed",
  },
  {
    id: "t-92",
    sentence: "The manager emphasized meeting customer expectations.",
    choices: ["requirements", "complaints", "payments", "contracts"],
    answer: "requirements",
  },
  {
    id: "t-93",
    sentence: "The company plans to invest in new technology.",
    choices: ["fund", "sell", "repair", "test"],
    answer: "fund",
  },
  {
    id: "t-94",
    sentence: "The employee submitted the report ahead of schedule.",
    choices: ["late", "early", "carelessly", "incorrectly"],
    answer: "early",
  },
  {
    id: "t-95",
    sentence: "The manager evaluated the employee’s performance.",
    choices: ["judged", "ignored", "praised", "copied"],
    answer: "judged",
  },
  {
    id: "t-96",
    sentence: "The company faced strong competition in the market.",
    choices: ["support", "pressure", "rivals", "customers"],
    answer: "rivals",
  },
  {
    id: "t-97",
    sentence: "The employee showed a willingness to learn new skills.",
    choices: ["refusal", "desire", "hesitation", "fear"],
    answer: "desire",
  },
  {
    id: "t-98",
    sentence: "The manager postponed the decision until next week.",
    choices: ["made", "delayed", "cancelled", "announced"],
    answer: "delayed",
  },
  {
    id: "t-99",
    sentence: "The company achieved its annual targets.",
    choices: ["missed", "set", "reached", "lowered"],
    answer: "reached",
  },
  {
    id: "t-100",
    sentence: "The employee maintained a positive attitude at work.",
    choices: ["negative", "optimistic", "careless", "silent"],
    answer: "optimistic",
  },
];
