export const CAMPAIGNS = [
  {
    id: "1",
    slug: "sanitary-product-drive",
    label: "Urgent",
    title: "Sanitary Product Drive",
    shortDescription:
      "Help us provide dignity kits so no girl has to miss school because of her period.",
    description:
      "Periods should never be a reason a girl falls behind. Yet in many communities, lack of access to menstrual products keeps girls out of school for days every month. This campaign funds dignity kits that include sanitary pads, soap, and educational materials, delivered directly to girls and women who need them most.",
    image:
      "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014550/5_wtvump.avif",
    raised: 12450,
    goal: 20000,
    location: "East Africa",
    category: "Health & Dignity",
  },
  {
    id: "2",
    slug: "school-support-kits",
    label: "",
    title: "School Support Kits",
    shortDescription:
      "Provide uniforms, backpacks, and supplies so girls can step confidently into the classroom.",
    description:
      "A simple kit can be the difference between dropping out and dreaming bigger. Your support equips girls with uniforms, backpacks, notebooks, and essentials that many families cannot afford. Together we remove barriers so every girl can learn with confidence.",
    image:
      "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014542/3_oy5jmv.avif",
    raised: 5200,
    goal: 15000,
    location: "Rural schools",
    category: "Education",
  },
  {
    id: "3",
    slug: "womens-vocational-training",
    label: "",
    title: "Women’s Vocational Training",
    shortDescription:
      "Empower mothers with job-ready skills so they can build lasting stability for their families.",
    description:
      "This campaign funds training in tailoring, agriculture, and small business skills for women who are ready to transform their families’ futures. From equipment to mentoring, your gift helps create pathways to sustainable income and generational change.",
    image:
      "https://res.cloudinary.com/dlxil9dpo/image/upload/v1758014549/4_qcb19a.avif",
    raised: 23800,
    goal: 30000,
    location: "Community hubs",
    category: "Economic Empowerment",
  },
];

export const getCampaignById = (id) =>
  CAMPAIGNS.find((c) => c.id === id) || null;

