import { configurations, offer, paymentPlan, project, startingPrice, towerGroups } from "./project";

const fmt = (n: number) => n.toLocaleString("en-IN");
const list = (sizes: number[]) =>
  `${sizes.slice(0, -1).map(fmt).join(", ")} and ${fmt(sizes[sizes.length - 1])} SFT`;

const [towerA, towersBC] = towerGroups;

/** FAQ answers draw only on the official project information. */
export const faqs: Array<{ question: string; answer: string }> = [
  {
    question: "Where is MSN Neopolis located?",
    answer: `MSN Neopolis is located in ${project.locality}, ${project.city}, within the city's western growth corridor.`,
  },
  {
    question: "What configurations are available?",
    answer: "MSN Neopolis offers 3 BHK and 4 BHK residences across three residential towers.",
  },
  {
    question: "What are the apartment sizes?",
    answer: `Residences range from ${fmt(project.sizeRange.min)} to ${fmt(project.sizeRange.max)} SFT. 3 BHK sizes are ${list(configurations["3bhk"].sizes)}. 4 BHK sizes are ${list(configurations["4bhk"].sizes)}.`,
  },
  {
    question: "What is the price of a residence at MSN Neopolis?",
    answer: `Residences start from ${startingPrice.label}. Final pricing varies by configuration, tower, floor and unit, and GST, registration, parking and other applicable charges are additional. The MSN team shares the official cost sheet for your preferred residence on request.`,
  },
  {
    question: "How large is the clubhouse?",
    answer: `Approximately ${project.clubhouseSft} SFT is dedicated to the clubhouse and amenities.`,
  },
  {
    question: "What are the floor heights?",
    answer: `Tower A has a floor-to-floor height of ${towerA.floorToFloorFt} ft. Towers B and C have a floor-to-floor height of ${towersBC.floorToFloorFt} ft.`,
  },
  {
    question: "What is the payment structure?",
    answer: `The payment plan is ${paymentPlan.label}: five instalments of 20% each, payable across the milestones in the official payment schedule. The MSN team can share the schedule with you.`,
  },
  {
    question: "What is the pre-launch offer?",
    answer: `The introductory pre-launch offer applies exclusively to the first ${offer.bookings} bookings, subject to the developer's official terms and availability. Share your details to check your eligibility.`,
  },
  {
    question: "Are floor plans available?",
    answer:
      "Yes. Official floor plans are shared by the MSN team on request. Choose your preferred configuration and size in the floor-plan section, leave your name and number, and the team will send you the relevant plans.",
  },
  {
    question: "How do I arrange a site visit?",
    answer:
      "Leave your name and mobile number in the enquiry form. The MSN team will call you to arrange a visit at a time that suits you.",
  },
];
