import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env"), quiet: true });

const app = express();
const parsedPort = Number.parseInt(String(process.env.PORT || "8080"), 10);
const PORT = Number.isNaN(parsedPort) ? 8080 : parsedPort;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev-admin-token";
const DATABASE_URL = process.env.DATABASE_URL?.trim() || "";
const shouldUseSSL =
  process.env.DATABASE_SSL === "true" ||
  DATABASE_URL.includes("supabase.co") ||
  DATABASE_URL.includes("supabase.com");
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim() || "";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY?.trim() || "";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim() || "";
const CLOUDINARY_UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "giving-her-eve";
const parsedUploadLimitMb = Number.parseInt(String(process.env.UPLOAD_MAX_FILE_SIZE_MB || "10"), 10);
const MAX_UPLOAD_FILE_SIZE_BYTES = Number.isFinite(parsedUploadLimitMb) && parsedUploadLimitMb > 0
  ? parsedUploadLimitMb * 1024 * 1024
  : 10 * 1024 * 1024;
const defaultAllowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
const configuredAllowedMimeTypes = (process.env.UPLOAD_ALLOWED_IMAGE_TYPES || defaultAllowedImageMimeTypes.join(","))
  .split(",")
  .map(value => value.trim().toLowerCase())
  .filter(Boolean);
const ALLOWED_IMAGE_MIME_TYPES = new Set(
  configuredAllowedMimeTypes.length > 0 ? configuredAllowedMimeTypes : defaultAllowedImageMimeTypes,
);
const isCloudinaryConfigured = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
    })
  : null;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_FILE_SIZE_BYTES,
  },
});

const CAMPAIGN_COLUMNS = `
  id,
  slug,
  label,
  title,
  short_description,
  description,
  image,
  raised,
  goal,
  location,
  category,
  status,
  start_date,
  end_date
`;

const STORY_COLUMNS = `
  id,
  title,
  excerpt,
  content,
  image_url,
  gallery_images,
  status,
  campaign_id
`;

const DONATION_COLUMNS = `
  id,
  amount,
  currency,
  donor_name,
  donor_email,
  source,
  campaign_id,
  category,
  status,
  created_at
`;

const MESSAGE_COLUMNS = `
  id,
  name,
  email,
  type,
  preview,
  message,
  status,
  created_at
`;

const CONTENT_SECTION_COLUMNS = `
  id,
  name,
  description,
  status,
  fields
`;

const ALBUM_COLUMNS = `
  id,
  name,
  slug,
  description,
  status,
  cover_image_url,
  created_at,
  updated_at
`;

const PHOTO_COLUMNS = `
  id,
  album_id,
  title,
  description,
  image_url,
  cloudinary_public_id,
  mime_type,
  bytes,
  width,
  height,
  created_at
`;

const TEAM_MEMBER_COLUMNS = `
  id,
  name,
  role,
  photo,
  sort_order,
  created_at,
  updated_at
`;

const REQUIRED_SCHEMA_TABLES = [
  "campaigns",
  "stories",
  "testimonials",
  "faqs",
  "settings",
];

function buildErrorDetails(error) {
  if (!error || typeof error !== "object") return { message: String(error) };
  return {
    message: error.message || "Unknown error",
    name: error.name || "Error",
  };
}

function log(level, event, meta = {}) {
  const entry = {
    time: new Date().toISOString(),
    level,
    event,
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
    return;
  }
  console.log(line);
}

function logChange(entity, action, details = {}) {
  log("info", "db.change", {
    entity,
    action,
    ...details,
  });
}

function changedFields(before, after) {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  return [...keys].filter(key => JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key]));
}

function normalizeDateOnly(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function toISOStringOrNull(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function sanitizeFolderSegment(value) {
  return slugify(value).replace(/[^a-z0-9/-]/g, "");
}

function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: CLOUDINARY_UPLOAD_FOLDER,
        overwrite: false,
        unique_filename: true,
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

async function dbQuery(text, params = []) {
  if (!pool) {
    const error = new Error("DATABASE_URL is required to use PostgreSQL-backed APIs");
    log("error", "db.query.failed", {
      ...buildErrorDetails(error),
      sql: text.replace(/\s+/g, " ").trim().slice(0, 180),
      paramsCount: params.length,
    });
    throw error;
  }

  try {
    return await pool.query(text, params);
  } catch (error) {
    log("error", "db.query.failed", {
      ...buildErrorDetails(error),
      sql: text.replace(/\s+/g, " ").trim().slice(0, 180),
      paramsCount: params.length,
    });
    throw error;
  }
}

async function verifyDbConnection() {
  const { rows } = await dbQuery(
    "SELECT current_database() AS database_name, current_user AS user_name",
  );
  log("info", "db.connection.success", {
    type: "postgres",
    database: rows[0]?.database_name || null,
    user: rows[0]?.user_name || null,
  });
}

async function verifyDbSchema() {
  const { rows } = await dbQuery(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name = ANY($1::text[])`,
    [REQUIRED_SCHEMA_TABLES],
  );

  const existing = new Set(rows.map(row => row.table_name));
  const missing = REQUIRED_SCHEMA_TABLES.filter(tableName => !existing.has(tableName));

  if (missing.length > 0) {
    const error = new Error(
      `Database schema is not initialized. Missing tables: ${missing.join(", ")}. Run: npm run db:setup`,
    );
    error.name = "SchemaNotReadyError";
    throw error;
  }

  log("info", "db.schema.ready", {
    requiredTables: REQUIRED_SCHEMA_TABLES.length,
  });
}

function isSchemaError(error) {
  if (!error || typeof error !== "object") return false;
  if (error.name === "SchemaNotReadyError") return true;
  return error.code === "42P01" || error.code === "42703";
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token && token === ADMIN_TOKEN) {
    return next();
  }
  log("info", "auth.unauthorized", {
    method: req.method,
    path: req.originalUrl,
  });
  res.status(401).json({ error: "Unauthorized" });
}

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
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
  const totalAmount = inRange.reduce((sum, donation) => sum + Number(donation.amount || 0), 0);
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

function computeDashboardMetrics(metricMeta, summary) {
  const meta = Array.isArray(metricMeta) ? metricMeta : [];
  return meta.map(metric => {
    let value = "0";
    if (metric.id === "totalUsers") value = summary.totalUsers.toLocaleString();
    if (metric.id === "donations") value = formatCurrency(summary.totalDonations);
    if (metric.id === "volunteers") value = summary.totalVolunteers.toLocaleString();
    if (metric.id === "openMessages") value = summary.openMessages.toLocaleString();

    return {
      ...metric,
      value,
    };
  });
}

function mapCampaignRow(row) {
  return {
    id: String(row.id),
    slug: row.slug || "",
    label: row.label || "",
    title: row.title || "",
    shortDescription: row.short_description || "",
    description: row.description || "",
    image: row.image || "",
    raised: Number(row.raised || 0),
    goal: Number(row.goal || 0),
    location: row.location || "",
    category: row.category || "",
    status: row.status || "Draft",
    startDate: normalizeDateOnly(row.start_date),
    endDate: normalizeDateOnly(row.end_date),
  };
}

function mapStoryRow(row) {
  return {
    id: String(row.id),
    title: row.title || "",
    excerpt: row.excerpt || "",
    content: row.content || "",
    imageUrl: row.image_url || "",
    galleryImages: Array.isArray(row.gallery_images)
      ? row.gallery_images.filter(value => typeof value === "string").map(value => value.trim()).filter(Boolean)
      : [],
    status: row.status || "Draft",
    campaignId: row.campaign_id || null,
  };
}

function mapTestimonialRow(row) {
  return {
    id: String(row.id),
    quote: row.quote || "",
    name: row.name || "",
    role: row.role || "",
    avatar: row.avatar || "",
    status: row.status || "Draft",
  };
}

function mapFaqRow(row) {
  return {
    id: String(row.id),
    question: row.question || "",
    answer: row.answer || "",
    status: row.status || "Draft",
  };
}

function mapDonationRow(row) {
  return {
    id: Number(row.id),
    amount: Number(row.amount || 0),
    currency: row.currency || "USD",
    donorName: row.donor_name || null,
    donorEmail: row.donor_email || null,
    source: row.source || "Website",
    campaignId: row.campaign_id || null,
    category: row.category || "General",
    status: row.status || "Completed",
    createdAt: toISOStringOrNull(row.created_at) || new Date().toISOString(),
  };
}

function mapProgramRow(row) {
  return {
    id: String(row.id),
    name: row.name || "",
    category: row.category || "",
    description: row.description || "",
    timeline: row.timeline || "",
    beneficiaries: row.beneficiaries || "",
    location: row.location || "",
    progress: Number(row.progress || 0),
    status: row.status || "Planning",
  };
}

function mapMessageRow(row) {
  return {
    id: String(row.id),
    name: row.name || "",
    email: row.email || "",
    type: row.type || "General",
    preview: row.preview || "",
    message: row.message || "",
    status: row.status || "New",
    createdAt: toISOStringOrNull(row.created_at) || new Date().toISOString(),
  };
}

function mapUserRow(row) {
  return {
    id: String(row.id),
    name: row.name || "",
    initials: row.initials || initials(row.name || ""),
    role: row.role || "Donor",
    email: row.email || "",
    phone: row.phone || "",
    status: row.status || "Pending",
    joined: row.joined || "",
    verified: Boolean(row.verified),
  };
}

function mapContentSectionRow(row) {
  return {
    id: String(row.id),
    name: row.name || "",
    description: row.description || "",
    status: row.status || "Draft",
    fields: Array.isArray(row.fields) ? row.fields : [],
  };
}

function mapAlbumRow(row) {
  return {
    id: String(row.id),
    name: row.name || "",
    slug: row.slug || "",
    description: row.description || "",
    status: row.status || "Draft",
    coverImageUrl: row.cover_image_url || "",
    photoCount: Number(row.photo_count || 0),
    createdAt: toISOStringOrNull(row.created_at),
    updatedAt: toISOStringOrNull(row.updated_at),
  };
}

function mapPhotoRow(row) {
  return {
    id: Number(row.id),
    albumId: row.album_id || null,
    title: row.title || "",
    description: row.description || "",
    imageUrl: row.image_url || "",
    cloudinaryPublicId: row.cloudinary_public_id || "",
    mimeType: row.mime_type || "",
    bytes: Number(row.bytes || 0),
    width: Number(row.width || 0),
    height: Number(row.height || 0),
    createdAt: toISOStringOrNull(row.created_at) || new Date().toISOString(),
  };
}

function mapTeamMemberRow(row) {
  return {
    id: String(row.id),
    name: row.name || "",
    role: row.role || "",
    photo: row.photo || "",
    sortOrder: Number(row.sort_order || 0),
    createdAt: toISOStringOrNull(row.created_at),
    updatedAt: toISOStringOrNull(row.updated_at),
  };
}

function normalizeTeamSettingItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index) => {
      if (!isPlainObject(item)) return null;
      const name = typeof item.name === "string" ? item.name.trim() : "";
      const role = typeof item.role === "string" ? item.role.trim() : "";
      if (!name || !role) return null;
      return {
        id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `team-${index + 1}`,
        name,
        role,
        photo: typeof item.photo === "string" ? item.photo.trim() : "",
      };
    })
    .filter(Boolean);
}

async function getTeamMembers() {
  try {
    const { rows } = await dbQuery(
      `SELECT ${TEAM_MEMBER_COLUMNS}
       FROM team_members
       ORDER BY sort_order ASC, created_at ASC`,
    );
    if (rows.length > 0) {
      return rows.map(mapTeamMemberRow);
    }
  } catch (error) {
    if (error?.code !== "42P01") throw error;
  }

  const legacyTeam = await getSettingData("team");
  return normalizeTeamSettingItems(legacyTeam?.items);
}

async function getSettingsObject() {
  const { rows } = await dbQuery("SELECT section, data FROM settings");
  const settings = {};
  for (const row of rows) {
    settings[row.section] = row.data || {};
  }
  return settings;
}

async function getSettingData(section) {
  const { rows } = await dbQuery("SELECT data FROM settings WHERE section = $1 LIMIT 1", [section]);
  return rows[0]?.data || null;
}

async function getDashboardRow() {
  const { rows } = await dbQuery(
    `SELECT focus, operations_pulse, donation_commitments, message_sla, message_tips, analytics, metric_meta
     FROM dashboard
     WHERE id = 'singleton'
     LIMIT 1`,
  );
  return rows[0] || null;
}

async function nextCampaignId() {
  const { rows } = await dbQuery(
    "SELECT COALESCE(MAX((id)::INTEGER), 0) + 1 AS next_id FROM campaigns WHERE id ~ '^[0-9]+$'",
  );
  return String(Number(rows[0]?.next_id || 1));
}

async function nextStoryId() {
  const { rows } = await dbQuery(
    "SELECT COALESCE(MAX((SUBSTRING(id FROM 2))::INTEGER), 0) + 1 AS next_id FROM stories WHERE id ~* '^s[0-9]+$'",
  );
  return `s${Number(rows[0]?.next_id || 1)}`;
}

async function nextAlbumId() {
  const { rows } = await dbQuery(
    "SELECT COALESCE(MAX((SUBSTRING(id FROM 2))::INTEGER), 0) + 1 AS next_id FROM albums WHERE id ~* '^a[0-9]+$'",
  );
  return `a${Number(rows[0]?.next_id || 1)}`;
}

async function nextTeamMemberId() {
  const { rows } = await dbQuery(
    "SELECT COALESCE(MAX((SUBSTRING(id FROM 6))::INTEGER), 0) + 1 AS next_id FROM team_members WHERE id ~* '^team-[0-9]+$'",
  );
  return `team-${Number(rows[0]?.next_id || 1)}`;
}

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  const startedAt = Date.now();
  log("info", "api.request.start", {
    method: req.method,
    path: req.originalUrl,
  });

  res.on("finish", () => {
    log("info", "api.request.finish", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
});

app.get("/health", asyncRoute(async (_req, res) => {
  await dbQuery("SELECT 1");
  res.json({ ok: true });
}));

// Public APIs
app.get("/api/campaigns", asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT ${CAMPAIGN_COLUMNS}
     FROM campaigns
     WHERE COALESCE(status, '') <> 'Draft'`,
  );
  res.json(rows.map(mapCampaignRow));
}));

app.get("/api/campaigns/active", asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT ${CAMPAIGN_COLUMNS}
     FROM campaigns
     WHERE status = 'Active'`,
  );
  res.json(rows.map(mapCampaignRow));
}));

app.get("/api/campaigns/:id", asyncRoute(async (req, res) => {
  const { rows } = await dbQuery(
    `SELECT ${CAMPAIGN_COLUMNS}
     FROM campaigns
     WHERE id = $1 AND COALESCE(status, '') <> 'Draft'
     LIMIT 1`,
    [req.params.id],
  );

  if (rows.length === 0) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  res.json(mapCampaignRow(rows[0]));
}));

app.get("/api/stories", asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT ${STORY_COLUMNS}
     FROM stories
     WHERE status = 'Published'`,
  );
  res.json(rows.map(mapStoryRow));
}));

app.get("/api/gallery/albums", asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT
        a.id,
        a.name,
        a.slug,
        a.description,
        a.status,
        a.cover_image_url,
        a.created_at,
        a.updated_at,
        COALESCE(COUNT(p.id), 0)::int AS photo_count
     FROM albums a
     LEFT JOIN photos p ON p.album_id = a.id
     WHERE COALESCE(a.status, '') <> 'Draft'
     GROUP BY a.id, a.name, a.slug, a.description, a.status, a.cover_image_url, a.created_at, a.updated_at
     ORDER BY a.created_at DESC`,
  );
  res.json(rows.map(mapAlbumRow));
}));

app.get("/api/gallery/photos", asyncRoute(async (req, res) => {
  const albumId = typeof req.query.albumId === "string" ? req.query.albumId.trim() : "";

  if (albumId) {
    const albumRes = await dbQuery(
      `SELECT id
       FROM albums
       WHERE id = $1 AND COALESCE(status, '') <> 'Draft'
       LIMIT 1`,
      [albumId],
    );
    if (albumRes.rows.length === 0) {
      res.status(404).json({ error: "Album not found" });
      return;
    }
  }

  const params = [];
  let whereClause = "WHERE p.album_id IS NOT NULL AND COALESCE(a.status, '') <> 'Draft'";
  if (albumId) {
    params.push(albumId);
    whereClause += " AND p.album_id = $1";
  }

  const { rows } = await dbQuery(
    `SELECT
        p.id,
        p.album_id,
        p.title,
        p.description,
        p.image_url,
        p.cloudinary_public_id,
        p.mime_type,
        p.bytes,
        p.width,
        p.height,
        p.created_at
     FROM photos p
     LEFT JOIN albums a ON p.album_id = a.id
     ${whereClause}
     ORDER BY p.created_at DESC`,
    params,
  );
  res.json(rows.map(mapPhotoRow));
}));

app.get("/api/organization", asyncRoute(async (_req, res) => {
  const organization = await getSettingData("organization");
  res.json(organization || {});
}));

app.get("/api/sponsors", asyncRoute(async (_req, res) => {
  const sponsors = await getSettingData("sponsors");
  res.json(sponsors?.items || []);
}));

app.get("/api/team", asyncRoute(async (_req, res) => {
  const teamMembers = await getTeamMembers();
  res.json(teamMembers);
}));

app.get("/api/testimonials", asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT id, quote, name, role, avatar, status
     FROM testimonials
     WHERE status = 'Published'`,
  );
  res.json(rows.map(mapTestimonialRow));
}));

app.get("/api/faqs", asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT id, question, answer, status
     FROM faqs
     WHERE status = 'Published'`,
  );
  res.json(rows.map(mapFaqRow));
}));

app.post("/api/donations", asyncRoute(async (req, res) => {
  const payload = isPlainObject(req.body) ? req.body : {};
  const { amount, currency, donorName, donorEmail, source, campaignId, category } = payload;
  const normalizedAmount = Number(amount);

  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    res.status(400).json({ error: "Donation amount must be greater than 0" });
    return;
  }

  const { rows } = await dbQuery(
    `INSERT INTO donations (
      amount,
      currency,
      donor_name,
      donor_email,
      source,
      campaign_id,
      category,
      status,
      created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING ${DONATION_COLUMNS}`,
    [
      normalizedAmount,
      currency || "USD",
      donorName || null,
      donorEmail || null,
      source || "Website",
      campaignId || null,
      category || "General",
      "Completed",
      new Date().toISOString(),
    ],
  );

  const newDonation = mapDonationRow(rows[0]);
  logChange("donation", "created", {
    id: newDonation.id,
    amount: newDonation.amount,
    campaignId: newDonation.campaignId,
    status: newDonation.status,
  });

  res.status(201).json(newDonation);
}));

// Admin APIs
app.get("/api/admin/dashboard", requireAdmin, asyncRoute(async (_req, res) => {
  const [dashboardRow, donationTotalsRes, userTotalsRes, openMessagesRes, recentDonationsRes] = await Promise.all([
    getDashboardRow(),
    dbQuery("SELECT COALESCE(SUM(amount), 0) AS total_amount FROM donations"),
    dbQuery(
      `SELECT
        COUNT(*)::int AS total_users,
        COUNT(*) FILTER (WHERE role = 'Volunteer')::int AS total_volunteers
       FROM users`,
    ),
    dbQuery("SELECT COUNT(*)::int AS open_messages FROM messages WHERE status IS DISTINCT FROM 'Resolved'"),
    dbQuery(
      `SELECT ${DONATION_COLUMNS}
       FROM donations
       ORDER BY created_at DESC
       LIMIT 4`,
    ),
  ]);

  const totalDonations = Number(donationTotalsRes.rows[0]?.total_amount || 0);
  const totalUsers = Number(userTotalsRes.rows[0]?.total_users || 0);
  const totalVolunteers = Number(userTotalsRes.rows[0]?.total_volunteers || 0);
  const openMessages = Number(openMessagesRes.rows[0]?.open_messages || 0);

  const metrics = computeDashboardMetrics(dashboardRow?.metric_meta || [], {
    totalDonations,
    totalUsers,
    totalVolunteers,
    openMessages,
  });

  const recentDonations = recentDonationsRes.rows.map(mapDonationRow).map(donation => ({
    id: String(donation.id),
    donor: donation.donorName || "Anonymous donor",
    initials: initials(donation.donorName || "Anonymous"),
    email: donation.donorEmail || "",
    amount: Number(donation.amount || 0),
    date: new Date(donation.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    status: donation.status || "Completed",
  }));

  res.json({
    metrics,
    focus: dashboardRow?.focus || null,
    operationsPulse: dashboardRow?.operations_pulse || { updates: [], nextSession: null },
    recentDonations,
  });
}));

app.get("/api/admin/donations", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT ${DONATION_COLUMNS}
     FROM donations
     ORDER BY created_at DESC`,
  );
  res.json(rows.map(mapDonationRow));
}));

app.get("/api/admin/donations/analytics", requireAdmin, asyncRoute(async (req, res) => {
  const start = req.query.start;
  const end = req.query.end;

  const { rows } = await dbQuery(
    `SELECT ${DONATION_COLUMNS}
     FROM donations
     ORDER BY created_at DESC`,
  );

  const donations = rows.map(mapDonationRow);
  const { totalAmount, totalCount } = summarizeDonations(donations, start, end);
  const daily = buildDailyTotals(donations, start, end);

  res.json({
    totalAmount,
    totalCount,
    periodAmount: totalAmount,
    daily,
  });
}));

app.get("/api/admin/donations/by-source", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT ${DONATION_COLUMNS}
     FROM donations`,
  );
  const donations = rows.map(mapDonationRow);
  res.json(computeSourceBreakdown(donations));
}));

app.get("/api/admin/donations/status-breakdown", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT ${DONATION_COLUMNS}
     FROM donations`,
  );
  const donations = rows.map(mapDonationRow);
  res.json(computeStatusBreakdown(donations));
}));

app.get("/api/admin/donations/commitments", requireAdmin, asyncRoute(async (_req, res) => {
  const dashboardRow = await getDashboardRow();
  res.json(dashboardRow?.donation_commitments || []);
}));

app.get("/api/admin/donations/export", requireAdmin, asyncRoute(async (req, res) => {
  const format = String(req.query.format || "csv").toLowerCase();
  const { rows } = await dbQuery(
    `SELECT ${DONATION_COLUMNS}
     FROM donations
     ORDER BY created_at DESC`,
  );
  const donations = rows.map(mapDonationRow);

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

  const csvRows = donations.map(donation => [
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

  const csv = [
    header.join(","),
    ...csvRows.map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  const extension = format === "xlsx" ? "xlsx" : format === "pdf" ? "pdf" : "csv";
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=donations-report.${extension}`);
  res.send(csv);
}));

app.get("/api/admin/programs", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT id, name, category, description, timeline, beneficiaries, location, progress, status
     FROM programs`,
  );
  res.json(rows.map(mapProgramRow));
}));

app.get("/api/admin/messages", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT ${MESSAGE_COLUMNS}
     FROM messages
     ORDER BY created_at DESC`,
  );
  res.json(rows.map(mapMessageRow));
}));

app.get("/api/admin/messages/insights", requireAdmin, asyncRoute(async (_req, res) => {
  const dashboardRow = await getDashboardRow();
  res.json({
    sla: dashboardRow?.message_sla || [],
    tips: dashboardRow?.message_tips || [],
  });
}));

app.get("/api/admin/users", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT id, name, initials, role, email, phone, status, joined, verified
     FROM users`,
  );
  res.json(rows.map(mapUserRow));
}));

app.get("/api/admin/content/sections", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(`SELECT ${CONTENT_SECTION_COLUMNS} FROM content_sections`);
  res.json(rows.map(mapContentSectionRow));
}));

app.get("/api/admin/team", requireAdmin, asyncRoute(async (_req, res) => {
  const teamMembers = await getTeamMembers();
  res.json(teamMembers);
}));

app.post("/api/admin/team", requireAdmin, asyncRoute(async (req, res) => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid team member payload" });
    return;
  }

  const payload = req.body;
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const role = typeof payload.role === "string" ? payload.role.trim() : "";
  const photo = typeof payload.photo === "string" ? payload.photo.trim() : "";

  if (!name) {
    res.status(400).json({ error: "Team member name is required" });
    return;
  }
  if (!role) {
    res.status(400).json({ error: "Team member role is required" });
    return;
  }

  const sortOrderInput = Number(payload.sortOrder);
  let sortOrder = Number.isFinite(sortOrderInput) ? sortOrderInput : null;
  if (sortOrder === null) {
    const nextOrderRes = await dbQuery(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM team_members",
    );
    sortOrder = Number(nextOrderRes.rows[0]?.next_order || 0);
  }

  const teamMemberId = await nextTeamMemberId();
  const createdRes = await dbQuery(
    `INSERT INTO team_members (
      id,
      name,
      role,
      photo,
      sort_order,
      created_at,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
    RETURNING ${TEAM_MEMBER_COLUMNS}`,
    [
      teamMemberId,
      name,
      role,
      photo || null,
      sortOrder,
    ],
  );

  const teamMember = mapTeamMemberRow(createdRes.rows[0]);
  logChange("team_member", "created", {
    id: teamMember.id,
    name: teamMember.name,
    role: teamMember.role,
  });

  res.status(201).json(teamMember);
}));

app.put("/api/admin/team/:id", requireAdmin, asyncRoute(async (req, res) => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid team member update payload" });
    return;
  }

  const existingRes = await dbQuery(
    `SELECT ${TEAM_MEMBER_COLUMNS}
     FROM team_members
     WHERE id = $1
     LIMIT 1`,
    [req.params.id],
  );

  if (existingRes.rows.length === 0) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }

  const before = mapTeamMemberRow(existingRes.rows[0]);
  const updates = req.body;
  const name = typeof (updates.name ?? before.name) === "string"
    ? String(updates.name ?? before.name).trim()
    : "";
  const role = typeof (updates.role ?? before.role) === "string"
    ? String(updates.role ?? before.role).trim()
    : "";
  const photo = typeof (updates.photo ?? before.photo) === "string"
    ? String(updates.photo ?? before.photo).trim()
    : "";
  const sortOrderInput = Number(updates.sortOrder);
  const sortOrder = Number.isFinite(sortOrderInput) ? sortOrderInput : Number(before.sortOrder || 0);

  if (!name) {
    res.status(400).json({ error: "Team member name is required" });
    return;
  }
  if (!role) {
    res.status(400).json({ error: "Team member role is required" });
    return;
  }

  const updatedRes = await dbQuery(
    `UPDATE team_members
     SET name = $2,
         role = $3,
         photo = $4,
         sort_order = $5,
         updated_at = NOW()
     WHERE id = $1
     RETURNING ${TEAM_MEMBER_COLUMNS}`,
    [
      before.id,
      name,
      role,
      photo || null,
      sortOrder,
    ],
  );

  const updated = mapTeamMemberRow(updatedRes.rows[0]);
  logChange("team_member", "updated", {
    id: updated.id,
    changedFields: changedFields(before, updated),
  });

  res.json(updated);
}));

app.delete("/api/admin/team/:id", requireAdmin, asyncRoute(async (req, res) => {
  const deletedRes = await dbQuery(
    `DELETE FROM team_members
     WHERE id = $1
     RETURNING ${TEAM_MEMBER_COLUMNS}`,
    [req.params.id],
  );

  if (deletedRes.rows.length === 0) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }

  const deleted = mapTeamMemberRow(deletedRes.rows[0]);
  logChange("team_member", "deleted", {
    id: deleted.id,
    name: deleted.name || null,
  });

  res.status(204).send();
}));

app.get("/api/admin/campaigns", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(`SELECT ${CAMPAIGN_COLUMNS} FROM campaigns`);
  res.json(rows.map(mapCampaignRow));
}));

app.get("/api/admin/stories", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(`SELECT ${STORY_COLUMNS} FROM stories`);
  res.json(rows.map(mapStoryRow));
}));

app.get("/api/admin/albums", requireAdmin, asyncRoute(async (_req, res) => {
  const { rows } = await dbQuery(
    `SELECT
        a.id,
        a.name,
        a.slug,
        a.description,
        a.status,
        a.cover_image_url,
        a.created_at,
        a.updated_at,
        COALESCE(COUNT(p.id), 0)::int AS photo_count
     FROM albums a
     LEFT JOIN photos p ON p.album_id = a.id
     GROUP BY a.id, a.name, a.slug, a.description, a.status, a.cover_image_url, a.created_at, a.updated_at
     ORDER BY a.created_at DESC`,
  );
  res.json(rows.map(mapAlbumRow));
}));

app.post("/api/admin/albums", requireAdmin, asyncRoute(async (req, res) => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid album payload" });
    return;
  }

  const payload = req.body;
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  if (!name) {
    res.status(400).json({ error: "Album name is required" });
    return;
  }

  const slug = slugify(payload.slug || name);
  if (!slug) {
    res.status(400).json({ error: "Album slug is required" });
    return;
  }

  const existingSlugRes = await dbQuery(
    "SELECT id FROM albums WHERE slug = $1 LIMIT 1",
    [slug],
  );
  if (existingSlugRes.rows.length > 0) {
    res.status(409).json({ error: "An album with this slug already exists" });
    return;
  }

  const albumId = await nextAlbumId();
  const createdRes = await dbQuery(
    `INSERT INTO albums (
      id,
      name,
      slug,
      description,
      status,
      cover_image_url,
      created_at,
      updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
    RETURNING ${ALBUM_COLUMNS}`,
    [
      albumId,
      name,
      slug,
      payload.description || null,
      payload.status || "Draft",
      payload.coverImageUrl || null,
    ],
  );

  const album = mapAlbumRow(createdRes.rows[0]);
  logChange("album", "created", {
    id: album.id,
    name: album.name,
    status: album.status,
  });

  res.status(201).json(album);
}));

app.put("/api/admin/albums/:id", requireAdmin, asyncRoute(async (req, res) => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid album update payload" });
    return;
  }

  const existingRes = await dbQuery(
    `SELECT ${ALBUM_COLUMNS}
     FROM albums
     WHERE id = $1
     LIMIT 1`,
    [req.params.id],
  );
  if (existingRes.rows.length === 0) {
    res.status(404).json({ error: "Album not found" });
    return;
  }

  const before = mapAlbumRow(existingRes.rows[0]);
  const updates = req.body;
  const mergedName = typeof (updates.name ?? before.name) === "string"
    ? String(updates.name ?? before.name).trim()
    : "";
  if (!mergedName) {
    res.status(400).json({ error: "Album name is required" });
    return;
  }

  const mergedSlug = slugify(updates.slug || before.slug || mergedName);
  if (!mergedSlug) {
    res.status(400).json({ error: "Album slug is required" });
    return;
  }

  const duplicateSlugRes = await dbQuery(
    "SELECT id FROM albums WHERE slug = $1 AND id <> $2 LIMIT 1",
    [mergedSlug, before.id],
  );
  if (duplicateSlugRes.rows.length > 0) {
    res.status(409).json({ error: "An album with this slug already exists" });
    return;
  }

  const updatedRes = await dbQuery(
    `UPDATE albums
     SET name = $2,
         slug = $3,
         description = $4,
         status = $5,
         cover_image_url = $6,
         updated_at = NOW()
     WHERE id = $1
     RETURNING ${ALBUM_COLUMNS}`,
    [
      before.id,
      mergedName,
      mergedSlug,
      updates.description ?? before.description ?? null,
      updates.status ?? before.status ?? "Draft",
      updates.coverImageUrl ?? before.coverImageUrl ?? null,
    ],
  );

  const updated = mapAlbumRow(updatedRes.rows[0]);
  logChange("album", "updated", {
    id: updated.id,
    changedFields: changedFields(before, updated),
  });

  res.json(updated);
}));

app.delete("/api/admin/albums/:id", requireAdmin, asyncRoute(async (req, res) => {
  const deletedRes = await dbQuery(
    `DELETE FROM albums
     WHERE id = $1
     RETURNING ${ALBUM_COLUMNS}`,
    [req.params.id],
  );
  if (deletedRes.rows.length === 0) {
    res.status(404).json({ error: "Album not found" });
    return;
  }

  const deleted = mapAlbumRow(deletedRes.rows[0]);
  logChange("album", "deleted", {
    id: deleted.id,
    name: deleted.name || null,
  });

  res.status(204).send();
}));

app.get("/api/admin/photos", requireAdmin, asyncRoute(async (req, res) => {
  const albumId = typeof req.query.albumId === "string" ? req.query.albumId.trim() : "";
  const params = [];
  let whereClause = "";
  if (albumId) {
    params.push(albumId);
    whereClause = "WHERE album_id = $1";
  }

  const { rows } = await dbQuery(
    `SELECT ${PHOTO_COLUMNS}
     FROM photos
     ${whereClause}
     ORDER BY created_at DESC`,
    params,
  );
  res.json(rows.map(mapPhotoRow));
}));

app.post("/api/admin/uploads/photos", requireAdmin, upload.single("file"), asyncRoute(async (req, res) => {
  if (!isCloudinaryConfigured) {
    res.status(500).json({ error: "Cloudinary is not configured on the server" });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "Image file is required (field: file)" });
    return;
  }

  const mimeType = String(file.mimetype || "").toLowerCase();
  if (!ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
    res.status(400).json({ error: `Unsupported file type: ${mimeType || "unknown"}` });
    return;
  }

  const albumId = typeof req.body?.albumId === "string" ? req.body.albumId.trim() : "";
  const folder = typeof req.body?.folder === "string" ? sanitizeFolderSegment(req.body.folder) : "";
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const description = typeof req.body?.description === "string" ? req.body.description.trim() : "";

  if (albumId) {
    const albumRes = await dbQuery("SELECT id FROM albums WHERE id = $1 LIMIT 1", [albumId]);
    if (albumRes.rows.length === 0) {
      res.status(404).json({ error: "Album not found" });
      return;
    }
  }

  const albumFolderSegment = albumId ? `album-${sanitizeFolderSegment(albumId)}` : "";
  const folderParts = [CLOUDINARY_UPLOAD_FOLDER, folder, albumFolderSegment].filter(Boolean);
  const uploadResult = await uploadToCloudinary(file.buffer, {
    folder: folderParts.join("/"),
    tags: ["admin-upload", albumId ? `album-${sanitizeFolderSegment(albumId)}` : "general-assets"],
  });

  const { rows } = await dbQuery(
    `INSERT INTO photos (
      album_id,
      title,
      description,
      image_url,
      cloudinary_public_id,
      mime_type,
      bytes,
      width,
      height,
      created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
    RETURNING ${PHOTO_COLUMNS}`,
    [
      albumId || null,
      title || null,
      description || null,
      uploadResult.secure_url || uploadResult.url,
      uploadResult.public_id || null,
      mimeType || null,
      Number(uploadResult.bytes || file.size || 0),
      Number(uploadResult.width || 0),
      Number(uploadResult.height || 0),
    ],
  );

  if (albumId) {
    await dbQuery(
      `UPDATE albums
       SET cover_image_url = COALESCE(cover_image_url, $2),
           updated_at = NOW()
       WHERE id = $1`,
      [albumId, uploadResult.secure_url || uploadResult.url],
    );
  }

  const photo = mapPhotoRow(rows[0]);
  logChange("photo", "created", {
    id: photo.id,
    albumId: photo.albumId,
    cloudinaryPublicId: photo.cloudinaryPublicId || null,
  });

  res.status(201).json(photo);
}));

app.put("/api/admin/content/sections/:id", requireAdmin, asyncRoute(async (req, res) => {
  const { rows } = await dbQuery(
    `SELECT ${CONTENT_SECTION_COLUMNS}
     FROM content_sections
     WHERE id = $1
     LIMIT 1`,
    [req.params.id],
  );

  if (rows.length === 0) {
    res.status(404).json({ error: "Section not found" });
    return;
  }

  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid section update payload" });
    return;
  }

  const before = mapContentSectionRow(rows[0]);
  const updates = req.body;
  const merged = {
    ...before,
    ...updates,
    id: before.id,
    fields: Array.isArray(updates.fields) ? updates.fields : before.fields,
  };

  const updatedRes = await dbQuery(
    `UPDATE content_sections
     SET name = $2,
         description = $3,
         status = $4,
         fields = $5::jsonb
     WHERE id = $1
     RETURNING ${CONTENT_SECTION_COLUMNS}`,
    [
      merged.id,
      merged.name || null,
      merged.description || null,
      merged.status || null,
      JSON.stringify(merged.fields || []),
    ],
  );

  const updated = mapContentSectionRow(updatedRes.rows[0]);
  logChange("content_section", "updated", {
    id: updated.id,
    changedFields: changedFields(before, updated),
  });

  res.json(updated);
}));

app.get("/api/admin/settings", requireAdmin, asyncRoute(async (_req, res) => {
  const settings = await getSettingsObject();
  res.json(settings);
}));

app.put("/api/admin/settings/:section", requireAdmin, asyncRoute(async (req, res) => {
  const section = req.params.section;
  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid settings payload" });
    return;
  }

  const existingRes = await dbQuery(
    "SELECT data FROM settings WHERE section = $1 LIMIT 1",
    [section],
  );

  if (existingRes.rows.length === 0) {
    res.status(404).json({ error: "Settings section not found" });
    return;
  }

  const previous = existingRes.rows[0].data || {};
  const merged = { ...previous, ...req.body };

  const updatedRes = await dbQuery(
    "UPDATE settings SET data = $2::jsonb WHERE section = $1 RETURNING data",
    [section, JSON.stringify(merged)],
  );

  const updated = updatedRes.rows[0].data || {};
  logChange("settings", "updated", {
    section,
    changedFields: changedFields(previous, updated),
  });

  res.json(updated);
}));

app.get("/api/admin/analytics/overview", requireAdmin, asyncRoute(async (_req, res) => {
  const dashboardRow = await getDashboardRow();
  const analytics = dashboardRow?.analytics || {};

  res.json({
    programReach: analytics.programReach || [],
    volunteerGrowth: analytics.volunteerGrowth || [],
    channelMix: analytics.channelMix || [],
  });
}));

app.post("/api/admin/campaigns", requireAdmin, asyncRoute(async (req, res) => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid campaign payload" });
    return;
  }

  const { id: _ignoredId, ...payload } = req.body;
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  if (!title) {
    res.status(400).json({ error: "Campaign title is required" });
    return;
  }

  const campaignId = await nextCampaignId();
  const createdRes = await dbQuery(
    `INSERT INTO campaigns (
      id,
      slug,
      label,
      title,
      short_description,
      description,
      image,
      raised,
      goal,
      location,
      category,
      status,
      start_date,
      end_date
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING ${CAMPAIGN_COLUMNS}`,
    [
      campaignId,
      payload.slug || null,
      payload.label || null,
      title,
      payload.shortDescription || null,
      payload.description || null,
      payload.image || null,
      Number(payload.raised || 0),
      Number(payload.goal || 0),
      payload.location || null,
      payload.category || null,
      payload.status || "Draft",
      payload.startDate || null,
      payload.endDate || null,
    ],
  );

  const campaign = mapCampaignRow(createdRes.rows[0]);
  logChange("campaign", "created", {
    id: campaign.id,
    title: campaign.title,
    status: campaign.status || null,
  });

  res.status(201).json(campaign);
}));

app.put("/api/admin/campaigns/:id", requireAdmin, asyncRoute(async (req, res) => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid campaign update payload" });
    return;
  }

  const existingRes = await dbQuery(
    `SELECT ${CAMPAIGN_COLUMNS}
     FROM campaigns
     WHERE id = $1
     LIMIT 1`,
    [req.params.id],
  );

  if (existingRes.rows.length === 0) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  const before = mapCampaignRow(existingRes.rows[0]);
  const { id: _ignoredId, ...updates } = req.body;
  const merged = {
    ...before,
    ...updates,
    id: before.id,
    title: typeof (updates.title ?? before.title) === "string"
      ? String(updates.title ?? before.title).trim()
      : "",
  };

  if (!merged.title) {
    res.status(400).json({ error: "Campaign title is required" });
    return;
  }

  const updatedRes = await dbQuery(
    `UPDATE campaigns
     SET slug = $2,
         label = $3,
         title = $4,
         short_description = $5,
         description = $6,
         image = $7,
         raised = $8,
         goal = $9,
         location = $10,
         category = $11,
         status = $12,
         start_date = $13,
         end_date = $14
     WHERE id = $1
     RETURNING ${CAMPAIGN_COLUMNS}`,
    [
      merged.id,
      merged.slug || null,
      merged.label || null,
      merged.title,
      merged.shortDescription || null,
      merged.description || null,
      merged.image || null,
      Number(merged.raised || 0),
      Number(merged.goal || 0),
      merged.location || null,
      merged.category || null,
      merged.status || null,
      merged.startDate || null,
      merged.endDate || null,
    ],
  );

  const updated = mapCampaignRow(updatedRes.rows[0]);
  logChange("campaign", "updated", {
    id: updated.id,
    changedFields: changedFields(before, updated),
  });

  res.json(updated);
}));

app.delete("/api/admin/campaigns/:id", requireAdmin, asyncRoute(async (req, res) => {
  const deletedRes = await dbQuery(
    `DELETE FROM campaigns
     WHERE id = $1
     RETURNING ${CAMPAIGN_COLUMNS}`,
    [req.params.id],
  );

  if (deletedRes.rows.length === 0) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  const deleted = mapCampaignRow(deletedRes.rows[0]);
  logChange("campaign", "deleted", {
    id: deleted.id,
    title: deleted.title || null,
  });

  res.status(204).send();
}));

app.post("/api/admin/stories", requireAdmin, asyncRoute(async (req, res) => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid story payload" });
    return;
  }

  const { id: _ignoredId, ...payload } = req.body;
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const galleryImages = Array.isArray(payload.galleryImages)
    ? payload.galleryImages.filter(value => typeof value === "string").map(value => value.trim()).filter(Boolean)
    : [];
  if (!title) {
    res.status(400).json({ error: "Story title is required" });
    return;
  }

  const storyId = await nextStoryId();
  const createdRes = await dbQuery(
    `INSERT INTO stories (
      id,
      title,
      excerpt,
      content,
      image_url,
      gallery_images,
      status,
      campaign_id
    )
    VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8)
    RETURNING ${STORY_COLUMNS}`,
    [
      storyId,
      title,
      payload.excerpt || null,
      payload.content || null,
      payload.imageUrl || null,
      JSON.stringify(galleryImages),
      payload.status || "Draft",
      payload.campaignId || null,
    ],
  );

  const story = mapStoryRow(createdRes.rows[0]);
  logChange("story", "created", {
    id: story.id,
    title: story.title,
    status: story.status || null,
  });

  res.status(201).json(story);
}));

app.put("/api/admin/stories/:id", requireAdmin, asyncRoute(async (req, res) => {
  if (!isPlainObject(req.body)) {
    res.status(400).json({ error: "Invalid story update payload" });
    return;
  }

  const existingRes = await dbQuery(
    `SELECT ${STORY_COLUMNS}
     FROM stories
     WHERE id = $1
     LIMIT 1`,
    [req.params.id],
  );

  if (existingRes.rows.length === 0) {
    res.status(404).json({ error: "Story not found" });
    return;
  }

  const before = mapStoryRow(existingRes.rows[0]);
  const { id: _ignoredId, ...updates } = req.body;
  const merged = {
    ...before,
    ...updates,
    galleryImages: Array.isArray(updates.galleryImages)
      ? updates.galleryImages.filter(value => typeof value === "string").map(value => value.trim()).filter(Boolean)
      : before.galleryImages,
    id: before.id,
    title: typeof (updates.title ?? before.title) === "string"
      ? String(updates.title ?? before.title).trim()
      : "",
  };

  if (!merged.title) {
    res.status(400).json({ error: "Story title is required" });
    return;
  }

  const updatedRes = await dbQuery(
    `UPDATE stories
     SET title = $2,
         excerpt = $3,
         content = $4,
         image_url = $5,
         gallery_images = $6::jsonb,
         status = $7,
         campaign_id = $8
     WHERE id = $1
     RETURNING ${STORY_COLUMNS}`,
    [
      merged.id,
      merged.title,
      merged.excerpt || null,
      merged.content || null,
      merged.imageUrl || null,
      JSON.stringify(merged.galleryImages || []),
      merged.status || null,
      merged.campaignId || null,
    ],
  );

  const updated = mapStoryRow(updatedRes.rows[0]);
  logChange("story", "updated", {
    id: updated.id,
    changedFields: changedFields(before, updated),
  });

  res.json(updated);
}));

app.delete("/api/admin/stories/:id", requireAdmin, asyncRoute(async (req, res) => {
  const deletedRes = await dbQuery(
    `DELETE FROM stories
     WHERE id = $1
     RETURNING ${STORY_COLUMNS}`,
    [req.params.id],
  );

  if (deletedRes.rows.length === 0) {
    res.status(404).json({ error: "Story not found" });
    return;
  }

  const deleted = mapStoryRow(deletedRes.rows[0]);
  logChange("story", "deleted", {
    id: deleted.id,
    title: deleted.title || null,
  });

  res.status(204).send();
}));

app.use((error, req, res, _next) => {
  log("error", "api.request.failed", {
    method: req.method,
    path: req.originalUrl,
    ...buildErrorDetails(error),
  });

  if (res.headersSent) return;
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: `File exceeds ${Math.floor(MAX_UPLOAD_FILE_SIZE_BYTES / (1024 * 1024))}MB limit` });
      return;
    }
    res.status(400).json({ error: error.message || "Invalid upload request" });
    return;
  }

  if (isSchemaError(error)) {
    res.status(503).json({
      error: "Database schema is not initialized. Run `npm run db:setup` in the server directory.",
    });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
});

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  log("info", "server.shutdown", { signal });

  if (pool) {
    await pool.end();
  }

  process.exit(0);
}

async function startServer() {
  try {
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL is required");
    }

    await verifyDbConnection();
    await verifyDbSchema();
    const server = app.listen(PORT, () => {
      log("info", "server.started", {
        port: PORT,
        url: `http://localhost:${PORT}`,
      });
    });

    server.on("error", error => {
      log("error", "server.listen.failed", buildErrorDetails(error));
      process.exit(1);
    });
  } catch (error) {
    log("error", "server.start.failed", buildErrorDetails(error));
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer();
