/**
 * Trade catalogue. The admin panel will own this data in Phase 4.
 * Durations and entry qualifications are typical NCVT values for illustration only;
 * confirm each against the current NCVT syllabus before publishing.
 * `published: false` hides a trade from the public site. `seats` / `fee` stay null until configured.
 */
const E = 'Engineering';
const N = 'Non-Engineering';

const rows = [
  // [slug, name, category, years, qualification, icon, description, careers]
  ['electrician', 'Electrician', E, 2, '10th pass', 'zap', 'Install, test and maintain domestic and industrial electrical systems, wiring and machines.', ['Electrician', 'Maintenance technician', 'Apprentice at power utilities']],
  ['fitter', 'Fitter', E, 2, '10th pass', 'wrench', 'Fabricate, assemble and fit mechanical components using hand tools, measuring instruments and machines.', ['Assembly fitter', 'Maintenance fitter', 'Quality inspector']],
  ['welder', 'Welder', E, 1, '8th pass', 'flame', 'Gas and electric arc welding, cutting and joining of metals to industry standards.', ['Arc welder', 'Fabrication helper', 'Pipe welder trainee']],
  ['turner', 'Turner', E, 2, '10th pass', 'cog', 'Operate lathes to turn, bore and thread precision parts from drawings.', ['Lathe operator', 'Production turner', 'Tool room assistant']],
  ['machinist', 'Machinist', E, 2, '10th pass', 'cog', 'Set up and operate milling, grinding and shaping machines to produce components within tolerance.', ['Machine operator', 'CNC trainee', 'Tool and die assistant']],
  ['mechanic-motor-vehicle', 'Mechanic Motor Vehicle', E, 2, '10th pass', 'car', 'Diagnose, service and repair petrol and diesel vehicles and their electrical systems.', ['Automobile technician', 'Service advisor trainee', 'Workshop supervisor']],
  ['mechanic-diesel', 'Mechanic Diesel', E, 1, '10th pass', 'fuel', 'Maintain and overhaul diesel engines, fuel injection systems and related equipment.', ['Diesel mechanic', 'Genset technician', 'Heavy vehicle service helper']],
  ['mechanic-tractor', 'Mechanic Tractor', E, 1, '10th pass', 'tractor', 'Service and repair tractors, hydraulics and farm machinery.', ['Tractor mechanic', 'Agri-machinery technician', 'Dealer workshop assistant']],
  ['mechanic-refrigeration-ac', 'Mechanic Refrigeration and Air Conditioning', E, 2, '10th pass', 'snowflake', 'Install, service and repair refrigeration and air-conditioning systems.', ['AC technician', 'Cold storage operator', 'Service engineer trainee']],
  ['electronics-mechanic', 'Electronics Mechanic', E, 2, '10th pass', 'cpu', 'Assemble, test and repair electronic circuits, consumer devices and industrial controls.', ['Electronics technician', 'Service technician', 'PCB assembly operator']],
  ['wireman', 'Wireman', E, 2, '10th pass', 'cable', 'Domestic and industrial wiring, earthing, panel boards and electrical safety.', ['Wireman', 'Electrical contractor assistant', 'Panel wiring technician']],
  ['sheet-metal-worker', 'Sheet Metal Worker', E, 1, '8th pass', 'hammer', 'Mark, cut, form and join sheet metal for ducts, enclosures and fabricated items.', ['Sheet metal fabricator', 'HVAC duct fitter', 'Panel fabricator']],
  ['painter-general', 'Painter General', E, 1, '8th pass', 'paintbrush', 'Surface preparation, painting and finishing for buildings, vehicles and industrial items.', ['Industrial painter', 'Building finisher', 'Spray painting operator']],
  ['draughtsman-civil', 'Draughtsman Civil', E, 2, '10th pass', 'ruler', 'Prepare civil and building drawings by hand and with CAD.', ['Civil draughtsman', 'CAD operator', 'Site assistant']],
  ['draughtsman-mechanical', 'Draughtsman Mechanical', E, 2, '10th pass', 'ruler', 'Prepare engineering drawings of machine parts and assemblies by hand and with CAD.', ['Mechanical draughtsman', 'CAD operator', 'Design office assistant']],
  ['surveyor', 'Surveyor', E, 2, '10th pass', 'compass', 'Land and construction surveying using levels, theodolites and total stations.', ['Survey assistant', 'Site surveyor', 'Mapping technician']],
  ['plumber', 'Plumber', E, 1, '8th pass', 'droplets', 'Install and maintain water supply, drainage and sanitary fittings.', ['Plumber', 'Maintenance plumber', 'Pipe fitter']],
  ['carpenter', 'Carpenter', E, 2, '8th pass', 'hammer', 'Wood work, joinery, furniture and building carpentry from drawings.', ['Carpenter', 'Furniture maker', 'Shuttering carpenter']],
  ['mason', 'Mason', E, 1, '8th pass', 'brick', 'Building construction, brick and stone masonry, plastering and finishing.', ['Mason', 'Construction supervisor trainee', 'Tiling and finishing worker']],

  ['copa', 'COPA (Computer Operator and Programming Assistant)', N, 1, '10th pass', 'monitor', 'Computer fundamentals, office applications, databases and basic programming.', ['Computer operator', 'Data entry operator', 'Office assistant']],
  ['stenographer', 'Stenographer', N, 1, '10th pass', 'keyboard', 'Shorthand, typing and office correspondence for administrative roles.', ['Stenographer', 'Personal assistant', 'Court / office clerk']],
  ['secretarial-practice', 'Secretarial Practice', N, 1, '10th pass', 'file', 'Office management, correspondence, record keeping and communication skills.', ['Office secretary', 'Front office executive', 'Administrative assistant']],
  ['cosmetology', 'Cosmetology', N, 1, '10th pass', 'sparkles', 'Skin, hair and beauty care with salon hygiene and client handling.', ['Beautician', 'Salon assistant', 'Self-employed beauty professional']],
  ['sewing-technology', 'Sewing Technology', N, 1, '8th pass', 'scissors', 'Machine sewing, garment construction and finishing.', ['Sewing machine operator', 'Garment finisher', 'Tailoring entrepreneur']],
  ['dress-making', 'Dress Making', N, 1, '8th pass', 'shirt', "Pattern making, cutting and stitching of ladies' and children's garments.", ['Dress maker', 'Boutique assistant', 'Home-based tailor']],
  ['fashion-design-technology', 'Fashion Design and Technology', N, 2, '10th pass', 'shirt', 'Design basics, pattern development, garment technology and fashion illustration.', ['Fashion assistant', 'Pattern maker', 'Garment unit supervisor']],
  ['food-production', 'Food Production', N, 1, '10th pass', 'chef', 'Cooking techniques, kitchen hygiene and menu preparation for hospitality.', ['Commis chef', 'Kitchen assistant', 'Catering helper']],
  ['digital-photographer', 'Digital Photographer', N, 1, '10th pass', 'camera', 'Digital photography, lighting, editing and studio practice.', ['Photographer', 'Photo editor', 'Studio assistant']],
  ['it-system-maintenance', 'IT and System Maintenance', N, 2, '10th pass', 'server', 'Computer hardware, networking, operating systems and system troubleshooting.', ['Hardware technician', 'Network support assistant', 'IT help desk trainee']],
  ['laboratory-assistant', 'Laboratory Assistant', N, 1, '10th pass', 'flask', 'Laboratory practices, sample handling, safety and basic instrumentation.', ['Lab assistant', 'Lab technician trainee', 'Quality lab helper']],
  ['horticulture', 'Horticulture', N, 1, '8th pass', 'sprout', 'Nursery management, plant propagation, gardening and landscaping.', ['Gardener', 'Nursery assistant', 'Landscape worker']],
];

const syllabusByCategory = {
  [E]: [
    'Workshop safety, hand tools and measuring instruments',
    'Reading engineering drawings',
    'Trade practical in the workshop',
    'Trade theory and workshop calculation',
    'Employability skills',
    'On-the-job training or industry visit',
  ],
  [N]: [
    'Safety, hygiene and workplace conduct',
    'Core trade practical',
    'Trade theory',
    'Communication and employability skills',
    'Digital literacy basics',
    'Project work or internship',
  ],
};

export const tradeCategories = [E, N];

export const trades = rows.map(([slug, name, category, years, entryQualification, icon, description, careers]) => ({
  slug,
  name,
  category,
  durationYears: years,
  duration: years === 1 ? '1 year' : `${years} years`,
  entryQualification,
  icon,
  description,
  careers,
  syllabus: syllabusByCategory[category],
  seats: null,
  fee: null,
  published: true,
  popular: ['electrician', 'fitter', 'welder', 'copa', 'mechanic-motor-vehicle', 'electronics-mechanic'].includes(slug),
}));

export const publishedTrades = trades.filter((t) => t.published);

// ---- Exports required by pages/public/Trades.jsx ----

// Lookup by slug: TRADE_DETAILS["electrician"]
// If Trades.jsx calls .map()/.filter() on it, change this line to: export const TRADE_DETAILS = trades;
export const TRADE_DETAILS = Object.fromEntries(trades.map((t) => [t.slug, t]));

// Accepts a slug or a trade object. Put images in client/public/images/trades/<slug>.jpg
export function tradeImage(trade) {
  const slug = typeof trade === 'string' ? trade : trade?.slug;
  return `/images/trades/${slug}.jpg`;
}