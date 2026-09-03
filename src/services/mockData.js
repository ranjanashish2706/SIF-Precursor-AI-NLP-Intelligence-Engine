import { analyzeSafetyReport } from './nlpEngine';

// Pre-defined sample real-world OIL safety incident presets for quick testing
export const SAMPLE_INCIDENT_PRESETS = [
  {
    id: 'PRESET-01',
    title: 'Duliajan Rig #4 Derrick Work Without Fall Arrest (SIF Critical)',
    language: 'English',
    location: 'Duliajan Drilling Rig #4',
    category: 'Unsafe Act',
    text: 'During monkey board pipe latching operation at Duliajan Rig #4 (height ~28 meters), roughneck was observed working without fall arrest harness hooked to safety wire. High wind conditions prevailed with no toe board installed.'
  },
  {
    id: 'PRESET-02',
    title: 'Digboi Refinery High-Pressure Steam Line Valve Flange Leak (SIF High)',
    language: 'English',
    location: 'Digboi Refinery Unit 3',
    category: 'Unsafe Condition',
    text: 'A high pressure 1200 PSI steam manifold valve at Digboi Refinery unit showed severe vibration and flange bolts unthreading under stored pressure. Isolation valve was bypassed and no LOTO applied.'
  },
  {
    id: 'PRESET-03',
    title: 'Moran Gas Compression Plant H2S Pocket Release (SIF Critical - Hindi/Assamese)',
    language: 'Hindi/Assamese',
    location: 'Moran Gas Field',
    category: 'Near-Miss',
    text: 'Moran gas field compression plant ke paas gas test omitted before hot welding. Worker reported H2S gas leak smell near separator tank. Bina harness and bina gas test gas check nahi kiya.'
  },
  {
    id: 'PRESET-04',
    title: 'Nahorkatia Pipeline Crane Hoist Frayed Wire Cable (SIF High)',
    language: 'English',
    location: 'Nahorkatia Tank Farm',
    category: 'Unsafe Condition',
    text: 'Mobile crane wire rope hoisting 5-ton drill pipe had 4 broken strands and frayed core. Rigging team was standing under suspended load without exclusion zone barriers.'
  },
  {
    id: 'PRESET-05',
    title: 'Guwahati Pipeline Station Minor Housekeeping Trip Hazard (Non-SIF)',
    language: 'English',
    location: 'Guwahati Pipeline Station 5',
    category: 'Unsafe Condition',
    text: 'Discarded wooden pallet and empty oil drum left on pedestrian walkway near office entrance causing minor tripping hazard. Path cleared by contractor.'
  }
];

// Generate 50 realistic OIL safety incident records pre-processed with NLP Engine
export function getInitialDataset() {
  const rawDataset = [
    {
      id: 'OIL-2026-001',
      date: '2026-09-02',
      facility: 'Duliajan Drilling Rig #4',
      reporterRole: 'Drilling Supervisor',
      reportType: 'Unsafe Act',
      description: 'Derrickman observed working on monkey board at 25m height without hooking full body harness lanyard. High winds recorded at site.'
    },
    {
      id: 'OIL-2026-002',
      date: '2026-09-02',
      facility: 'Digboi Refinery Unit 3',
      reporterRole: 'HSE Officer',
      reportType: 'Unsafe Condition',
      description: 'High pressure line flange near mud pump showing 850 PSI pressure without relief valve calibration tag. LOTO isolation skipped during shift handover.'
    },
    {
      id: 'OIL-2026-003',
      date: '2026-09-01',
      facility: 'Moran Gas Field',
      reporterRole: 'Production Engineer',
      reportType: 'Near-Miss',
      description: 'Portable gas test omitted before hot welding near separator tank. Minor H2S gas odor detected by technician (12 ppm). Work stopped immediately.'
    },
    {
      id: 'OIL-2026-004',
      date: '2026-09-01',
      facility: 'Nahorkatia Tank Farm',
      reporterRole: 'Rigging Lead',
      reportType: 'Unsafe Condition',
      description: 'Hydraulic crane hoisting 6-ton casing pipe had frayed wire rope. Two helpers standing directly under suspended load.'
    },
    {
      id: 'OIL-2026-005',
      date: '2026-08-31',
      facility: 'Guwahati Pipeline Station 5',
      reporterRole: 'Maintenance Tech',
      reportType: 'Unsafe Act',
      description: 'Technician opened 440V DB electrical box without rubber insulating gloves. Live cable terminal exposed.'
    },
    {
      id: 'OIL-2026-006',
      date: '2026-08-31',
      facility: 'Duliajan Rig #12',
      reporterRole: 'Roustabout',
      reportType: 'Near-Miss',
      description: 'Dropped object hazard: 3kg heavy wrench fell from rotary table sub-structure height 6 meters, landing 1 meter away from mud logger.'
    },
    {
      id: 'OIL-2026-007',
      date: '2026-08-30',
      facility: 'Jorhat Oil Field',
      reporterRole: 'Field Operator',
      reportType: 'Unsafe Condition',
      description: 'Confined space entry into crude storage tank performed without pre-entry gas test or standby rescue team.'
    },
    {
      id: 'OIL-2026-008',
      date: '2026-08-30',
      facility: 'Makum Production Hub',
      reporterRole: 'Safety Inspector',
      reportType: 'Unsafe Act',
      description: 'Hot work welding performed near fuel gas scrubber without fire watch or fire extinguisher present.'
    },
    {
      id: 'OIL-2026-009',
      date: '2026-08-29',
      facility: 'Duliajan Central Tank Farm',
      reporterRole: 'Store Keeper',
      reportType: 'Unsafe Condition',
      description: 'Water puddle on office hallway tile floor caused slips. Housekeeping staff notified.'
    },
    {
      id: 'OIL-2026-010',
      date: '2026-08-29',
      facility: 'Digboi Refinery Unit 3',
      reporterRole: 'Electrical Lead',
      reportType: 'Unsafe Act',
      description: 'Electrician bypassing LOTO lock on motor control center while maintenance ongoing.'
    },
    {
      id: 'OIL-2026-011',
      date: '2026-08-28',
      facility: 'Moran Gas Field',
      reporterRole: 'Pipeline Supervisor',
      reportType: 'Unsafe Condition',
      description: 'Scaffolding pipe clamp loose on 4-meter working platform. Guardrail missing on east side.'
    },
    {
      id: 'OIL-2026-012',
      date: '2026-08-28',
      facility: 'Duliajan Drilling Rig #4',
      reporterRole: 'Assistant Driller',
      reportType: 'Unsafe Condition',
      description: 'Top drive hydraulic hose showing outer sheath bulge under 2500 PSI operating pressure.'
    },
    {
      id: 'OIL-2026-013',
      date: '2026-08-27',
      facility: 'Guwahati Pipeline Station 5',
      reporterRole: 'Instrument Tech',
      reportType: 'Unsafe Condition',
      description: 'Safety sign missing near high voltage transformer yard. Replacement requested.'
    },
    {
      id: 'OIL-2026-014',
      date: '2026-08-27',
      facility: 'Nahorkatia Tank Farm',
      reporterRole: 'Safety Inspector',
      reportType: 'Unsafe Act',
      description: 'Contractor working at height 5m on ladder without securing ladder top or wearing harness.'
    },
    {
      id: 'OIL-2026-015',
      date: '2026-08-26',
      facility: 'Jorhat Oil Field',
      reporterRole: 'ChemTech',
      reportType: 'Near-Miss',
      description: 'Chemical splash mask cracked during acid injection pump flushing. Minor drop hit apron.'
    }
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
