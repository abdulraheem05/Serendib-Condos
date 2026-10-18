/**
 * Stage marker artwork. Stages are told apart by SHAPE and fill, using only the brand palette:
 *   Upcoming  – solid gold circle
 *   Ongoing   – navy diamond with a gold outline and gold core
 *   Completed – white circle with a gold ring and a navy check
 */
export default function StageGlyph({ stage, className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      {stage === "upcoming" && <circle cx="16" cy="16" r="10.5" fill="#C9A66B" stroke="#FFFFFF" strokeWidth="2" />}
      {stage === "ongoing" && (
        <>
          <path d="M16 3.5 28.5 16 16 28.5 3.5 16Z" fill="#0D1C31" stroke="#C9A66B" strokeWidth="2.6" strokeLinejoin="round" />
          <circle cx="16" cy="16" r="3" fill="#C9A66B" />
        </>
      )}
      {stage === "completed" && (
        <>
          <circle cx="16" cy="16" r="10.5" fill="#FFFFFF" stroke="#C9A66B" strokeWidth="3" />
          <path d="m11 16.4 3.6 3.6 6.6-7.2" fill="none" stroke="#0D1C31" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}
