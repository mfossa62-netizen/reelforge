"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// Minimal stub - full editor loading
export default function Editor() {
  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">
      <div className="text-center space-y-3 p-6">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold">RF</div>
        <h1 className="text-2xl font-bold">ReelForge</h1>
        <p className="text-zinc-400 text-sm max-w-sm">Uploading full editor with video export. Please wait 30–60 seconds then hard-refresh.</p>
      </div>
    </div>
  );
}
