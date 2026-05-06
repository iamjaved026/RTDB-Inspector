export default function WarningBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl shadow-sm text-sm flex items-start gap-3 w-full">
      <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <p className="font-medium">Important Security Notice</p>
        <p className="mt-1 text-amber-700/90 leading-relaxed">
          This tool tests permissions using standard REST API calls and does not bypass Firebase Security Rules. 
          Any operations performed here will execute exactly as they would if initiated by public unauthenticated users, unless you configure authentication. Let's assume testing is unauthenticated for now.
        </p>
      </div>
    </div>
  );
}
