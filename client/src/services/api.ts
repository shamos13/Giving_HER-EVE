const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
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
  status?: string;
  campaignId?: string;
  area?: string;
  date?: string;
  location?: string;
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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
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

export async function fetchOrganization(): Promise<OrganizationDto> {
  const res = await fetch(`${API_BASE_URL}/api/organization`);
  return handleResponse<OrganizationDto>(res);
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
