import { makeFixtures } from './fixtures';
import { AuditEntry, DiagnosisProposal, Incident } from './types';
let incidents=makeFixtures(); let audit:AuditEntry[]=[]; let ticket:Record<string,unknown>|null=null; const locks=new Set<string>();
export const getState=()=>({incidents,audit,ticket});
export const reset=()=>{incidents=makeFixtures();audit=[];ticket=null;locks.clear();};
export const getIncident=(id:string)=>incidents.find(i=>i.id===id);
export const updateIncident=(id:string, patch:Partial<Incident>)=>{const i=getIncident(id);if(i)Object.assign(i,patch);return i;};
export const addAudit=(e:AuditEntry)=>audit.push(e);
export const execute=({proposal, decision}:{proposal:DiagnosisProposal;decision:'approve'|'reject'})=>{
 const i=getIncident(proposal.incidentId); if(!i) throw new Error('Incident not found');
 if(decision==='reject'){addAudit({id:crypto.randomUUID(),at:new Date().toISOString(),incidentId:i.id,type:'operator_decision',detail:'Proposal rejected by operator',proposalId:proposal.id});return {kind:'rejected'};}
 if(locks.has(proposal.id)) return {kind:'idempotent',result:audit.find(a=>a.proposalId===proposal.id)}; locks.add(proposal.id);
 if(i.evidenceVersion!==proposal.evidenceVersion) throw new Error('Evidence changed; rediagnose before approval.');
 if(Date.parse(proposal.expiresAt)<Date.now()) throw new Error('Proposal expired; rediagnose before approval.');
 const fresh=Number(i.evidence['telemetry.heartbeatAgeSeconds']??i.evidence['telemetry.observedAgeSeconds']??999)<=60;
 const blocked=i.deviceType==='POS' && (i.evidence['transaction.active']===true || i.evidence['transaction.unknown']===true || i.evidence['security.tamperSignal']===true || !fresh || i.actionCount>0);
 if(proposal.recommendation==='SIMULATE_RESTART' && blocked) throw new Error('Server policy refused restart: sale, tamper, stale evidence, or prior attempt.');
 if(proposal.recommendation==='SIMULATE_RESTART'){updateIncident(i.id,{status:'VERIFYING',actionCount:i.actionCount+1});const e={id:crypto.randomUUID(),at:new Date().toISOString(),incidentId:i.id,type:'sandbox_command',detail:'Synthetic restart acknowledged; verification pending',proposalId:proposal.id,action:proposal.recommendation};addAudit(e);setTimeout(()=>{updateIncident(i.id,{status:'RECOVERED_SIMULATION'});addAudit({id:crypto.randomUUID(),at:new Date().toISOString(),incidentId:i.id,type:'verification',detail:'Synthetic follow-up heartbeat: online'});},2000);return {kind:'executing',result:e};}
 if(proposal.recommendation==='CREATE_SANDBOX_TICKET'){updateIncident(i.id,{status:'TICKET_CREATED',actionCount:i.actionCount+1});ticket={id:'TICKET-001',incidentId:i.id,device:i.deviceId,status:'Needs physical inspection',evidence:i.evidence,checklist:['Inspect paper loading and path','Inspect rollers for obstruction or wear','Confirm jam clears after physical inspection']};const e={id:crypto.randomUUID(),at:new Date().toISOString(),incidentId:i.id,type:'sandbox_ticket',detail:'Internal sandbox ticket created; no technician dispatched',proposalId:proposal.id,action:proposal.recommendation};addAudit(e);return {kind:'ticket',result:e,ticket};}
 updateIncident(i.id,{status:'MANUAL_REVIEW'});const e={id:crypto.randomUUID(),at:new Date().toISOString(),incidentId:i.id,type:'manual_review',detail:'Safe alternative recorded; no device action',proposalId:proposal.id,action:proposal.recommendation};addAudit(e);return {kind:'manual',result:e};
};
