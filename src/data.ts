import { ServiceCard, IndustrySection, ProjectCaseStudy } from "./types";

export const COMPANY_STATS = [
  { label: "U.S. Corporate Headquarters", value: "Jersey City, NJ" },
  { label: "Global Supplier Network", value: "500+ Verified Mills & OEMs" },
  { label: "Multi-Industry Coverage", value: "12 Critical Sectors" },
  { label: "Executive Procurement Expertise", value: "25+ Years Combined" },
  { label: "Supply Chain Volume Secured", value: "120k+ Tons steel & parts" },
];

export const SERVICES_DATA: ServiceCard[] = [
  {
    id: "strategic-sourcing",
    title: "Strategic Sourcing",
    description: "Aligning organizational goals with global market intelligence to optimize total cost of ownership (TCO) across complex supply profiles.",
    category: "sourcing",
    features: ["Cost-scenario modeling", "Global market indexing", "Alternative product analysis"]
  },
  {
    id: "procurement-management",
    title: "Procurement Management",
    description: "End-to-end purchasing governance, ensuring seamless contract compliance, purchase-order oversight, and accurate commercial execution.",
    category: "procurement",
    features: ["P2P workflow streamlining", "Transactional transparency", "Service level agreement tracking"]
  },
  {
    id: "supplier-id",
    title: "Supplier Identification",
    description: "Locating tier-1 manufacturing facilities capable of answering exact engineering and mechanical specifications globally.",
    category: "sourcing",
    features: ["Global mill mapping", "Rigorous capacity validation", "Direct manufacturer engagement"]
  },
  {
    id: "vendor-qualification",
    title: "Vendor Qualification",
    description: "Deploying objective auditing protocols to appraise supplier solvency, facility capabilities, and compliance with industry standards.",
    category: "procurement",
    features: ["Financial solvency auditing", "Quality management system checks", "Ethical labor standards compliance"]
  },
  {
    id: "supplier-development",
    title: "Supplier Development",
    description: "Collaborating with strategic partners to elevate manufacturing throughput, standardize grade tolerances, and lower lead times.",
    category: "sourcing",
    features: ["Lean operation advisory", "Technical capability upscaling", "Performance metric alignment"]
  },
  {
    id: "industrial-procurement",
    title: "Industrial Procurement",
    description: "Specialized acquisition of high-tolerance machinery, industrial spare parts, capital equipment, and operational tooling.",
    category: "procurement",
    features: ["OEM technical translation", "Asset lifecycle engineering", "Consolidated delivery strategies"]
  },
  {
    id: "construction-sourcing",
    title: "Construction Material Sourcing",
    description: "Sourcing certified construction elements, specialty wood blends, fasteners, heavy machinery rentals, and structural blocks.",
    category: "sourcing",
    features: ["On-time site delivery syncing", "Bulk material acquisition", "U.S. standard compliance testing"]
  },
  {
    id: "steel-procurement",
    title: "Steel Procurement",
    description: "Premium access to world-class steel fabrication lines, securing raw structural shapes, rebar, plate, coils, and specialty alloys.",
    category: "procurement",
    features: ["Direct-mill contracting", "Custom heat number matching", "ASTM, AISC, & ASME verification"]
  },
  {
    id: "logistics-coordination",
    title: "Logistics Coordination",
    description: "Multimodal transit routing by land, sea, and air. Full container loads (FCL), specialized flatbed routing, and tracking overlays.",
    category: "logistics",
    features: ["Optimized route-mapping", "Real-time cargo tracking", "Port clearance expediting"]
  },
  {
    id: "import-export-support",
    title: "Import & Export Support",
    description: "Navigating international maritime laws, tariffs, customs clearances, and regulatory frameworks for fluid global trade.",
    category: "logistics",
    features: ["Tariff classification guidance", "FMC and customs bonds management", "Customs clearance preparation"]
  },
  {
    id: "contract-procurement",
    title: "Contract Procurement",
    description: "Locking in multi-year procurement pricing agreements to safeguard your firm against inflation and sudden raw material spikes.",
    category: "procurement",
    features: ["index-based price escalators", "Guaranteed volume allocations", "Strict liability safeguards"]
  },
  {
    id: "supply-chain-consulting",
    title: "Supply Chain Consulting",
    description: "Providing deep executive auditing of existing operations, identifying bottlenecks, and rebuilding more resilient pipelines.",
    category: "consulting",
    features: ["Nearshoring feasibility analysis", "Inventory buffer calibration", "Disruption-proofing playbook"]
  }
];

export const INDUSTRIES_DATA: IndustrySection[] = [
  {
    id: "steel-metals",
    title: "Steel & Metals",
    iconName: "FlameKindling",
    description: "Supplying mills, structural fabricators, and contractors with certified steel and non-ferrous metals to sustain national production lines.",
    details: [
      "Rigorous adherence to ASTM / AISC standards",
      "Mill Test Reports (MTRs) provided with 100% of orders",
      "Direct mill allocations for large structural projects"
    ],
    keyMaterials: ["Structural steel (H-Beams, Channels)", "Hot & cold rolled steel coils", "Specialty carbon and tool steel grades"]
  },
  {
    id: "construction-materials",
    title: "Construction Materials",
    iconName: "HardHat",
    description: "Delivering bulk materials, masonry elements, aggregates, and structural lumber to high-rise and large-scale commercial developments.",
    details: [
      "Just-in-time delivery mapping directly to major jobsites",
      "Certified raw materials compliant with international building codes",
      "Aggregated shipping to optimize localized dispatch"
    ],
    keyMaterials: ["Raw concrete additives", "FSC-certified timber", "High-tensile fasteners"]
  },
  {
    id: "industrial-equipment",
    title: "Industrial Equipment",
    iconName: "Wrench",
    description: "Securing heavy-duty industrial components, machine tool cells, conveyor systems, and strategic automation components for production lines.",
    details: [
      "Securing hard-to-find components across European and Asian supply chains",
      "Complete performance testing documentation provided",
      "Factory acceptance testing (FAT) facilitation support"
    ],
    keyMaterials: ["Hydraulic power units", "Pneumatic valve banks", "CNC machining centers"]
  },
  {
    id: "manufacturing-components",
    title: "Manufacturing Components",
    iconName: "Cpu",
    description: "Feeding high-rate manufacturing assemblies with precision turnings, custom forgings, electronics, and mechanical integrations.",
    details: [
      "Strict PPAP (Production Part Approval Process) readiness checks",
      "Long-term master service level agreements for stock assurance",
      "Tier-1 and clean-room assembly qualifications"
    ],
    keyMaterials: ["Precision forged gears", "Automotive-grade wiring assemblies", "Custom aluminum extrusions"]
  },
  {
    id: "infrastructure-projects",
    title: "Infrastructure Projects",
    iconName: "Grid",
    description: "Sourcing heavy materials, custom castings, and piping configurations for civil engineering, bridge, and transit structures.",
    details: [
      "Fully compliant with state and federal material supply rules",
      "Specialized oversized heavy-haul transport coordination",
      "Complete traceability of critical steel components"
    ],
    keyMaterials: ["Bridge girder castings", "Large diameter iron water mains", "Subway line system assemblies"]
  },
  {
    id: "energy-utilities",
    title: "Energy & Utilities",
    iconName: "Zap",
    description: "Ensuring energy suppliers and utility groups have structural tubes, substation modules, and technical parts to operate grids continuously.",
    details: [
      "Specialty pressure vessels and high-performance pipeline sourcing",
      "Vendor security profile auditing for critical grid operations",
      "Rapid turnaround protocol support for emergency maintenance"
    ],
    keyMaterials: ["High-pressure line fittings", "Grid transformer casings", "Wind turbine structural segments"]
  },
  {
    id: "electrical-equipment",
    title: "Electrical Equipment",
    iconName: "Power",
    description: "Custom control cabinets, critical transformer boxes, and custom industrial cabling for continuous factory runs.",
    details: [
      "UL, NEMA, and CE catalog identification and supply validation",
      "Explosion-proof enclosures for chemical and oil/gas yards",
      "Custom wiring diagram tracing during technical audits"
    ],
    keyMaterials: ["NEMA 4X control cabinets", "Armored power cabling", "Low-loss copper busbars"]
  },
  {
    id: "mechanical-systems",
    title: "Mechanical Systems",
    iconName: "Settings",
    description: "Sourcing power transmission units, gear reduction systems, heavy chains, and custom-bored couplings.",
    details: [
      "Direct drop-in replacements for discontinued European OEM gearboxes",
      "Custom mechanical dimensions verified by professional CAD designers",
      "Vibration analysis and testing profiles included"
    ],
    keyMaterials: ["Helical gear reducers", "Precision ball screws", "Fluid fluid couplings"]
  },
  {
    id: "hvac-solutions",
    title: "HVAC Solutions",
    iconName: "ThermometerSnowflake",
    description: "Acquiring custom chillers, heavy-rate air handling setups, industrial dampers, and energy-recovery ventilation systems.",
    details: [
      "LEED scoring material documentation compliance",
      "High-efficiency industrial chilling configurations",
      "Acoustical isolation certifications"
    ],
    keyMaterials: ["Water-cooled centrifugal chillers", "Premium anti-vibration plenums", "Variable frequency drives"]
  },
  {
    id: "commercial-procurement",
    title: "Commercial Procurement",
    iconName: "Briefcase",
    description: "Aggregating multiple structural needs for extensive hotel chains, retail environments, and multitenancy complexes.",
    details: [
      "Co-ordinating dozens of distributed suppliers into centralized hubs",
      "Custom finish alignment for structural facades",
      "Single-billing multi-location delivery sheets"
    ],
    keyMaterials: ["Architectural glazing systems", "Custom partition metals", "Acoustic ceiling grids"]
  }
];

export const PROJECTS_DATA: ProjectCaseStudy[] = [
  {
    id: "PROJ-ST-001",
    title: "Structural Steel Supply for Infrastructure Bypass",
    industry: "Steel & Metals / Infrastructure",
    location: "Jersey City Terminal Expansion, NJ",
    challenge: "Securing 2,500 tons of specialized mill-certified ASTM A572 bridge girders during a period of peak domestic rolling mill delays, with strict liquified damage clauses.",
    solution: "Leveraged our Tier-1 international mill relationship to secure dedicated rolling slots, coordinated high-priority maritime bulk shipping, and cleared customs in 48 hours.",
    result: "All structural shapes delivered on-site 12 days ahead of schedule, completely mitigating the risk of structural build delays and rolling fines.",
    volumeMetric: "2,500 Tons of Certified Steel",
    timeline: "14 Weeks (Rolling to Delivery)",
    trustSignal: "100% Passing Ultrasonic Welding Inspections"
  },
  {
    id: "PROJ-CM-002",
    title: "Bulk Materials Supply for Multi-Storage Facility",
    industry: "Construction Materials",
    location: "Commercial Logistics Hub, Newark, NJ",
    challenge: "Formulating just-in-time delivery schedules for massive volume ground stabilization fasteners and sub-foundation anchors in high-density traffic zones.",
    solution: "Established a regional buffer warehouse 8 miles from site, storing pre-qualified anchor packs and using local dispatch flatbeds connected with SMS shipping notifications.",
    result: "Eliminated onsite storage constraints, ensuring foundation teams never sat idle, and maintained zero incident delivery logs.",
    volumeMetric: "35,000 High-Tensile Anchor Sets",
    timeline: "6 Months Continuous Just-In-Time",
    trustSignal: "Zero Logistics Disturbance Incidents Reported"
  },
  {
    id: "PROJ-EQ-003",
    title: "Industrial Sourcing of High-Rate Metal Extrusion Press",
    industry: "Industrial Equipment / Manufacturing",
    location: "Advanced Metallurgy Plant, OH",
    challenge: "Sourcing and qualifying a heavy-tonnage extrusion unit with legacy German design specifications, staying strictly under a tight commercial capital budget.",
    solution: "Conducted international auction and private market auditing, identified a dormant certified unit in Japan, managed factory disassembly, and re-certified all electric panels to UL codes.",
    result: "Delivered a fully commissioned, modernized asset at 42% cost savings compared to acquiring a brand-new custom cast vessel.",
    volumeMetric: "12,000 Ton Hot Forging Capacity System",
    timeline: "22 Weeks (Decommission to Operational)",
    trustSignal: "Acquisition cost reduced by 42% against new quote"
  },
  {
    id: "PROJ-MC-004",
    title: "Oversight of Multi-Category HVAC & Piping Retrofit",
    industry: "HVAC Solutions / Mechanical",
    location: "Regional Medical Center Complex, PA",
    challenge: "Acquiring sterile ventilation grids and anti-vibration mechanical joints matching modern surgical ward isolation codes, within the high-inflation post-pandemic window.",
    solution: "Aggregated separate mechanical contractor drawings under our consolidated contract procurement structure, locking in bulk production rates directly with certified OEMs.",
    result: "Lowered individual unit rates by 19% while securing instant priority manufacturing queuing over standalone sub-contractor calls.",
    volumeMetric: "140 Multi-Zone HEPA Mechanical Plenum Systems",
    timeline: "8 Weeks Consolidated Sourcing",
    trustSignal: "Full LEED Compliance Certifications Handed Over"
  },
  {
    id: "PROJ-IF-005",
    title: "Emergency Sourced Power Transformation Substation",
    industry: "Energy & Utilities / Infrastructure",
    location: "Municipal Off-Grid Generating Yard, NY",
    challenge: "Sudden substation copper coil grounding failure disabled auxiliary municipal backup, threatening deep utility blackouts for 180,000 residents.",
    solution: "Utilized our supplier qualification directories to locate an over-produced completed utility-grid transformer inside a Texas supplier's buffer yard inside 9 hours.",
    result: "Drafted contract and arranged heavy escorts for overnight transport. Transformer landed, passed oil-tests, and hummed active in record-breaking speed.",
    volumeMetric: "35 MVA Auxiliary Step-Down Transformer",
    timeline: "72 Hours from Call to Installation",
    trustSignal: "Auxiliary power grid restored without resident downtime"
  }
];
