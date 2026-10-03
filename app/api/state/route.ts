import { getState } from '@/lib/store'; export const GET=()=>Response.json({...getState(),mode:process.env.ZOOWORK_API_KEY?'ZooWork live':'Fixture rehearsal - no live ZooWork call'});
