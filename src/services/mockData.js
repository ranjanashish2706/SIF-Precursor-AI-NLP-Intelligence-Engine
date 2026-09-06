import { analyzeSafetyReport } from './nlpEngine';

// Pre-defined sample real-world OIL safety incident presets for quick testing
export const SAMPLE_INCIDENT_PRESETS = [
  {
    id: 'PRESET-01',
    title: 'Duliajan Rig #4 Derrick Work Without Fall Arrest (SIF Critical)',
    language: 'English',
    location: 'Duliajan Drilling Rig #4',
    category: 'Unsafe Act',
    text: 'During monkey board pipe latching operation at Duliajan Rig #4 (height ~28 meters), roughneck was observed working without harness. High wind conditions prevailed.'
  },
  {
    id: 'PRESET-02',
    title: 'Digboi Refinery High-Pressure Steam Line Valve Flange Leak (SIF High)',
    language: 'English',
    location: 'Digboi Refinery Unit 3',
    category: 'Unsafe Condition',
    text: 'A high pressure 1200 PSI steam manifold valve at Digboi Refinery unit showed severe vibration. Isolation valve was bypassed and no loto applied.'
  },
  {
    id: 'PRESET-03',
    title: 'Moran Gas Compression Plant H2S Pocket Release (SIF Critical - Hindi/Assamese)',
    language: 'Hindi/Assamese',
    location: 'Moran Gas Field',
    category: 'Near-Miss',
    text: 'Moran gas field compression plant ke paas no gas test before hot welding. Worker reported h2s gas leak smell near separator tank.'
  },
  {
    id: 'PRESET-04',
    title: 'Nahorkatia Pipeline Crane Hoist Frayed Wire Cable (SIF High)',
    language: 'English',
    location: 'Nahorkatia Tank Farm',
    category: 'Unsafe Condition',
    text: 'Mobile crane wire rope hoisting 5-ton drill pipe had frayed core. Rigging team was standing under suspended load.'
  },
  {
    id: 'PRESET-05',
    title: 'Guwahati Pipeline Station Minor Housekeeping Trip Hazard (Non-SIF)',
    language: 'English',
    location: 'Guwahati Pipeline Station 5',
    category: 'Unsafe Condition',
    text: 'Discarded wooden pallet and empty oil drum left on pedestrian walkway near office entrance causing minor tripping hazard.'
  }
];

// Generate 35 realistic OIL safety incident records pre-processed with NLP Engine
export function getInitialDataset() {
  const rawDataset = [
    { id: 'OIL-2026-001', date: '2026-09-02', facility: 'Duliajan Drilling Rig #4', reportType: 'Unsafe Act', description: 'Derrickman working on monkey board at 25m height without harness. Fall hazard.' },
    { id: 'OIL-2026-002', date: '2026-09-02', facility: 'Digboi Refinery Unit 3', reportType: 'Unsafe Condition', description: 'High pressure line flange showing 850 PSI pressure. loto bypassed during shift handover.' },
    { id: 'OIL-2026-003', date: '2026-09-01', facility: 'Moran Gas Field', reportType: 'Near-Miss', description: 'No gas test before hot welding near separator tank. Minor h2s detected.' },
    { id: 'OIL-2026-004', date: '2026-09-01', facility: 'Nahorkatia Tank Farm', reportType: 'Unsafe Condition', description: 'Hydraulic crane hoisting pipe. Two helpers standing under suspended load.' },
    { id: 'OIL-2026-005', date: '2026-08-31', facility: 'Guwahati Pipeline Station 5', reportType: 'Unsafe Act', description: 'Technician opened 440V DB electrical box. Live wire exposed, no loto.' },
    { id: 'OIL-2026-006', date: '2026-08-31', facility: 'Duliajan Rig #12', reportType: 'Near-Miss', description: 'Dropped wrench fell from rotary table height 6 meters.' },
    { id: 'OIL-2026-007', date: '2026-08-30', facility: 'Jorhat Oil Field', reportType: 'Unsafe Condition', description: 'Confined space entry into storage tank performed. No gas test.' },
    { id: 'OIL-2026-008', date: '2026-08-30', facility: 'Makum Production Hub', reportType: 'Unsafe Act', description: 'Hot work welding performed near fuel gas scrubber. No ptw issued.' },
    { id: 'OIL-2026-009', date: '2026-08-29', facility: 'Duliajan Central Tank Farm', reportType: 'Unsafe Condition', description: 'Water puddle on office hallway tile floor caused slips.' },
    { id: 'OIL-2026-010', date: '2026-08-29', facility: 'Digboi Refinery Unit 3', reportType: 'Unsafe Act', description: 'Electrician bypassed loto lock on motor control center.' },
    { id: 'OIL-2026-011', date: '2026-08-28', facility: 'Moran Gas Field', reportType: 'Unsafe Condition', description: 'Scaffolding pipe clamp loose on 4-meter working platform. Fall risk.' },
    { id: 'OIL-2026-012', date: '2026-08-28', facility: 'Duliajan Drilling Rig #4', reportType: 'Unsafe Condition', description: 'Top drive hydraulic hose showing outer sheath bulge under high pressure.' },
    { id: 'OIL-2026-013', date: '2026-08-27', facility: 'Guwahati Pipeline Station 5', reportType: 'Unsafe Condition', description: 'Safety sign missing near high voltage transformer yard.' },
    { id: 'OIL-2026-014', date: '2026-08-27', facility: 'Nahorkatia Tank Farm', reportType: 'Unsafe Act', description: 'Contractor working at height 5m on ladder without harness.' },
    { id: 'OIL-2026-015', date: '2026-08-26', facility: 'Jorhat Oil Field', reportType: 'Near-Miss', description: 'Chemical splash mask cracked during acid injection pump flushing.' },
    { id: 'OIL-2026-016', date: '2026-08-25', facility: 'Moran Gas Field', reportType: 'Unsafe Condition', description: 'Entering confined space for cleaning. No gas test was done.' },
    { id: 'OIL-2026-017', date: '2026-08-25', facility: 'Digboi Refinery Unit 3', reportType: 'Unsafe Act', description: 'Vessel inspection ongoing. No gas test completed prior to entry.' },
    { id: 'OIL-2026-018', date: '2026-08-24', facility: 'Moran Gas Field', reportType: 'Unsafe Condition', description: 'Confined space work in trench. No gas test.' },
    { id: 'OIL-2026-019', date: '2026-08-24', facility: 'Digboi Refinery Unit 1', reportType: 'Unsafe Act', description: 'Maintenance on pump, loto bypassed.' },
    { id: 'OIL-2026-020', date: '2026-08-23', facility: 'Digboi Refinery Unit 3', reportType: 'Near-Miss', description: 'Valve maintenance started. loto bypassed.' },
    { id: 'OIL-2026-021', date: '2026-08-23', facility: 'Duliajan Drilling Rig #4', reportType: 'Unsafe Act', description: 'Without harness on the scaffold, fall potential.' },
    { id: 'OIL-2026-022', date: '2026-08-22', facility: 'Duliajan Drilling Rig #4', reportType: 'Unsafe Condition', description: 'Worker at height, without harness.' },
    { id: 'OIL-2026-023', date: '2026-08-22', facility: 'Nahorkatia Tank Farm', reportType: 'Unsafe Act', description: 'Crane lifting load. Worker standing under suspended load.' },
    { id: 'OIL-2026-024', date: '2026-08-21', facility: 'Nahorkatia Tank Farm', reportType: 'Near-Miss', description: 'Rigging operation. Standing under suspended load.' },
    { id: 'OIL-2026-025', date: '2026-08-21', facility: 'Makum Production Hub', reportType: 'Unsafe Act', description: 'Hot work ongoing. No permit.' },
    { id: 'OIL-2026-026', date: '2026-08-20', facility: 'Makum Production Hub', reportType: 'Unsafe Act', description: 'Grinding near tank, no ptw.' },
    { id: 'OIL-2026-027', date: '2026-08-20', facility: 'Makum Production Hub', reportType: 'Unsafe Condition', description: 'Welding activity found, no ptw.' },
    { id: 'OIL-2026-028', date: '2026-08-19', facility: 'Jorhat Oil Field', reportType: 'Near-Miss', description: 'Confined space entry, no gas test.' },
    { id: 'OIL-2026-029', date: '2026-08-19', facility: 'Jorhat Oil Field', reportType: 'Unsafe Act', description: 'Entered trench. No gas test.' },
    { id: 'OIL-2026-030', date: '2026-08-18', facility: 'Duliajan Rig #12', reportType: 'Unsafe Condition', description: 'Without harness on derrick.' },
    { id: 'OIL-2026-031', date: '2026-08-18', facility: 'Guwahati Pipeline Station 5', reportType: 'Near-Miss', description: 'Driving truck over speed limit on site.' },
    { id: 'OIL-2026-032', date: '2026-08-17', facility: 'Guwahati Pipeline Station 5', reportType: 'Unsafe Act', description: 'Driving without seatbelt.' },
    { id: 'OIL-2026-033', date: '2026-08-17', facility: 'Digboi Refinery Unit 1', reportType: 'Unsafe Condition', description: 'Leak from cooling water line, non-hazardous.' },
    { id: 'OIL-2026-034', date: '2026-08-16', facility: 'Digboi Refinery Unit 1', reportType: 'Unsafe Condition', description: 'Trash bin overflowing.' },
    { id: 'OIL-2026-035', date: '2026-08-16', facility: 'Moran Gas Field', reportType: 'Unsafe Act', description: 'No ptw for hot work.' }
  ];

  // Process all items through our real NLP engine
  return rawDataset.map(item => {
    const nlpResult = analyzeSafetyReport(item.description);
    return {
      ...item,
      ...nlpResult
    };
  });
}
