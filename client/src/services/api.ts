const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export interface DonationDto {
  id: number;
  amount: number;
  currency: string;
  donorName: string | null;
  donorEmail: string | null;
  source: string | null;
  createdAt: string;
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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchDonations(): Promise<DonationDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/donations`);
  return handleResponse<DonationDto[]>(res);
}

export async function fetchDonationAnalytics(params: { start: string; end: string }): Promise<DonationAnalyticsResponse> {
  const search = new URLSearchParams(params);
  const res = await fetch(`${API_BASE_URL}/api/donations/analytics?${search.toString()}`);
  return handleResponse<DonationAnalyticsResponse>(res);
}

export async function fetchDonationBySource(): Promise<DonationSourceSlice[]> {
  const res = await fetch(`${API_BASE_URL}/api/donations/by-source`);
  return handleResponse<DonationSourceSlice[]>(res);
}

export async function downloadDonationReport(format: "csv" | "xlsx" | "pdf" = "csv"): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/donations/export?format=${format}`);
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

