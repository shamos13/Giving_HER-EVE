import teamMember1 from "../assets/team-member-1.jpg";
import teamMember2 from "../assets/team-member-2.jpg";
import teamMember3 from "../assets/team-member-3.jpg";
import teamMember4 from "../assets/team-member-4.jpg";
import teamMember5 from "../assets/team-member-5.jpg";
import headerImage from "../assets/header_img.png";

export const IMPACT_AREAS = [
  {
    label: "Education",
    tone: "bg-[#F1E9FF] text-[#6A0DAD]",
  },
  {
    label: "Health & Wellbeing",
    tone: "bg-[#E8F7F1] text-[#0E7A53]",
  },
  {
    label: "Economic Empowerment",
    tone: "bg-[#FFF4D6] text-[#8A5A00]",
  },
  {
    label: "Voice & Rights",
    tone: "bg-[#FFEAF0] text-[#B4235A]",
  },
  {
    label: "Tech & Innovation",
    tone: "bg-[#EAF2FF] text-[#1D4ED8]",
  },
];

export const IMPACT_STORIES_FALLBACK = [
  {
    id: "amani-journey",
    title: "Amani's Journey: From Classroom to Community Leader",
    excerpt:
      "Our education initiative provided scholarships and mentorship, helping Amani return to school and launch a reading club for younger girls.",
    content:
      "In Nairobi, our education team partnered with Amani's school to provide scholarship coverage and peer mentoring. The program now supports a community reading club that keeps girls engaged in learning.",
    imageUrl: headerImage,
    area: "Education",
    date: "Feb 12, 2024",
    location: "Nairobi, Kenya",
  },
  {
    id: "nala-new-chapter",
    title: "Nala's New Chapter",
    excerpt:
      "Our school kit program stabilized Nala's return to learning and strengthened routines for the family.",
    content:
      "After repeated displacement, our team provided uniforms, supplies, and mentoring so Nala could rejoin class and tutor younger students in the community.",
    imageUrl: teamMember1,
    area: "Education",
    date: "Jan 28, 2024",
    location: "Kampala, Uganda",
  },
  {
    id: "zahra-health-advocacy",
    title: "Zahra's Health Advocacy",
    excerpt:
      "Our health outreach program trained Zahra to deliver maternal health information across remote villages.",
    content:
      "With training and materials, weekly sessions now cover prenatal care, nutrition, and postnatal support, improving access for families living far from clinics.",
    imageUrl: teamMember2,
    area: "Health & Wellbeing",
    date: "Jan 15, 2024",
    location: "Mombasa, Kenya",
  },
  {
    id: "power-of-choice",
    title: "The Power of Choice",
    excerpt:
      "Our economic empowerment cohort helped Amina launch a tailoring business that now supports multiple families.",
    content:
      "Business training, pricing support, and a starter grant helped establish the shop, which now employs local women and funds education costs.",
    imageUrl: teamMember3,
    area: "Economic Empowerment",
    date: "Dec 22, 2023",
    location: "Dar es Salaam, Tanzania",
  },
  {
    id: "community-resilience",
    title: "Community Resilience",
    excerpt:
      "Legal partners supported community advocates to secure land rights and protect long-term stability.",
    content:
      "With legal guidance and advocacy training, the collective negotiated secure land access that enables safer homes and sustainable farming plans.",
    imageUrl: teamMember4,
    area: "Voice & Rights",
    date: "Dec 05, 2023",
    location: "Kigali, Rwanda",
  },
  {
    id: "future-in-tech",
    title: "A Future in Tech",
    excerpt:
      "Our digital skills camp supported Miriam in building a clinic appointment app and mentoring other girls.",
    content:
      "With training and mentorship, the program launched a clinic appointment app and now prepares new cohorts of girls exploring STEM careers.",
    imageUrl: teamMember5,
    area: "Tech & Innovation",
    date: "Nov 18, 2023",
    location: "Arusha, Tanzania",
  },
];

export const IMPACT_STORY_DETAILS = {
  s1: {
    area: "Education",
    date: "Feb 12, 2024",
    location: "Kampala, Uganda",
    paragraphs: [
      "Our education team partnered with local teachers to identify a student at risk of dropping out due to school fees.",
      "Scholarship coverage, learning kits, and weekly mentoring restored attendance and confidence while strengthening family engagement.",
      "The support now powers a community reading circle led by volunteers, keeping younger girls connected to school and learning.",
    ],
    highlights: [
      "Provided scholarships and learning kits that kept students enrolled.",
      "Mentorship sessions rebuilt confidence and attendance.",
      "A community reading circle now supports younger learners.",
    ],
    support: [
      "School fees coverage and academic supplies.",
      "Weekly mentoring and tutoring support.",
      "Community learning space and literacy materials.",
    ],
    quote:
      "Program reflection: Consistent mentoring and learning kits improved attendance and confidence.",
  },
  s2: {
    area: "Safe Shelter",
    date: "Jan 28, 2024",
    location: "Nairobi, Kenya",
    paragraphs: [
      "After a sudden crisis, our protection partners coordinated safe shelter and counseling for a caregiver and children.",
      "Case managers built a recovery plan that included legal referrals, parenting support, and wellness follow-ups.",
      "With stability restored, the family transitioned into independent housing and joined a peer support network.",
    ],
    highlights: [
      "Safe shelter and counseling secured within 24 hours.",
      "Legal aid and parenting support coordinated through partners.",
      "Family transitioned into stable housing and peer support.",
    ],
    support: [
      "Emergency shelter placement and trauma-informed counseling.",
      "Case management with legal and social service referrals.",
      "Family care supplies and wellness follow-ups.",
    ],
    quote:
      "Program reflection: Early stabilization and wraparound care helped the family regain safety and stability.",
  },
  s3: {
    area: "Community Support",
    date: "Jan 15, 2024",
    location: "Mombasa, Kenya",
    paragraphs: [
      "Our community teams coordinated with schools and local leaders to deliver supplies for students and caregivers affected by rising costs.",
      "Mentors organized group sessions on study skills, confidence, and wellbeing to keep families connected to support.",
      "The program restored routines for dozens of households and strengthened collaboration between schools and neighborhoods.",
    ],
    highlights: [
      "Distributed learning supplies to students and caregivers.",
      "Hosted weekly mentorship circles focused on resilience.",
      "Strengthened partnerships between schools and families.",
    ],
    support: [
      "School supplies, hygiene kits, and transport stipends.",
      "Mentorship sessions led by trained volunteers.",
      "Community coordination meetings and follow-up visits.",
    ],
    quote:
      "Program reflection: Community partnerships made rapid, coordinated support possible.",
  },
  s4: {
    area: "Education",
    date: "Dec 22, 2023",
    location: "Arusha, Tanzania",
    paragraphs: [
      "Our scholarship program focused on students who had shown promise but were at risk of dropping out.",
      "Tuition support, uniforms, and leadership training helped form study teams and build exam readiness.",
      "Graduates now mentor younger students and are preparing for continued education.",
    ],
    highlights: [
      "Provided scholarships and uniforms to keep students enrolled.",
      "Offered leadership workshops and peer study groups.",
      "Graduates now mentor younger students in their schools.",
    ],
    support: [
      "Tuition payments, uniforms, and exam preparation.",
      "Leadership training and mentorship circles.",
      "Family engagement sessions to sustain progress.",
    ],
    quote:
      "Program reflection: Scholarships paired with mentorship created lasting academic momentum.",
  },
  s5: {
    area: "Emergency Response",
    date: "Dec 05, 2023",
    location: "Kisumu, Kenya",
    paragraphs: [
      "When families were displaced by an emergency, our response teams mobilized with community leaders within days.",
      "Relief partners delivered food, hygiene kits, and temporary shelter materials while mapping urgent needs.",
      "With stability restored, households returned to work, kept children in school, and rebuilt routines.",
    ],
    highlights: [
      "Delivered emergency food and hygiene supplies quickly.",
      "Supported families with temporary shelter materials.",
      "Connected households to ongoing recovery services.",
    ],
    support: [
      "Emergency food packs and clean water access.",
      "Shelter materials and safe space coordination.",
      "Referrals for continued health and counseling support.",
    ],
    quote:
      "Program reflection: Rapid coordination ensured families had essentials while recovery plans took shape.",
  },
  "amani-journey": {
    area: "Education",
    date: "Feb 12, 2024",
    location: "Nairobi, Kenya",
    paragraphs: [
      "Our education initiative partnered with local schools to support Amani's return to class when fees became a barrier.",
      "Scholarship coverage and mentoring helped restore attendance, and a new reading club now supports younger students after school.",
      "The program continues to reinforce how consistent support can ripple across families and communities.",
    ],
    highlights: [
      "Returned to school and completed exams with mentoring support.",
      "Launched a reading club that supports younger learners.",
      "Built leadership skills through ongoing coaching.",
    ],
    support: [
      "Scholarship coverage and learning materials.",
      "Weekly mentoring sessions and peer support.",
      "Safe learning space for younger students.",
    ],
    quote:
      "Program reflection: Mentorship and scholarships helped sustain learning and leadership.",
  },
  "nala-new-chapter": {
    area: "Education",
    date: "Jan 28, 2024",
    location: "Kampala, Uganda",
    paragraphs: [
      "Our school kit program helped stabilize learning for Nala after repeated moves disrupted attendance.",
      "Supplies, uniforms, and mentoring restored routine and helped keep Nala engaged in class.",
      "The program now supports Nala as a tutor for younger students while preparing for teacher training.",
    ],
    highlights: [
      "Provided school kits and steady mentorship.",
      "Regained academic focus through consistent routines.",
      "Started tutoring younger students.",
    ],
    support: [
      "Uniforms, notebooks, and learning tools.",
      "Mentorship and study check-ins.",
      "Family engagement for continued support.",
    ],
    quote:
      "Program reflection: Consistent school kits and mentoring kept learning on track.",
  },
  "zahra-health-advocacy": {
    area: "Health & Wellbeing",
    date: "Jan 15, 2024",
    location: "Mombasa, Kenya",
    paragraphs: [
      "Our health outreach program trained Zahra to lead prenatal education sessions for expectant mothers in the village.",
      "With structured training and materials, weekly gatherings now cover nutrition, warning signs, and postnatal care.",
      "The program has increased early clinic visits and improved access for families living far from facilities.",
    ],
    highlights: [
      "Trained a community health advocate to lead sessions.",
      "Organized weekly maternal health gatherings.",
      "Increased access to early prenatal care.",
    ],
    support: [
      "Health education training and materials.",
      "Transportation support for clinic visits.",
      "Ongoing mentorship from healthcare partners.",
    ],
    quote:
      "Program reflection: Community health training improved early prenatal engagement.",
  },
  "power-of-choice": {
    area: "Economic Empowerment",
    date: "Dec 22, 2023",
    location: "Dar es Salaam, Tanzania",
    paragraphs: [
      "Our economic empowerment cohort supported Amina with business training and a starter grant for equipment.",
      "Budgeting, pricing, and mentorship sessions helped establish a sustainable tailoring business.",
      "The enterprise now employs other women and funds education costs for the family.",
    ],
    highlights: [
      "Launched a tailoring business with a starter grant.",
      "Created new jobs for women in the neighborhood.",
      "Secured steady income for education and household needs.",
    ],
    support: [
      "Business skills training and mentorship.",
      "Starter grant and equipment support.",
      "Peer network for small business owners.",
    ],
    quote:
      "Program reflection: Business training plus capital created stable income pathways.",
  },
  "community-resilience": {
    area: "Voice & Rights",
    date: "Dec 05, 2023",
    location: "Kigali, Rwanda",
    paragraphs: [
      "Our advocacy partners worked with a group of women to address land insecurity that limited long-term planning.",
      "Legal guidance and leadership training supported negotiations for secure land access and stronger protections.",
      "The progress is now inspiring other communities to organize and advocate for their rights.",
    ],
    highlights: [
      "Secured land access through community advocacy.",
      "Completed legal literacy workshops.",
      "Built a local network of women leaders.",
    ],
    support: [
      "Legal support and advocacy coaching.",
      "Community forums and leadership training.",
      "Ongoing mentorship for women leaders.",
    ],
    quote:
      "Program reflection: Legal literacy and advocacy training strengthened collective action.",
  },
  "future-in-tech": {
    area: "Tech & Innovation",
    date: "Nov 18, 2023",
    location: "Arusha, Tanzania",
    paragraphs: [
      "Our digital skills camp introduced Miriam to women mentors and practical technology training.",
      "Project support and coaching helped launch a clinic appointment app for local health centers.",
      "The program now includes Miriam as a peer mentor for the next cohort of girls exploring STEM careers.",
    ],
    highlights: [
      "Completed a digital skills camp and built a real product.",
      "Launched a clinic appointment app for local clinics.",
      "Now mentors other girls interested in technology.",
    ],
    support: [
      "Digital training, mentorship, and equipment access.",
      "Project support from volunteer engineers.",
      "Community demo day and networking sessions.",
    ],
    quote:
      "Program reflection: Digital training paired with mentorship opened new career pathways.",
  },
};
