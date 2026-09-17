import React, { useEffect, useRef, useState } from "react";
import { AlertOctagon, Heart, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisconnectMascotProps {
  visible: boolean;
  onPlaySound?: (sound: "hover" | "select" | "back") => void;
}

export const DisconnectMascot: React.FC<DisconnectMascotProps> = ({
  visible,
  onPlaySound,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [pupilOffset, setPupilOffset] = useState<{
    left: { x: number; y: number };
    right: { x: number; y: number };
  }>({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  });

  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "🛑 ÁLLJ! NEM SZABAD! Ne lépj még ki!",
    "🐾 Kérlek maradj még! Vár az RP és a barátok!",
    "🛑 STOP! Ne hagyj itt egyedül a szerveren!",
    "🥺 Nem-nem! Még nem mentetted el a játékodat!",
    "🐾 Várj még egy kicsit! Most jön a legjobb rész!",
  ];

  // Eye tracking logic: Follow mouse position anywhere on the screen
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Eye center coordinates relative to the viewport
      const charCenterX = rect.left + rect.width / 2;
      const eyeY = rect.top + 76; // Eye level in the SVG

      const leftEyeX = charCenterX - 13;
      const rightEyeX = charCenterX + 13;

      const calcOffset = (eyeCenterX: number, eyeCenterY: number) => {
        const dx = e.clientX - eyeCenterX;
        const dy = e.clientY - eyeCenterY;
        const dist = Math.hypot(dx, dy);

        const maxMoveX = 6.8;
        const maxMoveY = 5.8;
        const sensitivity = 260; // Distance scaling

        const p = Math.min(1, dist / sensitivity);
        const angle = Math.atan2(dy, dx);

        const x = Math.cos(angle) * maxMoveX * p;
        const y = Math.sin(angle) * maxMoveY * p;

        return { x, y };
      };

      setPupilOffset({
        left: calcOffset(leftEyeX, eyeY),
        right: calcOffset(rightEyeX, eyeY),
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
    if (onPlaySound) onPlaySound("select");
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-auto absolute -top-[182px] right-1 z-40 flex flex-col items-center select-none transition-all duration-300 ease-out",
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-90 pointer-events-none",
      )}
      style={{
        fontFamily: "'Lexend', sans-serif",
      }}
      onClick={handleMascotClick}
      title="Kattints rám a következő üzenethez!"
    >
      {/* Speech Warning Arc / Bubble ("ÁLLJ! NEM SZABAD! STOP!") */}
      <div className="relative mb-1 flex flex-col items-center animate-bubble-pulse cursor-pointer">
        <div className="flex items-center gap-1.5 rounded-full border-2 border-red-500/90 bg-gradient-to-r from-red-950/95 via-black/95 to-red-950/95 px-3 py-1 shadow-[0_0_22px_rgba(239,68,68,0.75)] backdrop-blur-md">
          <AlertOctagon size={14} className="text-red-400 animate-bounce shrink-0" />
          <span className="font-bold text-[11px] tracking-wide text-red-100 whitespace-nowrap drop-shadow-[0_0_6px_rgba(239,68,68,0.9)]">
            {quotes[quoteIndex]}
          </span>
          <span className="ml-1 rounded bg-red-600 px-1.5 py-0.5 font-mono text-[8px] font-black text-white uppercase tracking-wider shadow-sm">
            STOP!
          </span>
        </div>

        {/* Small speech triangle pointer downward */}
        <div className="h-0 w-0 border-x-[6px] border-x-transparent border-t-[7px] border-t-red-500/90 filter drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)]" />
      </div>

      {/* Main Character SVG Graphic: Cute Shiba/Corgi Animal holding an animated STOP sign */}
      <div className="relative h-[135px] w-[175px] cursor-pointer filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]">
        {/* Floating sweat drop of worry */}
        <div className="absolute top-2 left-10 animate-bounce text-[15px] pointer-events-none">
          💧
        </div>

        {/* Floating mini heart / exclamation */}
        <div className="absolute top-1 right-7 animate-pulse text-[14px] text-red-400 font-bold pointer-events-none">
          ❗
        </div>

        <svg
          viewBox="0 0 175 140"
          className="h-full w-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Fur Golden-Orange Gradient */}
            <linearGradient id="shibaFur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFA642" />
              <stop offset="70%" stopColor="#F5871F" />
              <stop offset="100%" stopColor="#DF6500" />
            </linearGradient>

            {/* Soft Cream Muzzle/Chest Gradient */}
            <linearGradient id="shibaCream" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#FFF4E0" />
              <stop offset="100%" stopColor="#FFE7C4" />
            </linearGradient>

            {/* Ear Inner Soft Pink */}
            <linearGradient id="earPink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC2D1" />
              <stop offset="100%" stopColor="#FF9EAA" />
            </linearGradient>

            {/* STOP Sign Red Gradient */}
            <linearGradient id="stopSignRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="60%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>

            {/* Metal Pole Gradient */}
            <linearGradient id="metalPole" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9CA3AF" />
              <stop offset="40%" stopColor="#E5E7EB" />
              <stop offset="100%" stopColor="#6B7280" />
            </linearGradient>

            {/* Glossy Eye Iris Gradient */}
            <linearGradient id="cuteIris" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B1C0B" />
              <stop offset="50%" stopColor="#632B0F" />
              <stop offset="100%" stopColor="#1E0D05" />
            </linearGradient>

            {/* Filter for STOP sign glow */}
            <filter id="stopGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#EF4444" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* 1. Animated STOP Sign held in left paw (swaying back and forth) */}
          <g className="animate-stop-sign">
            {/* Pole */}
            <rect
              x="26"
              y="28"
              width="6"
              height="88"
              rx="3"
              fill="url(#metalPole)"
              stroke="#374151"
              strokeWidth="0.8"
            />

            {/* Octagonal STOP Sign Head */}
            <g filter="url(#stopGlow)">
              {/* Red Octagon */}
              <polygon
                points="17,8 41,8 53,20 53,44 41,56 17,56 5,44 5,20"
                fill="url(#stopSignRed)"
                stroke="#B91C1C"
                strokeWidth="1.2"
              />

              {/* Inner White Border Octagon */}
              <polygon
                points="18.5,10.5 39.5,10.5 50.5,21.5 50.5,42.5 39.5,53.5 18.5,53.5 7.5,42.5 7.5,21.5"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />

              {/* Bold STOP Text */}
              <text
                x="29"
                y="37"
                textAnchor="middle"
                fill="#FFFFFF"
                fontWeight="900"
                fontSize="12.5"
                letterSpacing="0.8"
                fontFamily="'Lexend', sans-serif"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }}
              >
                STOP
              </text>

              {/* Top Glass/Light Reflection on sign */}
              <path
                d="M12 21 L22 11 L36 11 L12 35 Z"
                fill="#FFFFFF"
                opacity="0.25"
              />
            </g>

            {/* Left Paw clutching the STOP sign pole */}
            <g id="leftPaw">
              <path
                d="M21 76 C19 70 35 68 37 75 C38 82 23 85 21 76 Z"
                fill="url(#shibaFur)"
                stroke="#B45309"
                strokeWidth="1.2"
              />
              {/* Pink toe pads */}
              <circle cx="25" cy="74" r="2" fill="#FF8BA0" />
              <circle cx="30" cy="73" r="2" fill="#FF8BA0" />
              <circle cx="35" cy="76" r="2" fill="#FF8BA0" />
            </g>
          </g>

          {/* 2. Chubby Cute Body & Fluffy Chest */}
          <g id="body">
            {/* Round Chubby Animal Body */}
            <path
              d="M66 94 Q94 86 122 94 C134 118 126 138 94 138 C62 138 54 118 66 94 Z"
              fill="url(#shibaFur)"
              stroke="#B45309"
              strokeWidth="1.2"
            />

            {/* Fluffy White Chest Fur Bib */}
            <path
              d="M76 96 Q94 90 112 96 C108 122 94 130 94 130 C94 130 80 122 76 96 Z"
              fill="url(#shibaCream)"
            />
            {/* Chest Fur Tufts */}
            <path
              d="M86 104 Q94 112 102 104 Q94 120 86 104 Z"
              fill="#FFFFFF"
              opacity="0.8"
            />
          </g>

          {/* 3. Cute Animal Head Group with Pleading Head Shake ("Nem-nem!") */}
          <g id="head" className="animate-cute-head">
            {/* Left Ear with Wiggly Animation */}
            <g className="animate-ear-left">
              {/* Outer Ear */}
              <path
                d="M58 46 C48 18 60 6 74 14 C86 22 80 44 74 50 Z"
                fill="url(#shibaFur)"
                stroke="#B45309"
                strokeWidth="1.2"
              />
              {/* Inner Pink Ear */}
              <path
                d="M62 42 C54 24 62 14 72 20 C78 26 74 40 70 44 Z"
                fill="url(#earPink)"
              />
              {/* Fluffy white ear tuft */}
              <path
                d="M56 46 Q63 42 68 48 Q73 42 78 50"
                fill="none"
                stroke="#FFF7ED"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </g>

            {/* Right Ear with Wiggly Animation */}
            <g className="animate-ear-right">
              {/* Outer Ear */}
              <path
                d="M130 46 C140 18 128 6 114 14 C102 22 108 44 114 50 Z"
                fill="url(#shibaFur)"
                stroke="#B45309"
                strokeWidth="1.2"
              />
              {/* Inner Pink Ear */}
              <path
                d="M126 42 C134 24 126 14 116 20 C110 26 114 40 118 44 Z"
                fill="url(#earPink)"
              />
              {/* Fluffy white ear tuft */}
              <path
                d="M132 46 Q125 42 120 48 Q115 42 110 50"
                fill="none"
                stroke="#FFF7ED"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </g>

            {/* Chubby Round Head Base */}
            <path
              d="M60 64 C54 44 72 32 94 32 C116 32 134 44 128 64 C136 80 126 98 94 98 C62 98 52 80 60 64 Z"
              fill="url(#shibaFur)"
              stroke="#B45309"
              strokeWidth="1.4"
            />

            {/* Fluffy Cream Muzzle */}
            <path
              d="M70 68 C70 58 82 56 94 56 C106 56 118 58 118 68 C118 84 106 92 94 92 C82 92 70 84 70 68 Z"
              fill="url(#shibaCream)"
            />

            {/* Distinctive White Shiba Eyebrow Dots */}
            <circle cx="80" cy="43" r="4.2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="108" cy="43" r="4.2" fill="#FFFFFF" opacity="0.9" />

            {/* Pleading Arched Eyebrows ("Ne menj el!") */}
            <path
              d="M75 39 Q81 35 87 40"
              fill="none"
              stroke="#78350F"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M101 40 Q107 35 113 39"
              fill="none"
              stroke="#78350F"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Cute Rosy Blushing Cheeks */}
            <ellipse cx="67" cy="72" rx="7.5" ry="4.5" fill="#FF6B8B" opacity="0.65" />
            <ellipse cx="121" cy="72" rx="7.5" ry="4.5" fill="#FF6B8B" opacity="0.65" />
            {/* Cheek Sparkles */}
            <path
              d="M67 69 L67 75 M64 72 L70 72"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M121 69 L121 75 M118 72 L124 72"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Eye Sockets & Interactive Cursor-Tracking Pupils */}
            {/* Left Eye */}
            <g id="leftEye">
              {/* Sclera / Eye White */}
              <ellipse
                cx="81"
                cy="57"
                rx="8.5"
                ry="10.2"
                fill="#FFFFFF"
                stroke="#451A03"
                strokeWidth="1.5"
              />

              {/* Cursor Tracking Iris & Glints */}
              <g
                style={{
                  transform: `translate(${pupilOffset.left.x}px, ${pupilOffset.left.y}px)`,
                  transition: "transform 0.05s ease-out",
                }}
              >
                {/* Glossy Dark Iris */}
                <ellipse cx="81" cy="57" rx="6.2" ry="7.6" fill="url(#cuteIris)" />
                {/* Deep Pupil */}
                <ellipse cx="81" cy="57" rx="4.2" ry="5.4" fill="#0A0503" />
                {/* Big Primary Anime Sparkle */}
                <circle cx="79.2" cy="54.2" r="2.7" fill="#FFFFFF" />
                {/* Secondary Cute Twinkle */}
                <circle cx="83.6" cy="60.2" r="1.5" fill="#FFFFFF" />
                {/* Soft Lavender Lower Glint */}
                <circle cx="80.5" cy="61.8" r="0.9" fill="#DDD6FE" />
              </g>
            </g>

            {/* Right Eye */}
            <g id="rightEye">
              {/* Sclera / Eye White */}
              <ellipse
                cx="107"
                cy="57"
                rx="8.5"
                ry="10.2"
                fill="#FFFFFF"
                stroke="#451A03"
                strokeWidth="1.5"
              />

              {/* Cursor Tracking Iris & Glints */}
              <g
                style={{
                  transform: `translate(${pupilOffset.right.x}px, ${pupilOffset.right.y}px)`,
                  transition: "transform 0.05s ease-out",
                }}
              >
                {/* Glossy Dark Iris */}
                <ellipse cx="107" cy="57" rx="6.2" ry="7.6" fill="url(#cuteIris)" />
                {/* Deep Pupil */}
                <ellipse cx="107" cy="57" rx="4.2" ry="5.4" fill="#0A0503" />
                {/* Big Primary Anime Sparkle */}
                <circle cx="105.2" cy="54.2" r="2.7" fill="#FFFFFF" />
                {/* Secondary Cute Twinkle */}
                <circle cx="109.6" cy="60.2" r="1.5" fill="#FFFFFF" />
                {/* Soft Lavender Lower Glint */}
                <circle cx="106.5" cy="61.8" r="0.9" fill="#DDD6FE" />
              </g>
            </g>

            {/* Cute Little Button Nose */}
            <path
              d="M90 66 Q94 64 98 66 Q98 71 94 73 Q90 71 90 66 Z"
              fill="#24140D"
            />
            {/* Nose Highlight */}
            <circle cx="92.5" cy="66.5" r="1.2" fill="#FFFFFF" opacity="0.8" />

            {/* Adorable Pleading :3 Mouth */}
            <path
              d="M87 74 Q90.5 78 94 74 Q97.5 78 101 74"
              fill="none"
              stroke="#24140D"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Tiny pink tongue peeking out */}
            <path
              d="M92 75.5 Q94 80 96 75.5 Z"
              fill="#FF6B8B"
            />
          </g>

          {/* 4. Animated Right Paw Waving "Nem-nem!" (protest gesture) */}
          <g id="rightPaw" className="animate-paw-wave">
            {/* Fluffy Raised Paw */}
            <path
              d="M126 96 C126 82 138 78 146 84 C153 90 148 104 136 106 Z"
              fill="url(#shibaFur)"
              stroke="#B45309"
              strokeWidth="1.2"
            />
            {/* Cream Inner Paw Tuft */}
            <circle cx="138" cy="92" r="6.5" fill="url(#shibaCream)" opacity="0.8" />

            {/* Pink Main Heart Paw Pad */}
            <path
              d="M134 92 Q138 89 142 92 Q138 97 134 92 Z"
              fill="#FF8BA0"
            />

            {/* Pink Toe Beans */}
            <circle cx="132" cy="85" r="1.9" fill="#FF8BA0" />
            <circle cx="138" cy="82" r="1.9" fill="#FF8BA0" />
            <circle cx="144" cy="85" r="1.9" fill="#FF8BA0" />
          </g>
        </svg>
      </div>
    </div>
  );
};
