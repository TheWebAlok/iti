import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BrickWall, Bot, Cable, Camera, Car, ChefHat, Cog, Compass, Cpu, Droplets, Factory, Flame,
  FlaskConical, Fuel, Gauge, GraduationCap, Hammer, Keyboard, Layers, Monitor, Paintbrush, Palette, Printer,
  Ruler, Scissors, Search, SearchX, Server, Shirt, Snowflake, Sparkles, Sprout, Sun, Tractor, Wrench, X, Zap,
  FileText, Flower2, Utensils, HeartPulse, BedDouble, CakeSlice,
} from 'lucide-react';
import Seo from '../../components/Seo';
import TradesStack from '../../components/TradesStack';
import { TRADE_DETAILS, tradeImage } from '../../data/trades';
/* ------------------------------------------------------------------ */
/* DATA (local for now). Later: replace TRADES with api.get('/trades') */
/* Durations / entry qualifications are indicative NCVT values. Confirm */
/* each trade against the current NCVT list before publishing.         */
/* Row: [name, category, months, entry qualification, icon, description, slug?] */
/* Every slug must be unique (it is used as the React key and in links). */
/* ------------------------------------------------------------------ */
const ICONS = {
  zap: Zap, wrench: Wrench, flame: Flame, cog: Cog, car: Car, fuel: Fuel, tractor: Tractor, snowflake: Snowflake,
  cpu: Cpu, cable: Cable, hammer: Hammer, paintbrush: Paintbrush, ruler: Ruler, compass: Compass, droplets: Droplets,
  brick: BrickWall, monitor: Monitor, keyboard: Keyboard, file: FileText, sparkles: Sparkles, scissors: Scissors,
  shirt: Shirt, chef: ChefHat, camera: Camera, server: Server, flask: FlaskConical, sprout: Sprout, factory: Factory,
  gauge: Gauge, bot: Bot, sun: Sun, layers: Layers, palette: Palette, printer: Printer, flower: Flower2,
  utensils: Utensils, heart: HeartPulse, bed: BedDouble, cake: CakeSlice,
};

const E = 'engineering';
const N = 'non-engineering';

const rows = [
  // ---- Engineering ----
  ['Electrician', E, 24, '10th pass', 'zap', 'Install, test and maintain domestic and industrial electrical systems and machines.'],
  ['Fitter', E, 24, '10th pass', 'wrench', 'Fabricate, assemble and fit mechanical parts with hand tools and measuring instruments.'],
  ['Welder', E, 12, '8th pass', 'flame', 'Gas and arc welding, cutting and joining of metals to industry standards.'],
  ['Turner', E, 24, '10th pass', 'cog', 'Operate lathes to turn, bore and thread precision parts from drawings.'],
  ['Machinist', E, 24, '10th pass', 'cog', 'Set up milling, shaping and drilling machines to produce parts within tolerance.'],
  ['Machinist (Grinder)', E, 24, '10th pass', 'cog', 'Precision surface and cylindrical grinding of tools and components.', 'machinist-grinder'],
  ['Tool and Die Maker', E, 24, '10th pass', 'hammer', 'Make press tools, dies, jigs and fixtures used in mass production.'],
  ['Mechanic Motor Vehicle', E, 24, '10th pass', 'car', 'Diagnose, service and repair petrol and diesel vehicles.'],
  ['Mechanic Diesel', E, 12, '10th pass', 'fuel', 'Maintain and overhaul diesel engines and fuel injection systems.'],
  ['Mechanic Tractor', E, 12, '10th pass', 'tractor', 'Service and repair tractors, hydraulics and farm machinery.'],
  ['Mechanic Agriculture Machinery', E, 24, '10th pass', 'tractor', 'Maintain harvesters, tillers, pumps and other agricultural machines.'],
  ['Mechanic Auto Electrical and Electronics', E, 12, '10th pass', 'car', 'Test and repair vehicle wiring, batteries, sensors and electronic modules.'],
  ['Mechanic Electric Vehicle', E, 12, '10th pass', 'zap', 'Service EV batteries, motors, controllers and charging systems.'],
  ['Mechanic Refrigeration and Air Conditioning', E, 24, '10th pass', 'snowflake', 'Install, service and repair refrigeration and air-conditioning systems.', 'mechanic-refrigeration-ac'],
  ['Electronics Mechanic', E, 24, '10th pass', 'cpu', 'Assemble, test and repair electronic circuits, devices and controls.'],
  ['Mechanic Consumer Electronics', E, 24, '10th pass', 'cpu', 'Repair TVs, audio systems, home appliances and other consumer devices.'],
  ['Instrument Mechanic', E, 24, '10th pass', 'gauge', 'Install, calibrate and maintain industrial measuring and control instruments.'],
  ['Mechatronics', E, 24, '10th pass', 'bot', 'Combine mechanical, electronic and PLC skills for automated machines.'],
  ['Wireman', E, 24, '10th pass', 'cable', 'Domestic and industrial wiring, earthing, panels and electrical safety.'],
  ['Solar Technician (Electrical)', E, 12, '10th pass', 'sun', 'Install and maintain solar panels, inverters and rooftop systems.'],
  ['Lift and Escalator Mechanic', E, 12, '10th pass', 'factory', 'Install, service and troubleshoot lifts and escalators.'],
  ['Sheet Metal Worker', E, 12, '8th pass', 'hammer', 'Mark, cut, form and join sheet metal for ducts and enclosures.'],
  ['Foundryman', E, 12, '8th pass', 'flame', 'Make moulds and cores and pour metal castings.'],
  ['Pattern Maker', E, 24, '10th pass', 'hammer', 'Build wooden and metal patterns used for casting.'],
  ['Painter General', E, 12, '8th pass', 'paintbrush', 'Surface preparation, painting and finishing for buildings and vehicles.'],
  ['Draughtsman Civil', E, 24, '10th pass', 'ruler', 'Prepare civil and building drawings by hand and with CAD.'],
  ['Draughtsman Mechanical', E, 24, '10th pass', 'ruler', 'Prepare engineering drawings of machine parts and assemblies.'],
  ['Architectural Draughtsman', E, 12, '10th pass', 'ruler', 'Prepare architectural plans, elevations and detail drawings.'],
  ['Surveyor', E, 24, '10th pass', 'compass', 'Land and construction surveying with levels and total stations.'],
  ['Plumber', E, 12, '8th pass', 'droplets', 'Install and maintain water supply, drainage and sanitary fittings.'],
  ['Carpenter', E, 24, '8th pass', 'hammer', 'Woodwork, joinery, furniture and building carpentry from drawings.'],
  ['Mason', E, 12, '8th pass', 'brick', 'Brick and stone masonry, plastering and building finishing.'],
  ['Wood Work Technician', E, 12, '8th pass', 'hammer', 'Operate wood-working machines and make furniture components.'],
  ['Plastic Processing Operator', E, 12, '10th pass', 'factory', 'Operate injection and blow moulding machines for plastic products.'],
  ['Rubber Technician', E, 12, '10th pass', 'factory', 'Mixing, moulding and finishing of rubber products.'],
  ['Mechanic Lens and Prism Grinding', E, 24, '10th pass', 'gauge', 'Grind and polish optical lenses and prisms.'],
  ['Industrial Painter', E, 12, '8th pass', 'paintbrush', 'Spray and coating work for industrial equipment and structures.'],

  // ---- Non-engineering ----
  ['COPA (Computer Operator and Programming Assistant)', N, 12, '10th pass', 'monitor', 'Computer basics, office applications, databases and programming.', 'copa'],
  ['Programming and Systems Administration Assistant', N, 12, '10th pass', 'server', 'Data entry, programming basics and system administration.'],
  ['IT and System Maintenance', N, 24, '10th pass', 'server', 'Computer hardware, networking and system troubleshooting.', 'it-system-maintenance'],
  ['Desktop Publishing Operator', N, 12, '10th pass', 'printer', 'Page layout, graphics and print-ready document preparation.'],
  ['Stenographer (English)', N, 12, '10th pass', 'keyboard', 'Shorthand, typing and office correspondence in English.', 'stenographer'],
  ['Stenographer (Hindi)', N, 12, '10th pass', 'keyboard', 'Shorthand, typing and office correspondence in Hindi.', 'stenographer-hindi'],
  ['Secretarial Practice', N, 12, '10th pass', 'file', 'Office management, record keeping and communication skills.'],
  ['Front Office Assistant', N, 12, '10th pass', 'bed', 'Reception, reservations and guest handling for hotels and offices.'],
  ['Housekeeper', N, 12, '8th pass', 'bed', 'Housekeeping operations for hotels, hospitals and institutions.'],
  ['Cosmetology', N, 12, '10th pass', 'sparkles', 'Skin, hair and beauty care with salon hygiene.'],
  ['Hair and Skin Care', N, 12, '10th pass', 'sparkles', 'Hair styling, skin treatments and salon practice.'],
  ['Sewing Technology', N, 12, '8th pass', 'scissors', 'Machine sewing, garment construction and finishing.'],
  ['Dress Making', N, 12, '8th pass', 'shirt', "Pattern making, cutting and stitching of ladies' and children's garments."],
  ['Cutting and Sewing', N, 24, '8th pass', 'scissors', 'Garment cutting, sewing and finishing for apparel units.'],
  ['Fashion Design and Technology', N, 24, '10th pass', 'palette', 'Design basics, pattern development and garment technology.', 'fashion-design-technology'],
  ['Embroidery and Needle Work', N, 12, '8th pass', 'palette', 'Hand and machine embroidery and decorative needlework.'],
  ['Surface Ornamentation Techniques', N, 12, '8th pass', 'palette', 'Printing, dyeing and ornamentation techniques on fabric.'],
  ['Interior Decoration and Designing', N, 12, '10th pass', 'layers', 'Space planning, materials and décor for homes and offices.'],
  ['Leather Goods Maker', N, 12, '8th pass', 'scissors', 'Cut and stitch bags, belts, wallets and other leather items.'],
  ['Food Production (General)', N, 12, '10th pass', 'chef', 'Cooking techniques, kitchen hygiene and menu preparation.', 'food-production'],
  ['Food and Beverage Service Assistant', N, 12, '10th pass', 'utensils', 'Restaurant service, table setup and guest etiquette.'],
  ['Bakery and Confectionery', N, 12, '10th pass', 'cake', 'Baking bread, cakes and confectionery with hygiene standards.'],
  ['Fruit and Vegetable Processing', N, 12, '8th pass', 'utensils', 'Preserve and process fruits and vegetables into packaged foods.'],
  ['Digital Photographer', N, 12, '10th pass', 'camera', 'Digital photography, lighting and photo editing.'],
  ['Laboratory Assistant (Chemical Plant)', N, 12, '10th pass', 'flask', 'Lab practice, sample handling and safety in chemical plants.', 'laboratory-assistant'],
  ['Health Sanitary Inspector', N, 12, '10th pass', 'heart', 'Public health, sanitation and hygiene inspection basics.'],
  ['Horticulture', N, 12, '8th pass', 'sprout', 'Nursery management, plant propagation and gardening.'],
  ['Floriculture and Landscaping', N, 12, '8th pass', 'flower', 'Flower cultivation, landscape design and garden upkeep.'],
];

const slugify = (s) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const TRADES = rows.map(([name, category, durationMonths, entry, icon, description, slug]) => ({
  slug: slug || slugify(name), name, category, durationMonths, entry, icon, description,
  seats: null,      // set by admin later
  feePaise: null,   // integer paise, set by admin later
  published: true,
}));

const duration = (m) => (m % 12 === 0 ? `${m / 12} ${m === 12 ? 'year' : 'years'}` : `${m} months`);
const FILTERS = [
  ['', 'All'],
  [E, 'Engineering'],
  [N, 'Non-engineering'],
];

/* ------------------------------------------------------------------ */
/* React Bits style effect, built with Framer Motion                    */
/* ------------------------------------------------------------------ */

/** ShinyText: a light sweep that runs across the heading. */
function ShinyText({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.h1
      className="bg-clip-text text-4xl font-extrabold !text-transparent sm:text-5xl"
      style={{ backgroundImage: 'linear-gradient(110deg,#ffffff 38%,#F59E0B 50%,#ffffff 62%)', backgroundSize: '250% 100%' }}
      animate={reduce ? undefined : { backgroundPosition: ['150% 0', '-50% 0'] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.h1>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function Trades() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  const published = useMemo(() => TRADES.filter((t) => t.published), []);
  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    return published
      .filter((t) => !cat || t.category === cat)
      .filter((t) => !term || `${t.name} ${t.description}`.toLowerCase().includes(term));
  }, [published, q, cat]);

  const stackItems = useMemo(
    () =>
      items.map((t) => ({
        ...t,
        Icon: ICONS[t.icon] || GraduationCap,
        durationLabel: duration(t.durationMonths),
        image: tradeImage(t.slug),
        features: TRADE_DETAILS[t.slug]?.features || [],
        future: TRADE_DETAILS[t.slug]?.future || '',
      })),
    [items]
  );

  const count = (c) => published.filter((t) => !c || t.category === c).length;

  return (
    <>
      <Seo title="Trades and Courses" description="Browse ITI engineering and non-engineering trades with duration, entry qualification and admission links." />

      <header className="blueprint bg-navy-900 pb-12 pt-28 text-white sm:pt-32">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <ShinyText>Trades and courses</ShinyText>
            <p className="mt-3 max-w-xl text-slate-300">
              {published.length} ITI trades across engineering and non-engineering. Seats and fees are shared by the office until the admin configures them.
            </p>
          </div>

          {/* Search: upper right */}
          <div className="relative w-full md:w-80" role="search">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search trades"
              aria-label="Search trades"
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-300 hover:bg-white/10 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="section pt-8">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {FILTERS.map(([value, label]) => {
                const active = cat === value;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCat(value)}
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? 'text-white' : 'text-navy-900 hover:bg-slate-200/70 dark:text-white dark:hover:bg-white/10'}`}
                  >
                    {active && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-royal-600" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span className="relative">{label} <span className={active ? 'text-white/80' : 'text-slate-500'}>({count(value)})</span></span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400" role="status" aria-live="polite">
              Showing {items.length} {items.length === 1 ? 'trade' : 'trades'}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="card mt-8 flex flex-col items-center px-6 py-14 text-center">
              <SearchX size={32} className="text-slate-400" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-bold">No trades match</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Try a different keyword or show all categories.</p>
              <button type="button" className="btn-primary mt-5" onClick={() => { setQ(''); setCat(''); }}>Clear filters</button>
            </div>
          ) : (
            <div className="mt-8">
              <TradesStack trades={stackItems} />
            </div>
          )}

          <p className="mt-10 text-xs text-slate-500">
            Photos are for illustration. Future scope is general guidance and depends on local demand and your skills. Durations and entry qualifications are indicative. Availability depends on what the institute offers; NCVT/SCVT affiliation is shown only for trades the office has verified.
          </p>
        </div>
      </section>
    </>
  );
}