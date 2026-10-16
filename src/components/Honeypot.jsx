/** Hidden field that real users never fill. Bots that do are silently ignored. */
export default function Honeypot({ register }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Leave this field empty<input type="text" tabIndex={-1} autoComplete="off" {...register('website')} /></label>
    </div>
  );
}
