export interface ProjectMetrics {
  id: string;
  projectId: string;
  progress: number;
  plannedCost: number;
  actualCost: number;
  plannedHours: number;
  actualHours: number;
  efficiency: number;
  timeline: TimelineMetric;
}

export interface TimelineMetric {
  plannedStart: Date;
  actualStart: Date;
  plannedEnd: Date;
  actualEnd?: Date;
  delay: number;
}

export interface KPIData {
  label: string;
  value: number;
  trend: number;
  target: number;
}