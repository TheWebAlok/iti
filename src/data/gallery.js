// Gallery data. Admin-managed uploads (Cloudinary) replace this in Phase 4.
//
// TEMPORARY stock photos for development. Replace with the institute's own photos
// (e.g. '/gallery/welding-bay.jpg' from client/public/gallery/) before launch.
// If an image fails to load, the tile shows the placeholder icon.

// Pexels: take the number from the photo page URL (pexels.com/photo/xyz-12562507/)
const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

// Unsplash: right-click the photo > "Copy image address", then paste only the part
// after images.unsplash.com/, e.g. 'photo-1581092160562-40aa08e78837'
const un = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

// Fallback: keyword-based random photo (not reliable, use only until you pick real ones)
const fl = (keywords, lock) => `https://loremflickr.com/800/600/${keywords}?lock=${lock}`;

export const galleryCategories = ['Workshops', 'Campus', 'Events', 'Practical training', 'Placement events'];

export const galleryItems = [
  { id: 1, title: 'Welding bay', category: 'Workshops', src: px(12562507) },
  { id: 2, title: 'Welding practice', category: 'Practical training', src: px(22863134) },
  { id: 3, title: 'Fitter and welder trade', category: 'Workshops', src: px(15209789) },
  { id: 4, title: 'Trainee at work', category: 'Practical training', src: px(17406672) },

  // TODO: replace these with Unsplash/Pexels picks using un('photo-...') or px(id)
  { id: 5, title: 'Electrical lab', category: 'Workshops', src: fl('electrician,wiring', 5) },
  { id: 6, title: 'Institute building', category: 'Campus', src: fl('college,building', 6) },
  { id: 7, title: 'Annual skill day', category: 'Events', src: fl('students,exhibition', 7) },
  { id: 8, title: 'Lathe practice', category: 'Practical training', src: fl('lathe,machine', 8) },
  { id: 9, title: 'Campus recruitment drive', category: 'Placement events', src: fl('job,interview', 9) },
];