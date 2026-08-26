"use client";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950 text-white p-6">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-lg">RF</div>
        <h1 className="text-2xl font-bold">ReelForge</h1>
        <p className="text-zinc-400 text-sm">Restoring smooth transitions… hard-refresh in about 1 minute.</p>
      </div>
    </div>
  );
}
