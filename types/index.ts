export interface Company {
  id: string;
  name: string;
  website?: string;
  career_page_url?: string;
  contact_page_url?: string;
  location?: string;
  recruiter_name?: string;
  hr_email?: string;
  other_emails?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  company_id: string;
  title: string;
  job_url?: string;
  location?: string;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  role_id: string;
  status: string;
  applied_date?: string;
  reply_received: boolean;
  last_reply_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StatusHistory {
  id: string;
  application_id: string;
  status: string;
  notes?: string;
  changed_at: string;
}

export interface Communication {
  id: string;
  application_id: string;
  communication_date: string;
  type: string; 
  direction: string;
  subject?: string;
  content?: string;
  created_at: string;
  updated_at: string;
}