'use client';

export function ProfilePhotoUpload() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-28 h-28 rounded-full border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-white/5 relative group cursor-pointer hover:border-[#b8c3ff] transition-all shadow-inner">
        <svg
          className="w-8 h-8 text-[#c6c6cc] group-hover:text-[#b8c3ff] transition-colors"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
      </div>
      <div className="text-center md:text-left">
        <h4 className="font-semibold text-white text-sm">Profile Photo</h4>
        <p className="text-xs text-[#c6c6cc]/60 mt-1">
          Drag and drop or click to upload.<br />
          JPG or PNG, max 5MB.
        </p>
      </div>
    </div>
  );
}
