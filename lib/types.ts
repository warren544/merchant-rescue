import { z } from 'zod';

export const Recommendation = z.enum(['SIMULATE_RESTART','CREATE_SANDBOX_TICKET','ESCALATE_ONLY']);
export type Recommendation = z.infer<typeof Recommendation>;
export const Proposal = z.object({
  id:z.string(), incidentId:z.string(), evidenceVersion:z.number(), createdAt:z.string(), expiresAt:z.string(),
  diagnosisSummary:z.string(), evidenceRefs:z.array(z.string()), missingEvidence:z.array(z.string()),
  recommendation:Recommendation, rationale:z.string(), safetyChecks:z.array(z.string()), expectedOutcome:z.string(), limits:z.array(z.string())
});
export type DiagnosisProposal = z.infer<typeof Proposal>;
export type Lifecycle = 'DETECTED'|'DIAGNOSING'|'AWAITING_APPROVAL'|'EXECUTING'|'VERIFYING'|'RECOVERED_SIMULATION'|'TICKET_CREATED'|'MANUAL_REVIEW';
export type Incident = { id:string; title:string; deviceId:string; deviceType:'POS'|'PRINTER'; lane:string; faultCode:string; status:Lifecycle; evidenceVersion:number; evidence:Record<string, unknown>; history:string[]; actionCount:number; createdAt:string };
export type AuditEntry = { id:string; at:string; incidentId:string; type:string; detail:string; proposalId?:string; action?:Recommendation };
