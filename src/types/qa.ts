export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type TestStatus = 'pass' | 'fail';
export type ModuleType = 'cart' | 'auth' | 'catalog' | 'checkout' | 'shipping';

export type BugStatus = 'open' | 'in_progress' | 'in_review' | 'resolved' | 'deferred';

export interface BugTimelineEntry {
  id: string;
  timestamp: string;
  status: BugStatus;
  author: string;
  role: string;
  comment: string;
}

export interface TestCase {
  id: string;
  name: string;
  module: ModuleType;
  moduleLabel: string;
  description: string;
  preconditions: string;
  expectedResult: string;
  actualResult: string;
  status: TestStatus;
  severity?: Severity;
  defectId?: number;
  durationMs: number;
}

export interface Defect {
  id: number;
  title: string;
  severity: Severity;
  module: ModuleType;
  moduleLabel: string;
  blocksLaunch: boolean;
  impact: string;
  userConsequence: string;
  correctiveAction: string;
  effort: 'S' | 'M' | 'L';
  rootCauseAnalysis: string;
  fileAffected: string;
  codeSnippetBug: string;
  codeSnippetFix: string;
  testCaseId: string;
  status: BugStatus;
  assignedTo: string;
  assignedRole: string;
  slaTarget: string;
  financialRiskEstimate: string;
  timeline: BugTimelineEntry[];
}

export interface CartProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface CheckpointCriteria {
  id: string;
  title: string;
  severity: Severity;
  defectId: number;
  isMandatoryForRelease: boolean;
}

export interface TestRunCycle {
  id: string;
  cycleNumber: number;
  buildTag: string;
  date: string;
  environment: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
  durationMinutes: number;
  executedBy: string;
  verdict: 'NO-GO' | 'GO' | 'CONDITIONAL';
  summaryNotes: string;
}

export type EnterpriseReportType = 'executive' | 'technical';
