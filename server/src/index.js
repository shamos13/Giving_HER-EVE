import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev-admin-token";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../data/db.json");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

async function readDb() {
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw);
}

async function writeDb(db) {
  await fs.writeFile(dataFile, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token && token === ADMIN_TOKEN) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function initials(name) {
  if (!name || typeof name !== "string") return "AN";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AN";
  return parts
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join("");
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return null;
  return date;
}

function buildDailyTotals(donations, start, end) {
  const startDate = parseDate(start) || new Date();
  const endDate = parseDate(end) || new Date();
  const startDay = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
  const endDay = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

  const totals = new Map();
  for (const donation of donations) {
    const createdAt = parseDate(donation.createdAt);
    if (!createdAt) continue;
    if (createdAt < startDate || createdAt > endDate) continue;
    const key = toDateKey(createdAt);
    totals.set(key, (totals.get(key) || 0) + Number(donation.amount || 0));
  }

  const daily = [];
  for (let day = new Date(startDay); day <= endDay; day.setUTCDate(day.getUTCDate() + 1)) {
    const key = toDateKey(day);
    daily.push({ date: key, total: totals.get(key) || 0 });
  }
  return daily;
}

function summarizeDonations(donations, start, end) {
  const startDate = parseDate(start) || new Date(0);
  const endDate = parseDate(end) || new Date();
  const inRange = donations.filter(donation => {
    const createdAt = parseDate(donation.createdAt);
    if (!createdAt) return false;
    return createdAt >= startDate && createdAt <= endDate;
  });
  const totalAmount = inRange.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalCount = inRange.length;
  return { totalAmount, totalCount, inRange };
}

function computeStatusBreakdown(donations) {
  const counts = donations.reduce(
    (acc, donation) => {
      const status = donation.status || "Completed";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );
  const total = Math.max(1, donations.length);
  const toneByStatus = {
    Completed: "green",
    Pending: "amber",
    Failed: "rose",
  };
  return Object.entries(counts).map(([label, count]) => ({
    label,
    value: Math.round((count / total) * 100),
    tone: toneByStatus[label] || "amber",
  }));
}

function computeSourceBreakdown(donations) {
  const totals = donations.reduce(
    (acc, donation) => {
      const source = donation.source || "Unknown";
      acc[source] = (acc[source] || 0) + Number(donation.amount || 0);
      return acc;
    },
    {},
  );
  return Object.entries(totals).map(([source, total]) => ({ source, total }));
}

function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) => {
    const ad = parseDate(a.createdAt) || new Date(0);
    const bd = parseDate(b.createdAt) || new Date(0);
    return bd.getTime() - ad.getTime();
  });
}

function computeDashboardMetrics(db) {
  const meta = db.dashboard?.metricMeta || [];
  const donations = db.donations || [];
  const users = db.users || [];
  const messages = db.messages || [];

  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const totalUsers = users.length;
  const totalVolunteers = users.filter(u => u.role === "Volunteer").length;
  const openMessages = messages.filter(m => m.status !== "Resolved").length;

  return meta.map(metric => {
    let value = "0";
    if (metric.id === "totalUsers") value = totalUsers.toLocaleString();
    if (metric.id === "donations") value = formatCurrency(totalDonations);
    if (metric.id === "volunteers") value = totalVolunteers.toLocaleString();
    if (metric.id === "openMessages") value = openMessages.toLocaleString();

    return {
      ...metric,
      value,
    };
  });
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Public APIs
app.get("/api/campaigns", async (_req, res) => {
  const db = await readDb();
  const campaigns = (db.campaigns || []).filter(campaign => campaign.status !== "Draft");
  res.json(campaigns);
});

app.get("/api/campaigns/active", async (_req, res) => {
  const db = await readDb();
  const campaigns = (db.campaigns || []).filter(campaign => campaign.status === "Active");
  res.json(campaigns);
});

app.get("/api/campaigns/:id", async (req, res) => {
  const db = await readDb();
  const campaign = (db.campaigns || []).find(item => item.id === req.params.id);
  if (!campaign || campaign.status === "Draft") {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  res.json(campaign);
});

app.get("/api/stories", async (_req, res) => {
  const db = await readDb();
  const stories = (db.stories || []).filter(story => story.status === "Published");
  res.json(stories);
});

app.get("/api/organization", async (_req, res) => {
  const db = await readDb();
  res.json(db.settings?.organization || {});
});

app.get("/api/testimonials", async (_req, res) => {
  const db = await readDb();
  const testimonials = (db.testimonials || []).filter(testimonial => testimonial.status === "Published");
  res.json(testimonials);
});

app.get("/api/faqs", async (_req, res) => {
  const db = await readDb();
  const faqs = (db.faqs || []).filter(faq => faq.status === "Published");
  res.json(faqs);
});

app.post("/api/donations", async (req, res) => {
  const db = await readDb();
  const { amount, currency, donorName, donorEmail, source, campaignId, category } = req.body || {};
  const nextId = (db.donations || []).reduce((max, d) => Math.max(max, Number(d.id) || 0), 0) + 1;
  const newDonation = {
    id: nextId,
    amount: Number(amount || 0),
    currency: currency || "USD",
    donorName: donorName || null,
    donorEmail: donorEmail || null,
    source: source || "Website",
    campaignId: campaignId || null,
    category: category || "General",
    status: "Completed",
    createdAt: new Date().toISOString(),
  };
  db.donations = [newDonation, ...(db.donations || [])];
  await writeDb(db);
  res.status(201).json(newDonation);
});

// Admin APIs
app.get("/api/admin/dashboard", requireAdmin, async (_req, res) => {
  const db = await readDb();
  const metrics = computeDashboardMetrics(db);
  const donations = sortByCreatedAtDesc(db.donations || []);
  const recentDonations = donations.slice(0, 4).map(donation => ({
    id: String(donation.id),
    donor: donation.donorName || "Anonymous donor",
    initials: initials(donation.donorName || "Anonymous"),
    email: donation.donorEmail || "",
    amount: Number(donation.amount || 0),
    date: new Date(donation.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    status: donation.status || "Completed",
  }));

  res.json({
    metrics,
    focus: db.dashboard?.focus || null,
    operationsPulse: db.dashboard?.operationsPulse || { updates: [], nextSession: null },
    recentDonations,
  });
});

app.get("/api/admin/donations", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(sortByCreatedAtDesc(db.donations || []));
});

app.get("/api/admin/donations/analytics", requireAdmin, async (req, res) => {
  const db = await readDb();
  const start = req.query.start;
  const end = req.query.end;
  const { totalAmount, totalCount, inRange } = summarizeDonations(db.donations || [], start, end);
  const daily = buildDailyTotals(db.donations || [], start, end);
  res.json({
    totalAmount,
    totalCount,
    periodAmount: totalAmount,
    daily,
  });
});

app.get("/api/admin/donations/by-source", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(computeSourceBreakdown(db.donations || []));
});

app.get("/api/admin/donations/status-breakdown", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(computeStatusBreakdown(db.donations || []));
});

app.get("/api/admin/donations/commitments", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.dashboard?.donationCommitments || []);
});

app.get("/api/admin/donations/export", requireAdmin, async (req, res) => {
  const db = await readDb();
  const format = String(req.query.format || "csv").toLowerCase();
  const donations = db.donations || [];
  const header = [
    "id",
    "amount",
    "currency",
    "donorName",
    "donorEmail",
    "source",
    "campaignId",
    "category",
    "status",
    "createdAt",
  ];
  const rows = donations.map(donation => [
    donation.id,
    donation.amount,
    donation.currency,
    donation.donorName || "",
    donation.donorEmail || "",
    donation.source || "",
    donation.campaignId || "",
    donation.category || "",
    donation.status || "",
    donation.createdAt,
  ]);
  const csv = [header.join(","), ...rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))].join("\n");

  const extension = format === "xlsx" ? "xlsx" : format === "pdf" ? "pdf" : "csv";
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=donations-report.${extension}`);
  res.send(csv);
});

app.get("/api/admin/programs", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.programs || []);
});

app.get("/api/admin/messages", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(sortByCreatedAtDesc(db.messages || []));
});

app.get("/api/admin/messages/insights", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json({
    sla: db.dashboard?.messageSla || [],
    tips: db.dashboard?.messageTips || [],
  });
});

app.get("/api/admin/users", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.users || []);
});

app.get("/api/admin/content/sections", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.contentSections || []);
});

app.get("/api/admin/campaigns", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.campaigns || []);
});

app.get("/api/admin/stories", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.stories || []);
});

app.put("/api/admin/content/sections/:id", requireAdmin, async (req, res) => {
  const db = await readDb();
  const sections = db.contentSections || [];
  const idx = sections.findIndex(section => section.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Section not found" });
    return;
  }
  const updates = req.body || {};
  const updated = {
    ...sections[idx],
    ...updates,
    fields: updates.fields || sections[idx].fields,
  };
  sections[idx] = updated;
  db.contentSections = sections;
  await writeDb(db);
  res.json(updated);
});

app.get("/api/admin/settings", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json(db.settings || {});
});

app.put("/api/admin/settings/:section", requireAdmin, async (req, res) => {
  const db = await readDb();
  const section = req.params.section;
  if (!db.settings || !Object.prototype.hasOwnProperty.call(db.settings, section)) {
    res.status(404).json({ error: "Settings section not found" });
    return;
  }
  db.settings[section] = { ...db.settings[section], ...req.body };
  await writeDb(db);
  res.json(db.settings[section]);
});

app.get("/api/admin/analytics/overview", requireAdmin, async (_req, res) => {
  const db = await readDb();
  res.json({
    programReach: db.dashboard?.analytics?.programReach || [],
    volunteerGrowth: db.dashboard?.analytics?.volunteerGrowth || [],
    channelMix: db.dashboard?.analytics?.channelMix || [],
  });
});

app.post("/api/admin/campaigns", requireAdmin, async (req, res) => {
  const db = await readDb();
  const campaigns = db.campaigns || [];
  const nextId = (campaigns || []).reduce((max, c) => Math.max(max, Number(c.id) || 0), 0) + 1;
  const payload = req.body || {};
  const campaign = {
    id: String(nextId),
    ...payload,
  };
  db.campaigns = [...campaigns, campaign];
  await writeDb(db);
  res.status(201).json(campaign);
});

app.put("/api/admin/campaigns/:id", requireAdmin, async (req, res) => {
  const db = await readDb();
  const campaigns = db.campaigns || [];
  const idx = campaigns.findIndex(c => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  campaigns[idx] = { ...campaigns[idx], ...req.body };
  db.campaigns = campaigns;
  await writeDb(db);
  res.json(campaigns[idx]);
});

app.delete("/api/admin/campaigns/:id", requireAdmin, async (req, res) => {
  const db = await readDb();
  db.campaigns = (db.campaigns || []).filter(c => c.id !== req.params.id);
  await writeDb(db);
  res.status(204).send();
});

app.post("/api/admin/stories", requireAdmin, async (req, res) => {
  const db = await readDb();
  const stories = db.stories || [];
  const nextId = `s${stories.length + 1}`;
  const story = { id: nextId, ...req.body };
  db.stories = [...stories, story];
  await writeDb(db);
  res.status(201).json(story);
});

app.put("/api/admin/stories/:id", requireAdmin, async (req, res) => {
  const db = await readDb();
  const stories = db.stories || [];
  const idx = stories.findIndex(s => s.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Story not found" });
    return;
  }
  stories[idx] = { ...stories[idx], ...req.body };
  db.stories = stories;
  await writeDb(db);
  res.json(stories[idx]);
});

app.delete("/api/admin/stories/:id", requireAdmin, async (req, res) => {
  const db = await readDb();
  db.stories = (db.stories || []).filter(s => s.id !== req.params.id);
  await writeDb(db);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Giving Her E.V.E API running on http://localhost:${PORT}`);
});
