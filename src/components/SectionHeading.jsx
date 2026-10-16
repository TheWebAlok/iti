export default function SectionHeading({ title, text, align = 'left', light = false }) {
  const center = align === 'center';
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <h2 className={`text-3xl font-extrabold sm:text-4xl ${light ? '!text-white' : ''}`}>{title}</h2>
      {text && <p className={`mt-4 text-base leading-relaxed ${light ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>{text}</p>}
    </div>
  );
}
