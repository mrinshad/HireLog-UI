import { Application, Communication, Company, PaginatedResponse, Role, StatusHistory } from "@/types";
import { getAuthHeaders } from "@/lib/server-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// ── Helpers ──

function buildParams(params: Record<string, string | number | undefined | null>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  return sp.toString();
}

// ── Companies ──

export async function getCompanies(): Promise<Company[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/companies?per_page=0`, {
    cache: "no-store",
    headers: { ...authHeaders },
  });
  if (!res.ok) throw new Error("Failed to fetch companies");
  const json = await res.json();
  return json.data ?? json;
}

export interface CompanyListParams { page?: number; perPage?: number; search?: string }
export async function getCompaniesPaginated(params: CompanyListParams): Promise<PaginatedResponse<Company>> {
  const authHeaders = await getAuthHeaders();
  const qs = buildParams({ page: params.page ?? 1, per_page: params.perPage ?? 20, search: params.search });
  const res = await fetch(`${API_URL}/companies?${qs}`, { cache: "no-store", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to fetch companies");
  return res.json();
}

export async function createCompany(companyData: Partial<Company>): Promise<Company> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/companies`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(companyData),
  });
  if (!res.ok) throw new Error("Failed to create company");
  return res.json();
}

export async function updateCompany(id: string, companyData: Partial<Company>): Promise<Company> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/companies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(companyData),
  });
  if (!res.ok) throw new Error("Failed to update company");
  return res.json();
}

export async function deleteCompany(id: string): Promise<void> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/companies/${id}`, { method: "DELETE", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to delete company");
}

export async function getCompany(id: string): Promise<Company | null> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/companies/${id}`, { cache: "no-store", headers: { ...authHeaders } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch company");
  return res.json();
}

// ── Roles ──

export async function getRoles(companyId?: string): Promise<Role[]> {
  const authHeaders = await getAuthHeaders();
  const qs = buildParams({ company_id: companyId, per_page: 0 });
  const res = await fetch(`${API_URL}/roles?${qs}`, { cache: "no-store", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to fetch roles");
  const json = await res.json();
  return json.data ?? json;
}

export interface RoleListParams {
  page?: number; perPage?: number; search?: string;
  companyId?: string; source?: string; createdFrom?: string; createdTo?: string;
}
export async function getRolesPaginated(params: RoleListParams): Promise<PaginatedResponse<Role>> {
  const authHeaders = await getAuthHeaders();
  const qs = buildParams({
    page: params.page ?? 1, per_page: params.perPage ?? 20, search: params.search,
    company_id: params.companyId, source: params.source,
    created_from: params.createdFrom, created_to: params.createdTo,
  });
  const res = await fetch(`${API_URL}/roles?${qs}`, { cache: "no-store", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
}

export async function createRole(roleData: Partial<Role>): Promise<Role> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(roleData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create role: ${errorText}`);
  }
  return res.json();
}

export async function getRole(id: string): Promise<Role | null> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/roles/${id}`, { cache: "no-store", headers: { ...authHeaders } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch role");
  return res.json();
}

export async function updateRole(id: string, roleData: Partial<Role>): Promise<Role> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/roles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(roleData),
  });
  if (!res.ok) throw new Error("Failed to update role");
  return res.json();
}

export async function deleteRole(id: string): Promise<void> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/roles/${id}`, { method: "DELETE", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to delete role");
}

// ── Applications ──

export async function getApplications(): Promise<Application[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/applications?per_page=0`, { cache: "no-store", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to fetch applications");
  const json = await res.json();
  return json.data ?? json;
}

export interface ApplicationListParams {
  page?: number; perPage?: number; search?: string;
  roleId?: string; status?: string; replyReceived?: string;
  updatedFrom?: string; updatedTo?: string;
}
export async function getApplicationsPaginated(params: ApplicationListParams): Promise<PaginatedResponse<Application>> {
  const authHeaders = await getAuthHeaders();
  const qs = buildParams({
    page: params.page ?? 1, per_page: params.perPage ?? 20, search: params.search,
    role_id: params.roleId, status: params.status, reply_received: params.replyReceived,
    updated_from: params.updatedFrom, updated_to: params.updatedTo,
  });
  const res = await fetch(`${API_URL}/applications?${qs}`, { cache: "no-store", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function getApplication(id: string): Promise<Application | null> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/applications/${id}`, { cache: "no-store", headers: { ...authHeaders } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch application");
  return res.json();
}

export async function createApplication(appData: Partial<Application>): Promise<Application> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(appData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}

export async function updateApplicationStatus(id: string, status: string, notes?: string) {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/applications/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}

// ── Status History ──

export async function getStatusHistory(applicationId: string): Promise<StatusHistory[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/status-history?application_id=${applicationId}`, {
    cache: "no-store", headers: { ...authHeaders },
  });
  if (!res.ok) throw new Error("Failed to fetch status history");
  return res.json();
}

// ── Communications ──

export async function getCommunications(applicationId: string): Promise<Communication[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/communications?application_id=${applicationId}`, {
    cache: "no-store", headers: { ...authHeaders },
  });
  if (!res.ok) throw new Error("Failed to fetch communications");
  const json = await res.json();
  return json.data ?? json;
}

export async function getAllCommunications(): Promise<Communication[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/communications?per_page=0`, { cache: "no-store", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to fetch communications");
  const json = await res.json();
  return json.data ?? json;
}

export interface CommunicationListParams { page?: number; perPage?: number; applicationId?: string }
export async function getCommunicationsPaginated(params: CommunicationListParams): Promise<PaginatedResponse<Communication>> {
  const authHeaders = await getAuthHeaders();
  const qs = buildParams({
    page: params.page ?? 1, per_page: params.perPage ?? 20,
    application_id: params.applicationId,
  });
  const res = await fetch(`${API_URL}/communications?${qs}`, { cache: "no-store", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to fetch communications");
  return res.json();
}

export async function createCommunication(commData: Partial<Communication>): Promise<Communication> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/communications`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify(commData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}

// ── Dashboard ──

export interface DashboardStats {
  total_applications: number;
  in_interview: number;
  offers: number;
  response_rate: number;
}

export interface PipelineCount {
  status: string;
  count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/dashboard/stats`, { cache: "no-store", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

export async function getPipelineCounts(): Promise<PipelineCount[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/dashboard/pipeline`, { cache: "no-store", headers: { ...authHeaders } });
  if (!res.ok) throw new Error("Failed to fetch pipeline counts");
  return res.json();
}