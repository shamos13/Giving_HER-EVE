import dotenv from "dotenv";
import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const shouldUseSSL =
  process.env.DATABASE_SSL === "true" || DATABASE_URL.includes("supabase.co");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../data/db.json");

const raw = await fs.readFile(dataFile, "utf8");
const db = JSON.parse(raw);

const client = await pool.connect();

function toJson(value, fallback) {
  return JSON.stringify(value ?? fallback);
}

try {
  await client.query("BEGIN");

  for (const campaign of db.campaigns || []) {
    await client.query(
      `INSERT INTO campaigns (
        id, slug, label, title, short_description, description, image,
        raised, goal, location, category, status, start_date, end_date
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        label = EXCLUDED.label,
        title = EXCLUDED.title,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        image = EXCLUDED.image,
        raised = EXCLUDED.raised,
        goal = EXCLUDED.goal,
        location = EXCLUDED.location,
        category = EXCLUDED.category,
        status = EXCLUDED.status,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date`,
      [
        campaign.id,
        campaign.slug,
        campaign.label || null,
        campaign.title,
        campaign.shortDescription || null,
        campaign.description || null,
        campaign.image || null,
        campaign.raised ?? 0,
        campaign.goal ?? 0,
        campaign.location || null,
        campaign.category || null,
        campaign.status || null,
        campaign.startDate || null,
        campaign.endDate || null,
      ],
    );
  }

  for (const story of db.stories || []) {
    await client.query(
      `INSERT INTO stories (
        id, title, excerpt, content, image_url, gallery_images, status, campaign_id
      ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        image_url = EXCLUDED.image_url,
        gallery_images = EXCLUDED.gallery_images,
        status = EXCLUDED.status,
        campaign_id = EXCLUDED.campaign_id`,
      [
        story.id,
        story.title,
        story.excerpt || null,
        story.content || null,
        story.imageUrl || null,
        toJson(Array.isArray(story.galleryImages) ? story.galleryImages : [], []),
        story.status || null,
        story.campaignId || null,
      ],
    );
  }

  for (const testimonial of db.testimonials || []) {
    await client.query(
      `INSERT INTO testimonials (
        id, quote, name, role, avatar, status
      ) VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (id) DO UPDATE SET
        quote = EXCLUDED.quote,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        avatar = EXCLUDED.avatar,
        status = EXCLUDED.status`,
      [
        testimonial.id,
        testimonial.quote || null,
        testimonial.name || null,
        testimonial.role || null,
        testimonial.avatar || null,
        testimonial.status || null,
      ],
    );
  }

  for (const faq of db.faqs || []) {
    await client.query(
      `INSERT INTO faqs (
        id, question, answer, status
      ) VALUES ($1,$2,$3,$4)
      ON CONFLICT (id) DO UPDATE SET
        question = EXCLUDED.question,
        answer = EXCLUDED.answer,
        status = EXCLUDED.status`,
      [faq.id, faq.question || null, faq.answer || null, faq.status || null],
    );
  }

  for (const donation of db.donations || []) {
    await client.query(
      `INSERT INTO donations (
        id, amount, currency, donor_name, donor_email, source,
        campaign_id, category, status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (id) DO NOTHING`,
      [
        donation.id,
        donation.amount ?? 0,
        donation.currency || "USD",
        donation.donorName || null,
        donation.donorEmail || null,
        donation.source || null,
        donation.campaignId || null,
        donation.category || null,
        donation.status || null,
        donation.createdAt || null,
      ],
    );
  }

  for (const program of db.programs || []) {
    await client.query(
      `INSERT INTO programs (
        id, name, category, description, timeline, beneficiaries,
        location, progress, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        timeline = EXCLUDED.timeline,
        beneficiaries = EXCLUDED.beneficiaries,
        location = EXCLUDED.location,
        progress = EXCLUDED.progress,
        status = EXCLUDED.status`,
      [
        program.id,
        program.name || null,
        program.category || null,
        program.description || null,
        program.timeline || null,
        program.beneficiaries || null,
        program.location || null,
        program.progress ?? null,
        program.status || null,
      ],
    );
  }

  for (const message of db.messages || []) {
    await client.query(
      `INSERT INTO messages (
        id, name, email, type, preview, message, status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        type = EXCLUDED.type,
        preview = EXCLUDED.preview,
        message = EXCLUDED.message,
        status = EXCLUDED.status,
        created_at = EXCLUDED.created_at`,
      [
        message.id,
        message.name || null,
        message.email || null,
        message.type || null,
        message.preview || null,
        message.message || null,
        message.status || null,
        message.createdAt || null,
      ],
    );
  }

  for (const user of db.users || []) {
    await client.query(
      `INSERT INTO users (
        id, name, initials, role, email, phone, status, joined, verified
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        initials = EXCLUDED.initials,
        role = EXCLUDED.role,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        status = EXCLUDED.status,
        joined = EXCLUDED.joined,
        verified = EXCLUDED.verified`,
      [
        user.id,
        user.name || null,
        user.initials || null,
        user.role || null,
        user.email || null,
        user.phone || null,
        user.status || null,
        user.joined || null,
        Boolean(user.verified),
      ],
    );
  }

  for (const section of db.contentSections || []) {
    await client.query(
      `INSERT INTO content_sections (
        id, name, description, status, fields
      ) VALUES ($1,$2,$3,$4,$5::jsonb)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        fields = EXCLUDED.fields`,
      [
        section.id,
        section.name || null,
        section.description || null,
        section.status || null,
        toJson(Array.isArray(section.fields) ? section.fields : [], []),
      ],
    );
  }

  const settings = db.settings || {};
  for (const [section, data] of Object.entries(settings)) {
    await client.query(
      `INSERT INTO settings (section, data)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data`,
      [section, toJson(data, {})],
    );
  }

  const settingsTeamItems = Array.isArray(settings?.team?.items) ? settings.team.items : [];
  const explicitTeamMembers = Array.isArray(db.teamMembers) ? db.teamMembers : [];
  const teamMembers = explicitTeamMembers.length > 0 ? explicitTeamMembers : settingsTeamItems;

  for (const [index, member] of teamMembers.entries()) {
    if (!member || typeof member !== "object") continue;

    const name = typeof member.name === "string" ? member.name.trim() : "";
    const role = typeof member.role === "string" ? member.role.trim() : "";
    if (!name || !role) continue;

    const id = typeof member.id === "string" && member.id.trim()
      ? member.id.trim()
      : `team-${index + 1}`;
    const photo = typeof member.photo === "string" ? member.photo.trim() : "";

    await client.query(
      `INSERT INTO team_members (
        id, name, role, photo, sort_order, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        photo = EXCLUDED.photo,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()`,
      [
        id,
        name,
        role,
        photo || null,
        index,
      ],
    );
  }

  const dashboard = db.dashboard || {};
  await client.query(
    `INSERT INTO dashboard (
      id, focus, operations_pulse, donation_commitments, message_sla,
      message_tips, analytics, metric_meta
    ) VALUES ('singleton', $1::jsonb,$2::jsonb,$3::jsonb,$4::jsonb,$5::jsonb,$6::jsonb,$7::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      focus = EXCLUDED.focus,
      operations_pulse = EXCLUDED.operations_pulse,
      donation_commitments = EXCLUDED.donation_commitments,
      message_sla = EXCLUDED.message_sla,
      message_tips = EXCLUDED.message_tips,
      analytics = EXCLUDED.analytics,
      metric_meta = EXCLUDED.metric_meta`,
    [
      toJson(dashboard.focus, {}),
      toJson(dashboard.operationsPulse, {}),
      toJson(dashboard.donationCommitments, []),
      toJson(dashboard.messageSla, []),
      toJson(dashboard.messageTips, []),
      toJson(dashboard.analytics, {}),
      toJson(dashboard.metricMeta, []),
    ],
  );

  await client.query(
    "SELECT setval(pg_get_serial_sequence('donations','id'), (SELECT COALESCE(MAX(id), 0) FROM donations))",
  );

  await client.query("COMMIT");
  console.log("Seed complete.");
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
