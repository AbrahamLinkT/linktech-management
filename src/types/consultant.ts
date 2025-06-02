export interface Consultant {
  id: string;
  name: string;
  email: string;
  specialization: string[];
  experienceLevel: ExperienceLevel;
  availability: AvailabilityStatus;
  currentProjectId?: string;
  skills: Skill[];
  hourlyRate: number;
  totalProjectsCompleted: number;
  successRate: number;
}

export interface Skill {
  name: string;
  level: SkillLevel;
  yearsOfExperience: number;
}

export enum ExperienceLevel {
  JUNIOR = 'JUNIOR',
  INTERMEDIATE = 'INTERMEDIATE',
  SENIOR = 'SENIOR',
  EXPERT = 'EXPERT'
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  PARTIALLY_AVAILABLE = 'PARTIALLY_AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

export enum SkillLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}