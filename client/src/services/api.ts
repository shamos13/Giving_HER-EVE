const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? "dev-admin-token";

function adminHeaders(): HeadersInit {
  return ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {};
}

export interface DonationDto {
  id: number;
  amount: number;
  currency: string;
  donorName: string | null;
  donorEmail: string | null;
  source: string | null;
  createdAt: string;
  status?: string | null;
  campaignId?: string | null;
  category?: string | null;
}

export interface DonationAnalyticsPoint {
  date: string;
  total: number;
}

export interface DonationAnalyticsResponse {
  totalAmount: number;
  totalCount: number;
  periodAmount: number;
  daily: DonationAnalyticsPoint[];
}

export interface DonationSourceSlice {
  source: string;
  total: number;
}

export interface DonationStatusBreakdown {
  label: string;
  value: number;
  tone: "green" | "amber" | "rose" | "blue";
}

export interface DonationCommitment {
  label: string;
  date: string;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  delta: string;
  caption: string;
  trend: "up" | "down";
  accent: string;
}

export interface DashboardFocus {
  title: string;
  body: string;
  tip?: string;
}

export interface DashboardDonation {
  id: string;
  donor: string;
  initials: string;
  email: string;
  amount: number;
  date: string;
  status?: string;
}

export interface DashboardOperationsUpdate {
  label: string;
  progress: number;
  delta: string;
  caption: string;
}

export interface DashboardNextSession {
  title: string;
  body: string;
}

export interface DashboardOverviewResponse {
  metrics: DashboardMetric[];
  focus: DashboardFocus | null;
  operationsPulse: {
    updates: DashboardOperationsUpdate[];
    nextSession: DashboardNextSession | null;
  };
  recentDonations: DashboardDonation[];
}

export interface ProgramDto {
  id: string;
  name: string;
  category: string;
  description: string;
  timeline: string;
  beneficiaries: string;
  location: string;
  progress: number;
  status: "Active" | "Planning" | "Paused" | string;
}

export interface MessageDto {
  id: string;
  name: string;
  email: string;
  type: "Volunteer" | "Donation" | "Partnership" | "General" | string;
  preview: string;
  message?: string;
  status: "New" | "In progress" | "Resolved" | string;
  createdAt: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  inquiryType?: string;
  message: string;
}

export interface MessageInsights {
  sla: { label: string; value: string; tone: "green" | "amber" | "blue"; progress: number }[];
  tips: string[];
}

export interface UserDto {
  id: string;
  name: string;
  initials: string;
  role: "Admin" | "Volunteer" | "Donor" | string;
  email: string;
  phone: string;
  status: "Active" | "Pending" | "Inactive" | string;
  joined: string;
  verified: boolean;
}

export interface ContentFieldDto {
  id: string;
  label: string;
  value: string;
  type: "text" | "textarea";
  rows?: number;
}

export interface ContentSectionDto {
  id: string;
  name: string;
  description: string;
  status?: string;
  fields: ContentFieldDto[];
}

export interface SettingsDto {
  organization: {
    name: string;
    tagline: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    facebook: string;
    instagram: string;
    xHandle: string;
    about: string;
  };
  payments: {
    mpesa: {
      enabled: boolean;
      shortcode: string;
      till: string;
      passkey: string;
      environment: "sandbox" | "production";
      min: string;
      max: string;
    };
    paypal: {
      enabled: boolean;
      clientId: string;
      secret: string;
      environment: "sandbox" | "production";
      currency: string;
    };
    bank: {
      enabled: boolean;
      name: string;
      account: string;
      instructions: string;
    };
    priority: string[];
  };
  notifications: {
    adminAlerts: {
      newDonation: boolean;
      dailySummary: boolean;
      weeklyReport: boolean;
      monthlyReport: boolean;
      campaignMilestones: boolean;
      failedPayments: boolean;
    };
    donorEmails: {
      thankYou: boolean;
      receipt: boolean;
      campaignUpdates: boolean;
      completion: boolean;
    };
  };
  security: {
    twoFactor: boolean;
    autoLogoutMinutes: number;
    backupCodes: string[];
    recentSessions: string[];
  };
  adminUsers: {
    name: string;
    email: string;
    role: "Super Admin" | "Admin" | "Viewer" | string;
    status: "Active" | "Inactive" | string;
    lastActive: string;
  }[];
  sponsors: {
    items: SponsorDto[];
  };
  team: {
    items: TeamMemberDto[];
  };
}

export interface SponsorDto {
  id: string;
  name: string;
  icon?: string;
}

export interface TeamMemberDto {
  id: string;
  name: string;
  role: string;
  photo?: string;
  sortOrder?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type OrganizationDto = SettingsDto["organization"];

export interface CampaignDto {
  id: string;
  slug?: string;
  label?: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
  location: string;
  category: string;
  status?: string;
  startDate?: string;
  endDate?: string | null;
}

export interface StoryDto {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  galleryImages?: string[];
  status?: string;
  campaignId?: string;
  area?: string;
  date?: string;
  location?: string;
}

export interface AlbumDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  coverImageUrl: string;
  photoCount: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PhotoDto {
  id: number;
  albumId: string | null;
  title: string;
  description: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  mimeType: string;
  bytes: number;
  width: number;
  height: number;
  createdAt: string;
}

export interface UploadPhotoPayload {
  albumId?: string;
  folder?: string;
  title?: string;
  description?: string;
}

export interface TestimonialDto {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  status?: string;
}

export interface AnalyticsOverview {
  programReach: { program: string; women: number; families: number }[];
  volunteerGrowth: { month: string; count: number }[];
  channelMix: { label: string; value: number; caption: string }[];
}

export function isServerUnreachable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("networkerror") ||
    message.includes("network error") ||
    message.includes("load failed") ||
    message.includes("connection refused") ||
    message.includes("econnrefused") ||
    message.includes("err_connection_refused") ||
    message.includes("eai_again")
  );
}

type ApiRequestError = Error & {
  status?: number;
  details?: string;
};

function normalizeErrorText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function getApiErrorStatus(error: unknown): number | null {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number" && Number.isFinite(status)) {
      return status;
    }
  }
  if (error instanceof Error) {
    const match = error.message.match(/status\s+(\d{3})/i);
    if (match) return Number(match[1]);
  }
  return null;
}

export function isServerErrorResponse(error: unknown): boolean {
  const status = getApiErrorStatus(error);
  return status !== null && status >= 500;
}

export function isRecoverableApiError(error: unknown): boolean {
  return isServerUnreachable(error) || isServerErrorResponse(error);
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let text = "";
    try {
      text = normalizeErrorText(await response.text());
    } catch {
      text = "";
    }
    const statusMessage = `Request failed with status ${response.status}`;
    const details = text.slice(0, 400);
    const safeMessage = response.status >= 500 ? statusMessage : details || statusMessage;
    const error = new Error(safeMessage) as ApiRequestError;
    error.status = response.status;
    if (details) error.details = details;
    throw error;
  }
  return (await response.json()) as T;
}

export async function fetchDonations(): Promise<DonationDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/donations`, {
    headers: adminHeaders(),
  });
  return handleResponse<DonationDto[]>(res);
}

export async function fetchDonationAnalytics(params: { start: string; end: string }): Promise<DonationAnalyticsResponse> {
  const search = new URLSearchParams(params);
  const res = await fetch(`${API_BASE_URL}/api/admin/donations/analytics?${search.toString()}`, {
    headers: adminHeaders(),
  });
  return handleResponse<DonationAnalyticsResponse>(res);
}

export async function fetchDonationBySource(): Promise<DonationSourceSlice[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/donations/by-source`, {
    headers: adminHeaders(),
  });
  return handleResponse<DonationSourceSlice[]>(res);
}

export async function fetchDonationStatusBreakdown(): Promise<DonationStatusBreakdown[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/donations/status-breakdown`, {
    headers: adminHeaders(),
  });
  return handleResponse<DonationStatusBreakdown[]>(res);
}

export async function fetchDonationCommitments(): Promise<DonationCommitment[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/donations/commitments`, {
    headers: adminHeaders(),
  });
  return handleResponse<DonationCommitment[]>(res);
}

export async function downloadDonationReport(format: "csv" | "xlsx" | "pdf" = "csv"): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/donations/export?format=${format}`, {
    headers: adminHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Export failed with status ${res.status}`);
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const extension = format === "xlsx" ? "xlsx" : format === "pdf" ? "pdf" : "csv";
  a.download = `donations-report.${extension}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function fetchDashboardOverview(): Promise<DashboardOverviewResponse> {
  const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    headers: adminHeaders(),
  });
  return handleResponse<DashboardOverviewResponse>(res);
}

export async function fetchPrograms(): Promise<ProgramDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/programs`, {
    headers: adminHeaders(),
  });
  return handleResponse<ProgramDto[]>(res);
}

export async function fetchMessages(): Promise<MessageDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/messages`, {
    headers: adminHeaders(),
  });
  return handleResponse<MessageDto[]>(res);
}

export async function fetchMessageInsights(): Promise<MessageInsights> {
  const res = await fetch(`${API_BASE_URL}/api/admin/messages/insights`, {
    headers: adminHeaders(),
  });
  return handleResponse<MessageInsights>(res);
}

export async function fetchUsers(): Promise<UserDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
    headers: adminHeaders(),
  });
  return handleResponse<UserDto[]>(res);
}

export async function fetchContentSections(): Promise<ContentSectionDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/content/sections`, {
    headers: adminHeaders(),
  });
  return handleResponse<ContentSectionDto[]>(res);
}

export async function updateContentSection(id: string, payload: Partial<ContentSectionDto>): Promise<ContentSectionDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/content/sections/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<ContentSectionDto>(res);
}

export async function fetchSettings(): Promise<SettingsDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
    headers: adminHeaders(),
  });
  return handleResponse<SettingsDto>(res);
}

export async function updateSettingsSection<T>(section: string, payload: T): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/api/admin/settings/${section}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<T>(res);
}

export async function fetchAnalyticsOverview(): Promise<AnalyticsOverview> {
  const res = await fetch(`${API_BASE_URL}/api/admin/analytics/overview`, {
    headers: adminHeaders(),
  });
  return handleResponse<AnalyticsOverview>(res);
}

export async function fetchCampaigns(): Promise<CampaignDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/campaigns`);
  return handleResponse<CampaignDto[]>(res);
}

export async function fetchActiveCampaigns(): Promise<CampaignDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/campaigns/active`);
  return handleResponse<CampaignDto[]>(res);
}

export async function fetchCampaignById(id: string): Promise<CampaignDto> {
  const res = await fetch(`${API_BASE_URL}/api/campaigns/${id}`);
  return handleResponse<CampaignDto>(res);
}

export async function fetchStories(): Promise<StoryDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/stories`);
  return handleResponse<StoryDto[]>(res);
}

export async function fetchGalleryAlbums(): Promise<AlbumDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/gallery/albums`);
  return handleResponse<AlbumDto[]>(res);
}

export async function fetchGalleryPhotos(params?: { albumId?: string }): Promise<PhotoDto[]> {
  const search = new URLSearchParams();
  if (params?.albumId) search.set("albumId", params.albumId);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  const res = await fetch(`${API_BASE_URL}/api/gallery/photos${suffix}`);
  return handleResponse<PhotoDto[]>(res);
}

export async function fetchOrganization(): Promise<OrganizationDto> {
  const res = await fetch(`${API_BASE_URL}/api/organization`);
  return handleResponse<OrganizationDto>(res);
}

export async function createMessage(payload: ContactMessagePayload): Promise<MessageDto> {
  const res = await fetch(`${API_BASE_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (res.status === 404) {
    throw new Error("Message endpoint is not deployed yet. Redeploy the backend service on Render.")
  }
  return handleResponse<MessageDto>(res);
}

export async function fetchSponsors(): Promise<SponsorDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/sponsors`);
  return handleResponse<SponsorDto[]>(res);
}

export async function fetchTeam(): Promise<TeamMemberDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/team`);
  return handleResponse<TeamMemberDto[]>(res);
}

export async function fetchAdminTeam(): Promise<TeamMemberDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/team`, {
    headers: adminHeaders(),
  });
  return handleResponse<TeamMemberDto[]>(res);
}

export async function createAdminTeamMember(payload: Partial<TeamMemberDto>): Promise<TeamMemberDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<TeamMemberDto>(res);
}

export async function updateAdminTeamMember(id: string, payload: Partial<TeamMemberDto>): Promise<TeamMemberDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/team/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<TeamMemberDto>(res);
}

export async function deleteAdminTeamMember(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/team/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
}

export async function fetchAdminCampaigns(): Promise<CampaignDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/campaigns`, {
    headers: adminHeaders(),
  });
  return handleResponse<CampaignDto[]>(res);
}

export async function createAdminCampaign(payload: Partial<CampaignDto>): Promise<CampaignDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/campaigns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<CampaignDto>(res);
}

export async function updateAdminCampaign(id: string, payload: Partial<CampaignDto>): Promise<CampaignDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/campaigns/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<CampaignDto>(res);
}

export async function deleteAdminCampaign(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/campaigns/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
}

export async function fetchAdminStories(): Promise<StoryDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/stories`, {
    headers: adminHeaders(),
  });
  return handleResponse<StoryDto[]>(res);
}

export async function fetchAdminAlbums(): Promise<AlbumDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/albums`, {
    headers: adminHeaders(),
  });
  return handleResponse<AlbumDto[]>(res);
}

export async function createAdminAlbum(payload: Partial<AlbumDto>): Promise<AlbumDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/albums`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<AlbumDto>(res);
}

export async function updateAdminAlbum(id: string, payload: Partial<AlbumDto>): Promise<AlbumDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/albums/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<AlbumDto>(res);
}

export async function deleteAdminAlbum(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/albums/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
}

export async function fetchAdminPhotos(params?: { albumId?: string }): Promise<PhotoDto[]> {
  const search = new URLSearchParams();
  if (params?.albumId) search.set("albumId", params.albumId);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  const res = await fetch(`${API_BASE_URL}/api/admin/photos${suffix}`, {
    headers: adminHeaders(),
  });
  return handleResponse<PhotoDto[]>(res);
}

export async function uploadAdminImage(file: File, payload: UploadPhotoPayload = {}): Promise<PhotoDto> {
  const formData = new FormData();
  formData.append("file", file);
  if (payload.albumId) formData.append("albumId", payload.albumId);
  if (payload.folder) formData.append("folder", payload.folder);
  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);

  const res = await fetch(`${API_BASE_URL}/api/admin/uploads/photos`, {
    method: "POST",
    headers: adminHeaders(),
    body: formData,
  });
  return handleResponse<PhotoDto>(res);
}

export async function createAdminStory(payload: Partial<StoryDto>): Promise<StoryDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/stories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<StoryDto>(res);
}

export async function updateAdminStory(id: string, payload: Partial<StoryDto>): Promise<StoryDto> {
  const res = await fetch(`${API_BASE_URL}/api/admin/stories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<StoryDto>(res);
}

export async function deleteAdminStory(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/admin/stories/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
}

export async function fetchTestimonials(): Promise<TestimonialDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/testimonials`);
  return handleResponse<TestimonialDto[]>(res);
}
