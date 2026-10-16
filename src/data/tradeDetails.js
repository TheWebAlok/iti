/* ------------------------------------------------------------------ */
/* Extra details for each trade, matched by slug.                      */
/* Row: [slug, image keywords, [3 features], future scope]             */
/* Future scope is general guidance, not a promise of a job.           */
/* ------------------------------------------------------------------ */
const raw = [
  // ---- Engineering ----
  ['electrician', 'electrician,wiring', ['Wiring, earthing and panel installation', 'Motor, transformer and generator maintenance', 'Electrical testing and safety practice'], 'Roles in power utilities, factories, construction and railways, or start your own electrical contracting work.'],
  ['fitter', 'fitter,workshop,metal', ['Filing, drilling, tapping and fitting from drawings', 'Use of vernier, micrometer and gauges', 'Assembly of machine components'], 'Jobs in manufacturing, maintenance and fabrication units. Apprenticeship opens doors in larger plants.'],
  ['welder', 'welder,welding', ['Gas and arc welding techniques', 'Cutting and joining of plates and pipes', 'Weld safety and inspection basics'], 'Work in fabrication, construction, shipyards and pipelines, as an employee or on contract.'],
  ['turner', 'lathe,machine,turning', ['Operating lathes for turning and threading', 'Reading engineering drawings', 'Measuring parts to tight tolerances'], 'Lathe operator roles in machine shops, auto-parts and engineering units, with a path to CNC turning.'],
  ['machinist', 'milling,machine,workshop', ['Setting up milling, shaping and drilling machines', 'Tool selection and cutting speeds', 'Producing parts within tolerance'], 'Roles in tool rooms, production shops and maintenance. Moving to CNC machining is a natural next step.'],
  ['machinist-grinder', 'grinding,machine,metal', ['Surface and cylindrical grinding', 'Grinding wheel selection and dressing', 'Finishing to precise dimensions'], 'Needed in tool rooms, bearing, automobile and precision engineering units.'],
  ['tool-and-die-maker', 'tool,die,workshop', ['Making jigs, fixtures and press tools', 'Heat treatment and finishing basics', 'Assembly and testing of dies'], 'A specialised skill sought by press shops and manufacturing plants.'],
  ['mechanic-motor-vehicle', 'car,mechanic,garage', ['Engine, brake and suspension servicing', 'Fault diagnosis on petrol and diesel vehicles', 'Use of workshop tools and scanners'], 'Jobs at service centres and garages, with scope to open your own workshop.'],
  ['mechanic-diesel', 'diesel,engine,mechanic', ['Diesel engine overhaul and tuning', 'Fuel injection pump servicing', 'Troubleshooting trucks and generators'], 'Work in transport fleets, workshops, generator servicing and state transport units.'],
  ['mechanic-tractor', 'tractor,repair', ['Servicing tractor engines and transmissions', 'Hydraulic system repair', 'Farm implement maintenance'], 'Opportunities with tractor dealers, agri-service centres and rural workshops.'],
  ['mechanic-agriculture-machinery', 'farm,machinery,repair', ['Maintenance of harvesters, tillers and pumps', 'Engine and hydraulics troubleshooting', 'Preventive servicing schedules'], 'Demand from farm machinery dealers, custom hiring centres and rural repair shops.'],
  ['mechanic-auto-electrical-and-electronics', 'car,electrical,wiring', ['Vehicle wiring and battery systems', 'Starter, alternator and lighting repair', 'Sensors and electronic control modules'], 'Roles at service centres and auto-electrical shops, as vehicles use more electronics.'],
  ['mechanic-electric-vehicle', 'electric,vehicle,charging', ['EV battery and motor basics', 'Controllers and charging systems', 'High-voltage safety practice'], 'Scope in EV service centres, charging infrastructure and manufacturing as electric vehicles spread.'],
  ['mechanic-refrigeration-ac', 'air,conditioner,technician', ['Installing split and window air conditioners', 'Refrigerant handling and gas charging', 'Servicing refrigerators and cold storage'], 'Work with AC and appliance service firms and facilities teams, or start your own service business.'],
  ['electronics-mechanic', 'electronics,circuit,repair', ['Reading circuit diagrams', 'Soldering and component testing', 'Assembly and repair of electronic devices'], 'Roles in electronics manufacturing, service centres and telecom or instrumentation maintenance.'],
  ['mechanic-consumer-electronics', 'tv,repair,electronics', ['Repair of TVs, audio and home appliances', 'Fault finding with meters and testers', 'Spare-part handling and customer service'], 'Scope in service centres and retail repair, or run your own repair shop.'],
  ['instrument-mechanic', 'instrument,calibration,industrial', ['Calibration of pressure, flow and temperature instruments', 'Installing control loops', 'Maintenance of process instruments'], 'Needed in power, chemical, oil and manufacturing plants for process control upkeep.'],
  ['mechatronics', 'automation,robot,plc', ['Mechanical, electrical and PLC basics', 'Sensors, pneumatics and automation', 'Maintenance of automated machines'], 'Fits factories adopting automation, with roles in maintenance and assembly lines.'],
  ['wireman', 'wireman,electrical,wiring', ['Domestic and industrial wiring', 'Earthing and electrical safety', 'Switchgear and panel work'], 'Work with contractors, building projects and utilities, and later as an independent wireman.'],
  ['solar-technician', 'solar,panel,installation', ['Solar panel and inverter installation', 'Rooftop system wiring and testing', 'Basic maintenance of solar plants'], 'Opportunities with solar installers and energy companies as rooftop and utility solar expand.'],
  ['lift-and-escalator-mechanic', 'elevator,lift,technician', ['Installation of lifts and escalators', 'Safety systems and controls', 'Routine servicing and troubleshooting'], 'Roles with lift companies and building maintenance teams in malls, offices and housing.'],
  ['sheet-metal-worker', 'sheet,metal,fabrication', ['Marking, cutting and bending sheet metal', 'Making ducts and enclosures', 'Joining by riveting and welding'], 'Work in HVAC, fabrication shops and automobile body units.'],
  ['foundryman', 'foundry,casting,metal', ['Making moulds and cores', 'Melting and pouring metal', 'Fettling and finishing castings'], 'Roles in foundries and casting units that supply engineering and auto industries.'],
  ['pattern-maker', 'pattern,wood,casting', ['Making wooden and metal patterns', 'Reading drawings for casting', 'Pattern finishing and allowances'], 'Specialised work for foundries and tool rooms.'],
  ['painter-general', 'painter,wall,painting', ['Surface preparation and priming', 'Brush, roller and spray painting', 'Colour mixing and finishing'], 'Jobs with painting contractors, construction and auto body shops, or start contracting.'],
  ['draughtsman-civil', 'civil,drawing,blueprint', ['Preparing civil and building drawings', 'CAD drafting', 'Estimating basics'], 'Roles in construction firms, architects offices and government works departments.'],
  ['draughtsman-mechanical', 'mechanical,drawing,cad', ['Machine part and assembly drawings', 'CAD drafting', 'Dimensioning and tolerances'], 'Jobs in design offices and manufacturing firms, with room to grow into CAD design.'],
  ['architectural-draughtsman', 'architecture,plan,drawing', ['Plans, elevations and details', 'Software based drafting', 'Building drawing standards'], 'Roles with architects, builders and interior firms.'],
  ['surveyor', 'surveyor,theodolite,land', ['Levelling and chain surveying', 'Using total stations', 'Preparing survey maps and records'], 'Work with construction, road and land departments, and survey companies.'],
  ['plumber', 'plumber,pipe,plumbing', ['Pipe fitting and sanitary installation', 'Water supply and drainage layouts', 'Leak detection and repair'], 'Jobs in construction, housing and facility teams, or start your own plumbing service.'],
  ['carpenter', 'carpenter,woodwork,furniture', ['Woodwork and joinery', 'Furniture and door making from drawings', 'Use of hand and power tools'], 'Roles in furniture units and construction, or self-employment as a contractor.'],
  ['mason', 'mason,bricklaying,construction', ['Brick and stone masonry', 'Plastering and finishing', 'Reading building drawings'], 'Steady work in construction, with scope to become a supervisor or contractor.'],
  ['wood-work-technician', 'woodworking,machine,furniture', ['Operating wood-working machines', 'Making furniture components', 'Finishing and polishing'], 'Roles in furniture factories and modular interior units.'],
  ['plastic-processing-operator', 'plastic,injection,moulding', ['Operating injection and blow moulding machines', 'Mould changing and setting', 'Quality checks on plastic parts'], 'Jobs in plastics, packaging and consumer-goods factories.'],
  ['rubber-technician', 'rubber,factory,tyre', ['Mixing and moulding rubber', 'Operating presses and moulds', 'Finishing and inspection'], 'Roles in tyre, hose and rubber-goods industries.'],
  ['mechanic-lens-and-prism-grinding', 'lens,optical,grinding', ['Grinding and polishing lenses', 'Prism making', 'Optical measurement'], 'Specialised roles in optical and instrument manufacturing.'],
  ['industrial-painter', 'industrial,spray,painting', ['Spray and coating techniques', 'Surface treatment for metals', 'Protective coating inspection'], 'Work in fabrication shops, shipyards, plants and structure painting.'],

  // ---- Non-engineering ----
  ['copa', 'computer,lab,students', ['MS Office, internet and email', 'Database and programming basics', 'Data entry and office automation'], 'Roles as computer operator or data entry staff in offices, banks and departments, with a path to further IT study.'],
  ['programming-and-systems-administration-assistant', 'programming,computer,coding', ['Programming basics', 'Data entry and databases', 'System and network administration basics'], 'Entry roles in IT support and office computing.'],
  ['it-system-maintenance', 'computer,hardware,repair', ['Assembling and repairing computers', 'Networking basics', 'Installing operating systems and software'], 'Jobs in IT support, hardware service and networking, or your own repair shop.'],
  ['desktop-publishing-operator', 'graphic,design,desktop', ['Page layout and typography', 'Graphics and image editing', 'Preparing files for print'], 'Roles in printing presses, publishing and advertising studios.'],
  ['stenographer', 'typing,office,keyboard', ['Shorthand and typing speed in English', 'Office correspondence', 'Computer word processing'], 'Roles in government offices, courts and private firms as stenographer or office assistant.'],
  ['stenographer-hindi', 'typing,office,keyboard', ['Shorthand and typing speed in Hindi', 'Office correspondence', 'Computer word processing'], 'Roles in government offices, courts and private firms where Hindi stenography is needed.'],
  ['secretarial-practice', 'secretary,office,reception', ['Office management and filing', 'Business communication', 'Computer office skills'], 'Jobs as office assistant or secretary in firms and departments.'],
  ['front-office-assistant', 'hotel,reception,desk', ['Reception and reservations', 'Guest handling and etiquette', 'Front desk software basics'], 'Roles in hotels, hospitals and corporate offices.'],
  ['housekeeper', 'hotel,housekeeping,room', ['Room and facility cleaning standards', 'Linen and laundry handling', 'Housekeeping supervision basics'], 'Jobs in hotels, hospitals and facility management companies.'],
  ['cosmetology', 'beauty,salon,cosmetology', ['Skin and hair care', 'Makeup and grooming', 'Salon hygiene'], 'Work in salons and spas, or open your own beauty parlour.'],
  ['hair-and-skin-care', 'hair,salon,stylist', ['Hair cutting and styling', 'Skin treatments', 'Salon practice and hygiene'], 'Roles in salons, or self-employment.'],
  ['sewing-technology', 'sewing,machine,tailor', ['Machine sewing and stitching', 'Garment construction', 'Finishing and pressing'], 'Jobs in garment units, boutiques and tailoring, with scope for self-employment.'],
  ['dress-making', 'dress,making,tailoring', ['Pattern making and cutting', 'Stitching ladies and children garments', 'Fitting and alteration'], 'Work in boutiques, garment units or from your own tailoring shop.'],
  ['cutting-and-sewing', 'garment,factory,sewing', ['Garment cutting', 'Sewing techniques', 'Finishing for apparel units'], 'Roles in apparel factories and export units.'],
  ['fashion-design-technology', 'fashion,design,sketch', ['Design basics and sketching', 'Pattern development', 'Garment technology'], 'Roles in fashion houses, boutiques and garment export firms.'],
  ['embroidery-and-needle-work', 'embroidery,needlework,fabric', ['Hand embroidery', 'Machine embroidery', 'Decorative needlework'], 'Work with boutiques and handicraft units, or a home-based business.'],
  ['surface-ornamentation-techniques', 'fabric,printing,dyeing', ['Block and screen printing', 'Dyeing and ornamentation', 'Fabric decoration'], 'Roles in textile printing units and design studios.'],
  ['interior-decoration-and-designing', 'interior,design,room', ['Space planning', 'Materials and decor selection', 'Drawing and layout basics'], 'Work with interior firms, decorators and contractors.'],
  ['leather-goods-maker', 'leather,craft,bag', ['Cutting and stitching leather', 'Making bags, belts and wallets', 'Finishing'], 'Roles in leather goods units and craft businesses.'],
  ['food-production', 'chef,kitchen,cooking', ['Cooking techniques and menu preparation', 'Kitchen hygiene and safety', 'Food costing basics'], 'Jobs in hotels, restaurants and canteens, with scope to start a food business.'],
  ['food-and-beverage-service-assistant', 'restaurant,waiter,service', ['Table setup and service', 'Guest etiquette', 'Beverage service basics'], 'Roles in restaurants, hotels and catering.'],
  ['bakery-and-confectionery', 'bakery,bread,baking', ['Baking bread, cakes and pastry', 'Confectionery preparation', 'Hygiene and storage'], 'Work in bakeries and hotels, or open your own bakery.'],
  ['fruit-and-vegetable-processing', 'food,processing,fruit', ['Preserving fruits and vegetables', 'Making jams, pickles and juices', 'Packaging and food safety'], 'Roles in food processing units and small-scale enterprises.'],
  ['digital-photographer', 'photographer,camera,studio', ['Camera handling and lighting', 'Photo editing', 'Studio and event shoots'], 'Work in studios, media and events, or as a freelancer.'],
  ['laboratory-assistant', 'laboratory,chemistry,lab', ['Lab practice and sample handling', 'Basic chemical analysis', 'Safety in plants'], 'Roles in chemical plants, quality labs and testing houses.'],
  ['health-sanitary-inspector', 'sanitation,public,health', ['Public health and sanitation basics', 'Inspection practice', 'Hygiene awareness'], 'Roles with municipal bodies and health departments.'],
  ['horticulture', 'nursery,plants,gardening', ['Nursery management', 'Plant propagation', 'Garden upkeep'], 'Roles in nurseries, farms and landscaping, or your own nursery.'],
  ['floriculture-and-landscaping', 'flowers,garden,landscape', ['Flower cultivation', 'Landscape design', 'Garden upkeep'], 'Work with landscaping firms and nurseries.'],
];

export const TRADE_DETAILS = Object.fromEntries(
  raw.map(([slug, keywords, features, future], i) => [slug, { keywords, features, future, lock: i + 1 }])
);

// To use your own photo for a trade, add it here (slug: url).
// Example: electrician: '/trades/electrician.jpg'  (file in client/public/trades/)
export const IMAGE_OVERRIDES = {};

// Temporary photo from loremflickr.com (keyword match, so it can be a loose fit).
export const tradeImage = (slug) => {
  if (IMAGE_OVERRIDES[slug]) return IMAGE_OVERRIDES[slug];
  const d = TRADE_DETAILS[slug];
  return `https://loremflickr.com/800/600/${d ? d.keywords : 'workshop'}?lock=${d ? d.lock : 1}`;
};