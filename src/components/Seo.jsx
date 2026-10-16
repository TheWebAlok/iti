import { useEffect } from 'react';
import { institute } from '../config/institute';

/** Minimal SEO helper: sets title and meta description per page. */
export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | ${institute.name}` : `${institute.name} - ${institute.tagline}`;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) { tag = document.createElement('meta'); tag.name = 'description'; document.head.appendChild(tag); }
      tag.content = description;
    }
  }, [title, description]);
  return null;
}
