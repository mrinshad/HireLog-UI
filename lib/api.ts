import { Application, Communication, Company, Role, StatusHistory } from "@/types";
import { getAuthHeaders } from "@/lib/server-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function getCompanies(): Promise<Company[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/companies`, {
    cache: "no-store",
    headers: { ...authHeaders },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }

  return res.json();
}

export async function createCompany(companyData: Partial<Company>): Promise<Company> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(companyData),
  });

  if (!res.ok) {
    throw new Error("Failed to create company");
  }

  return res.json();
}

export async function getRoles(companyId?: string): Promise<Role[]> {
  const authHeaders = await getAuthHeaders();
  const url = companyId 
    ? `${API_URL}/roles?company_id=${companyId}`
    : `${API_URL}/roles`;
    
  const res = await fetch(url, { cache: "no-store", headers: { ...authHeaders } });
  
  if (!res.ok) throw new Error("Failed to fetch roles");
  return res.json();
}

export async function createRole(roleData: Partial<Role>): Promise<Role> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(roleData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create role: ${errorText}`);
  }

  return res.json();
}

export async function getApplications(): Promise<Application[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/applications`, { cache: "no-store", headers: { ...authHeaders } });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch applications: ${errorText}`);
  }
  
  return res.json();
}

export async function createApplication(appData: Partial<Application>): Promise<Application> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
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

export async function getStatusHistory(applicationId: string): Promise<StatusHistory[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/status-history?application_id=${applicationId}`, { 
    cache: "no-store",
    headers: { ...authHeaders },
  });
  if (!res.ok) throw new Error("Failed to fetch status history");
  return res.json();
}

export async function getCommunications(applicationId: string): Promise<Communication[]> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/communications?application_id=${applicationId}`, { 
    cache: "no-store",
    headers: { ...authHeaders },
  });
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
  const res = await fetch(`${API_URL}/companies/${id}`, { 
    method: "DELETE",
    headers: { ...authHeaders },
  });
  if (!res.ok) throw new Error("Failed to delete company");
}

export async function getCompany(id: string): Promise<Company | null> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_URL}/companies/${id}`, { 
    cache: "no-store",
    headers: { ...authHeaders },
  });
  
  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    throw new Error("Failed to fetch company");
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