import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpenText,
  Check,
  CircleHelp,
  Compass,
  Copy,
  FileCode2,
  FileText,
  Gamepad2,
  LogOut,
  MapPin,
  MapPinned,
  Music2,
  Newspaper,
  Pin,
  PinOff,
  Power,
  Radio,
  Search,
  Settings,
  ShieldAlert,
  UsersRound,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState, type ElementType } from "react";
import cityImage from "@/assets/szcode-city.jpg";
import tileHelp from "@/assets/tile-help.jpg";
import tileMap from "@/assets/tile-map.jpg";
import tileNews from "@/assets/tile-news.jpg";
import tilePlayers from "@/assets/tile-players.jpg";
import tileReturn from "@/assets/tile-return.jpg";
import tileRules from "@/assets/tile-rules.jpg";
import tileSettings from "@/assets/tile-settings.jpg";
import tileDisconnect from "@/assets/images/tile_disconnect_1789630062771.jpg";
import { Button } from "@/components/ui/button";
import { DisconnectMascot } from "@/components/DisconnectMascot";
import { cn } from "@/lib/utils";
import { clientLuaCode, configLuaCode, fxmanifestCode } from "@/lib/fivemSnippets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SzCode Pause Menu | FiveM UI" },
      {
        name: "description",
        content: "Egyedi, képes rácsrendszerű FiveM pause menu SzCode fejlesztésében.",
      },
      { property: "og:title", content: "SzCode Pause Menu | FiveM UI" },
      {
        property: "og:description",
        content: "Egyedi, képes rácsrendszerű FiveM pause menu SzCode fejlesztésében.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tile = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: ElementType;
  image: string;
  area: string;
  fromDirection: "left" | "right" | "top" | "bottom" | "center";
  delay: number;
  badge?: string;
  accent?: boolean;
  danger?: boolean;
};

const tiles: Tile[] = [
  {
    id: "players",
    title: "Játékosok",
    eyebrow: "Közösség",
    description: "128 játékos online",
    icon: UsersRound,
    image: tilePlayers,
    area: "tile-players",
    fromDirection: "left",
    delay: 80,
    badge: "128 / 256 ONLINE",
  },
  {
    id: "settings",
    title: "Beállítások",
    eyebrow: "Személyre szabás",
    description: "Grafika, hang és irányítás",
    icon: Settings,
    image: tileSettings,
    area: "tile-settings",
    fromDirection: "top",
    delay: 150,
    badge: "AUDIO & VIDEO",
  },
  {
    id: "news",
    title: "Friss Hírek",
    eyebrow: "Szerverfrissítés",
    description: "Megérkezett a Night Shift v2.4 frissítés!",
    icon: Newspaper,
    image: tileNews,
    area: "tile-news",
    fromDirection: "right",
    delay: 220,
    badge: "V2.4 PATCH",
  },
  {
    id: "rules",
    title: "Szabályzat",
    eyebrow: "Kötelező Olvasmány",
    description: "Játssz tisztán. Maradj karakterben.",
    icon: BookOpenText,
    image: tileRules,
    area: "tile-rules",
    fromDirection: "left",
    delay: 290,
    badge: "RP ETIKETT",
  },
  {
    id: "map",
    title: "Várostérkép",
    eyebrow: "Los Santos",
    description: "Helyszínek, zónák és GPS útvonalak",
    icon: MapPinned,
    image: tileMap,
    area: "tile-map",
    fromDirection: "center",
    delay: 360,
    badge: "GPS AKTÍV",
    accent: true,
  },
  {
    id: "help",
    title: "Segítség",
    eyebrow: "Támogatás",
    description: "Parancsok és gyakori kérdések",
    icon: CircleHelp,
    image: tileHelp,
    area: "tile-help",
    fromDirection: "bottom",
    delay: 430,
    badge: "GYIK & /REPORT",
  },
  {
    id: "return",
    title: "Vissza a játékba",
    eyebrow: "Folytatás",
    description: "ESC billentyűvel vagy kattintással",
    icon: Gamepad2,
    image: tileReturn,
    area: "tile-return",
    fromDirection: "bottom",
    delay: 500,
    badge: "ESC",
    accent: true,
  },
  {
    id: "disconnect",
    title: "Lecsatlakozás",
    eyebrow: "Szerver Elhagyása",
    description: "Visszatérés a FiveM főmenübe",
    icon: LogOut,
    image: tileDisconnect,
    area: "tile-disconnect",
    fromDirection: "bottom",
    delay: 570,
    badge: "DISCONNECT",
    danger: true,
  },
];

const BASE_WIDTH = 1180;
const BASE_HEIGHT = 620;

function Index() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [closing, setClosing] = useState(false);
  const [menuSession, setMenuSession] = useState(1);
  const [active, setActive] = useState<Tile | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(35);
  const [sfxVolume, setSfxVolume] = useState(70);
  const [graphicsPreset, setGraphicsPreset] = useState("Magas");
  const [playerSearch, setPlayerSearch] = useState("");
  const [isFiveM, setIsFiveM] = useState(false);
  const [uiScale, setUiScale] = useState(1);
  const [showFiveMGuide, setShowFiveMGuide] = useState(false);
  const [guideTab, setGuideTab] = useState<"client" | "fxmanifest" | "config" | "install">("client");
  const [copiedCode, setCopiedCode] = useState(false);
  const [testDisconnectHover, setTestDisconnectHover] = useState(false);
  const [isDisconnectHovered, setIsDisconnectHovered] = useState(false);
  const [hoverCountdown, setHoverCountdown] = useState<number | null>(null);

  const triggerDisconnectHoverTest = (durationSec = 4) => {
    setTestDisconnectHover(true);
    setHoverCountdown(durationSec);
    playMenuSound("select");
  };

  const toggleDisconnectHoverLock = () => {
    setHoverCountdown(null);
    setTestDisconnectHover((prev) => !prev);
    playMenuSound("select");
  };

  useEffect(() => {
    if (hoverCountdown === null) return;
    if (hoverCountdown <= 0) {
      setTestDisconnectHover(false);
      setHoverCountdown(null);
      return;
    }
    const timer = setTimeout(() => {
      setHoverCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [hoverCountdown]);

  const sendToFiveM = (eventName: string, data: Record<string, unknown> = {}) => {
    const parent = (window as Window & { GetParentResourceName?: () => string }).GetParentResourceName;
    if (typeof parent !== "function") {
      console.log(`[FiveM NUI Event]: ${eventName}`, data);
      return;
    }
    void fetch(`https://${parent()}/${eventName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data),
    });
  };

  useEffect(() => {
    setIsFiveM(typeof (window as Window & { GetParentResourceName?: () => string }).GetParentResourceName === "function");
  }, []);

  // Compute responsive UI scaling so the 4x3 grid remains 100% FIXED
  useEffect(() => {
    const calculateScale = () => {
      const paddingX = window.innerWidth < 640 ? 12 : 32;
      const paddingY = window.innerHeight < 640 ? 12 : 32;
      const availW = Math.max(100, window.innerWidth - paddingX * 2);
      const availH = Math.max(100, window.innerHeight - paddingY * 2);

      const factor = Math.min(availW / BASE_WIDTH, availH / BASE_HEIGHT);
      setUiScale(Math.min(1.05, Math.max(0.28, factor)));
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  const playMenuSound = (tone: "select" | "close" | "hover" | "back" = "select") => {
    if (!soundEnabled) return;
    const AudioContextClass =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = tone === "hover" ? "triangle" : "sine";
      const freq =
        tone === "select" ? 620 : tone === "close" || tone === "back" ? 330 : 440;
      oscillator.frequency.setValueAtTime(freq, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(tone === "hover" ? 0.025 : 0.055, context.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + (tone === "hover" ? 0.06 : 0.11));
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + (tone === "hover" ? 0.07 : 0.12));
      oscillator.addEventListener("ended", () => void context.close());
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const openMenu = () => {
    setClosing(false);
    setMenuSession((prev) => prev + 1);
    setMenuOpen(true);
    playMenuSound("select");
    sendToFiveM("menuOpened", {});
  };

  const closeMenu = () => {
    if (closing) return;
    playMenuSound("close");
    sendToFiveM("closePauseMenu");
    setClosing(true);
    window.setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 360);
  };

  // Keyboard navigation (ESC support)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (active) {
          setActive(null);
        } else if (menuOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, menuOpen, closing]);

  // FiveM NUI Message listener
  useEffect(() => {
    const handleNuiMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;
      if (data.action === "open" || data.type === "openPauseMenu") {
        openMenu();
      } else if (data.action === "close" || data.type === "closePauseMenu") {
        closeMenu();
      }
    };
    window.addEventListener("message", handleNuiMessage);
    return () => window.removeEventListener("message", handleNuiMessage);
  }, []);

  const handleDisconnect = () => {
    playMenuSound("close");
    // FiveM szerver lecsatlakozás: a kliens parancs futtatása (ExecuteCommand("disconnect"))
    // Ez NEM zárja be a teljes FiveM klienst (nem 'quit'), csupán visszatér a FiveM főmenüjébe!
    sendToFiveM("disconnect", { action: "disconnect", dropToLobby: true });
    sendToFiveM("executeCommand", { command: "disconnect" });

    setClosing(true);
    window.setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
      setActive(null);
    }, 320);
  };

  const chooseTile = (tile: Tile) => {
    playMenuSound("select");

    // Tényleges FiveM kliens események hívása a csempéknek megfelelően
    switch (tile.id) {
      case "return":
        // Menü bezárása és visszatérés a játékba
        closeMenu();
        return;
      case "disconnect":
        // Megnyitja a megerősítő panelt és értesíti a FiveM klienst
        sendToFiveM("openDisconnectModal", { action: "disconnectConfirm" });
        sendToFiveM("openSection", { section: "disconnect" });
        break;
      case "map":
        // FiveM natív térkép megnyitása
        sendToFiveM("openMap", { action: "openMap" });
        sendToFiveM("openSection", { section: "map" });
        break;
      case "settings":
        // Beállítások megnyitása FiveM-ben
        sendToFiveM("openSettings", { action: "openSettings" });
        sendToFiveM("openSection", { section: "settings" });
        break;
      case "players":
        // Játékoslista / Scoreboard megnyitása FiveM-ben
        sendToFiveM("openPlayerList", { action: "openPlayerList" });
        sendToFiveM("openSection", { section: "players" });
        break;
      case "rules":
        // Szerverszabályzat megnyitása
        sendToFiveM("openRules", { action: "openRules" });
        sendToFiveM("openSection", { section: "rules" });
        break;
      case "news":
        // Friss hírek / changelog megnyitása
        sendToFiveM("openNews", { action: "openNews" });
        sendToFiveM("openSection", { section: "news" });
        break;
      case "help":
        // Segítség / Report felület megnyitása
        sendToFiveM("openHelp", { action: "openHelp" });
        sendToFiveM("openSection", { section: "help" });
        break;
      default:
        sendToFiveM("openSection", { section: tile.id });
        break;
    }

    // Modal felugró megjelenítése a csempe funkcióhoz
    setActive(tile);
  };

  return (
    <main
      className={cn(
        "relative min-h-screen w-full overflow-hidden text-foreground select-none",
        isFiveM ? "bg-transparent" : "bg-background",
      )}
    >
      {/* Background City Artwork */}
      {!isFiveM && (
        <img
          src={cityImage}
          alt="Esti panoráma a fiktív Los Santos városáról"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover scale-105 filter blur-[1px] brightness-75 transition-transform duration-1000"
        />
      )}

      {/* Atmospheric Vignette Wash */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-500",
          menuOpen ? "opacity-100" : "opacity-0",
          isFiveM ? "bg-black/55" : "bg-scene-wash",
        )}
        aria-hidden="true"
      />

      {/* Closed State - Reopen Button */}
      {!menuOpen ? (
        <div className="relative z-10 grid min-h-screen place-items-center px-6">
          <div className="text-center animate-detail-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 backdrop-blur-md">
              <span className="size-2 rounded-full bg-status animate-pulse" />
              <p className="font-mono text-xs uppercase tracking-widest text-scene-muted">Játék folyamatban</p>
            </div>
            <div>
              <Button
                onClick={openMenu}
                className="gap-2.5 px-6 py-3 font-display text-base font-bold uppercase tracking-wider shadow-panel transition-all hover:scale-105"
              >
                <Gamepad2 size={20} aria-hidden="true" /> Pause menu megnyitása (ESC)
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Scaled Responsive Viewport Container (keeps layout strictly FIXED - only the tiles, no header or footer) */
        <div className="relative z-10 flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
          <div
            key={menuSession}
            style={{
              width: `${BASE_WIDTH}px`,
              height: `${BASE_HEIGHT}px`,
              transform: `scale(${uiScale})`,
              transformOrigin: "center center",
            }}
            className="relative flex items-center justify-center shrink-0 select-none transition-transform duration-100 ease-out"
          >
            {/* Fixed 4-column x 3-row Tile Grid */}
            <div className="pause-grid w-full h-full">
              {tiles.map((tile) => {
                const Icon = tile.icon;
                const enterClass = `tile-enter-${tile.fromDirection}`;
                const exitClass = `tile-exit-${tile.fromDirection}`;

                if (tile.id === "disconnect") {
                  return (
                    <div
                      key={tile.id}
                      className={cn(
                        tile.area,
                        "relative group/disconnect z-30 h-full w-full overflow-visible",
                      )}
                      onMouseEnter={() => setIsDisconnectHovered(true)}
                      onMouseLeave={() => setIsDisconnectHovered(false)}
                    >
                      {/* Interactive Custom Mascot: Eye-tracking + finger wagging "Nem szabad!" */}
                      <DisconnectMascot
                        visible={isDisconnectHovered || testDisconnectHover}
                        onPlaySound={playMenuSound}
                      />

                      <Button
                        variant="ghost"
                        onClick={() => chooseTile(tile)}
                        onMouseEnter={() => playMenuSound("hover")}
                        className={cn(
                          closing ? exitClass : enterClass,
                          "group relative h-full w-full min-w-0 justify-start overflow-hidden rounded-md border border-border/80 bg-tile p-0 text-left text-foreground shadow-tile backdrop-blur-md transition-all duration-200 hover:border-red-500 hover:bg-tile-active hover:shadow-[0_0_28px_rgba(239,68,68,0.38)] focus-visible:border-primary",
                          "border-red-500/40",
                          "disconnect-hover-shake disconnect-neon-glow hover:border-red-400 hover:bg-red-950/70",
                          (testDisconnectHover || isDisconnectHovered) &&
                            "disconnect-shake-active disconnect-neon-active border-red-400 bg-red-950/70 shadow-[0_0_24px_rgba(239,68,68,0.85)]",
                        )}
                        style={{
                          animationDelay: closing ? "0ms" : `${tile.delay}ms`,
                        }}
                      >
                        {/* Shimmering laser light sweep along the top border */}
                        <div
                          className={cn(
                            "pointer-events-none absolute inset-x-0 top-0 z-30 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent transition-opacity duration-300 laser-sweep-active",
                            testDisconnectHover || isDisconnectHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                          )}
                        />

                        {/* Top slide-out warning micro-ribbon that drops down from the top edge */}
                        <div
                          className={cn(
                            "pointer-events-none absolute inset-x-0 top-0 z-20 overflow-hidden transform transition-all duration-250 ease-out",
                            testDisconnectHover || isDisconnectHovered
                              ? "translate-y-0 opacity-100"
                              : "-translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                          )}
                        >
                          <div className="relative flex items-center justify-between gap-2 border-b border-red-500/40 bg-gradient-to-r from-red-950/95 via-red-900/95 to-red-950/95 px-3 py-0.5 backdrop-blur-md shadow-md">
                            <div className="flex items-center gap-1 font-mono text-[8px] font-bold uppercase tracking-wider text-red-100">
                              <span className="relative flex size-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex size-1.5 rounded-full bg-red-500" />
                              </span>
                              <span>SZERVER KAPCSOLAT BONTÁSA</span>
                            </div>
                            <span className="font-mono text-[7px] font-bold text-red-300">
                              FIVEM FŐMENÜ
                            </span>
                          </div>
                        </div>

                        {/* Tile Background Image */}
                        <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
                          <img
                            src={tile.image}
                            alt=""
                            className={cn(
                              "h-full w-full object-cover opacity-35 transition-transform duration-700 ease-out group-hover:scale-108 group-hover:opacity-60",
                              (testDisconnectHover || isDisconnectHovered) && "scale-108 opacity-60",
                            )}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />
                          <div
                            className={cn(
                              "absolute inset-0 bg-red-950/40 opacity-70 group-hover:opacity-95 group-hover:bg-red-950/60 transition-colors",
                              (testDisconnectHover || isDisconnectHovered) && "opacity-95 bg-red-950/60",
                            )}
                          />
                        </div>

                        {/* Compact Horizontal Disconnect Layout (46px height) */}
                        <div className="relative z-10 flex h-full w-full items-center justify-between px-3.5 py-1.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={cn(
                                "grid size-7 shrink-0 place-items-center rounded border border-red-500/60 bg-red-950/70 text-red-400 backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:border-red-400 group-hover:bg-red-800/80 group-hover:text-white group-hover:shadow-[0_0_14px_rgba(239,68,68,0.7)]",
                                (testDisconnectHover || isDisconnectHovered) &&
                                  "scale-110 border-red-400 bg-red-800/80 text-white shadow-[0_0_14px_rgba(239,68,68,0.7)]",
                              )}
                            >
                              <Icon size={14} strokeWidth={2.2} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={cn(
                                    "font-mono text-[8.5px] uppercase tracking-wider text-red-400 font-bold group-hover:text-red-300 transition-colors",
                                    (testDisconnectHover || isDisconnectHovered) && "text-red-300",
                                  )}
                                >
                                  SZERVER
                                </span>
                                <span
                                  className={cn(
                                    "font-display text-xs font-bold uppercase tracking-wider text-white group-hover:text-red-200 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all",
                                    (testDisconnectHover || isDisconnectHovered) &&
                                      "text-red-200 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]",
                                  )}
                                >
                                  {tile.title}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={cn(
                                "rounded bg-black/70 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-red-300/90 border border-red-500/40 group-hover:border-red-400 group-hover:bg-red-950/90 group-hover:text-red-100 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.6)] transition-all",
                                (testDisconnectHover || isDisconnectHovered) &&
                                  "border-red-400 bg-red-950/90 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.6)]",
                              )}
                            >
                              {tile.badge}
                            </span>
                            <ArrowLeft
                              className={cn(
                                "rotate-180 text-red-400/80 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-red-200",
                                (testDisconnectHover || isDisconnectHovered) && "translate-x-0.5 opacity-100 text-red-200",
                              )}
                              size={14}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </Button>
                    </div>
                  );
                }

                return (
                  <Button
                    key={tile.id}
                    variant="ghost"
                    onClick={() => chooseTile(tile)}
                    className={cn(
                      tile.area,
                      closing ? exitClass : enterClass,
                      "group relative h-full w-full min-w-0 justify-start overflow-hidden rounded-md border border-border/80 bg-tile p-0 text-left text-foreground shadow-tile backdrop-blur-md transition-all duration-200 hover:border-primary hover:bg-tile-active hover:shadow-panel focus-visible:border-primary",
                      tile.accent && "border-primary/50",
                      tile.danger && "border-red-500/40 hover:border-red-500 hover:shadow-[0_0_28px_rgba(239,68,68,0.38)]",
                    )}
                    style={{
                      animationDelay: closing ? "0ms" : `${tile.delay}ms`,
                    }}
                  >
                    {/* Tile Background Image with subtle cinematic zoom */}
                    <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
                      <img
                        src={tile.image}
                        alt=""
                        className="h-full w-full object-cover opacity-35 transition-transform duration-700 ease-out group-hover:scale-108 group-hover:opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />
                      {tile.accent && (
                        <div className="absolute inset-0 bg-primary/10 opacity-60 group-hover:opacity-90" />
                      )}
                      {tile.danger && (
                        <div className="absolute inset-0 bg-red-950/40 opacity-70 group-hover:opacity-95 group-hover:bg-red-950/60 transition-colors" />
                      )}
                    </div>

                    {/* Standard Vertical Full-Card Layout for other tiles */}
                    <div className="relative z-10 flex h-full w-full flex-col justify-between p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "grid size-10 shrink-0 place-items-center rounded-md border border-border bg-black/60 text-muted-foreground backdrop-blur-sm transition-all duration-200 group-hover:scale-105 group-hover:border-primary group-hover:text-primary",
                            tile.accent && "border-primary text-primary bg-primary/20",
                          )}
                        >
                          <Icon size={21} strokeWidth={1.9} aria-hidden="true" />
                        </span>

                        {/* Status badge or direction arrow */}
                        <div className="flex items-center gap-1.5">
                          {tile.badge && (
                            <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/60 transition-colors group-hover:border-primary/60 group-hover:text-primary">
                              {tile.badge}
                            </span>
                          )}
                          <ArrowLeft
                            className="rotate-180 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-primary"
                            size={16}
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <div className="mt-4 min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-widest font-semibold text-primary">
                          {tile.eyebrow}
                        </p>
                        <h2 className="mt-0.5 truncate font-display text-xl font-bold uppercase tracking-wide sm:text-2xl text-white transition-colors group-hover:text-primary">
                          {tile.title}
                        </h2>
                        <p className="mt-1 truncate text-xs text-zinc-300 font-medium">
                          {tile.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detail Dialog for Selected Tile */}
      {active && (
        <div
          className="absolute inset-0 z-30 grid place-items-center bg-modal px-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
        >
          <div className="w-full max-w-xl rounded-lg border border-border bg-panel p-6 shadow-panel animate-detail-in sm:p-8">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-semibold">
                  {active.eyebrow}
                </p>
                <h2 id="detail-title" className="mt-1 truncate font-display text-3xl font-black uppercase text-white">
                  {active.title}
                </h2>
              </div>
              <Button
                variant="icon"
                aria-label="Részletek bezárása"
                title="Bezárás"
                onClick={() => setActive(null)}
                className="rounded-md border border-border hover:border-primary hover:text-primary"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="my-5 h-px bg-border/80" />

            {/* Content for PLAYERS */}
            {active.id === "players" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    placeholder="Játékos vagy ID keresése..."
                    value={playerSearch}
                    onChange={(e) => setPlayerSearch(e.target.value)}
                    className="w-full rounded-md border border-border bg-card/70 py-2 pl-9 pr-4 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1 font-mono text-xs">
                  {[
                    { id: 1, name: "Jack_Miller", role: "Rendőrség", ping: "16ms" },
                    { id: 4, name: "Sarah_Connor", role: "Mentőszolgálat", ping: "22ms" },
                    { id: 12, name: "Dave_Ross", role: "Szerelőtelep", ping: "19ms" },
                    { id: 28, name: "Alex_Kovacs", role: "Polgár", ping: "25ms" },
                    { id: 56, name: "Elena_Vance", role: "Polgár", ping: "28ms" },
                  ]
                    .filter((p) => p.name.toLowerCase().includes(playerSearch.toLowerCase()))
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-md border border-border/60 bg-card/60 px-3 py-2 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="rounded bg-primary/20 px-1.5 py-0.5 font-bold text-primary">#{p.id}</span>
                          <span className="font-sans font-medium text-foreground">{p.name}</span>
                          <span className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-zinc-400">{p.role}</span>
                        </div>
                        <span className="text-[10px] text-primary">{p.ping}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Content for SETTINGS */}
            {active.id === "settings" && (
              <div className="space-y-4 rounded-md border border-border bg-icon/50 p-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-medium">
                    <label htmlFor="music-vol" className="flex items-center gap-2">
                      <Music2 size={16} className="text-primary" /> Zenei hangerő
                    </label>
                    <span className="font-mono text-primary">{musicVolume}%</span>
                  </div>
                  <input
                    id="music-vol"
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setMusicVolume(v);
                      sendToFiveM("setMusicVolume", { volume: v / 100 });
                    }}
                    className="volume-slider w-full"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-medium">
                    <label htmlFor="sfx-vol" className="flex items-center gap-2">
                      <Volume2 size={16} className="text-primary" /> Hangeffektek (SFX)
                    </label>
                    <span className="font-mono text-primary">{sfxVolume}%</span>
                  </div>
                  <input
                    id="sfx-vol"
                    type="range"
                    min="0"
                    max="100"
                    value={sfxVolume}
                    onChange={(e) => setSfxVolume(Number(e.target.value))}
                    className="volume-slider w-full"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-xs text-muted-foreground">Grafikai előbeállítás</span>
                  <div className="flex gap-1.5">
                    {["Normál", "Magas", "Ultra"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setGraphicsPreset(preset)}
                        className={cn(
                          "rounded px-2.5 py-1 font-mono text-xs transition-colors",
                          graphicsPreset === preset
                            ? "bg-primary font-bold text-primary-foreground"
                            : "border border-border bg-card/60 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Content for RULES */}
            {active.id === "rules" && (
              <div className="space-y-3 font-sans text-xs leading-relaxed text-muted-foreground">
                <div className="rounded border border-border/70 bg-card/50 p-3">
                  <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-foreground">
                    <ShieldAlert size={16} className="text-primary" /> 1. FearRP & Karakterhűség
                  </div>
                  <p className="mt-1">
                    Értékeld a karaktered életét minden körülmények között. Fegyveres fenyegetés esetén engedelmeskedj.
                  </p>
                </div>
                <div className="rounded border border-border/70 bg-card/50 p-3">
                  <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-foreground">
                    <Radio size={16} className="text-primary" /> 2. OOC és Mikrofon Szabályzat
                  </div>
                  <p className="mt-1">
                    Roleplay közben kizárólag in-character beszélj. OOC csevegésre a /b parancs használható.
                  </p>
                </div>
                <div className="rounded border border-border/70 bg-card/50 p-3">
                  <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-foreground">
                    <FileText size={16} className="text-primary" /> 3. VDM & RDM Szigorúan Tilos
                  </div>
                  <p className="mt-1">
                    Járművel szándékosan gázolni vagy ok nélkül játékostársat megtámadni azonnali kitiltást von maga után.
                  </p>
                </div>
              </div>
            )}

            {/* Content for MAP */}
            {active.id === "map" && (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-md border border-border">
                  <img src={tileMap} alt="Los Santos térképe" className="h-44 w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-mono text-primary">
                    <Compass size={16} className="animate-spin" style={{ animationDuration: "12s" }} />
                    <span>GPS Pozíció: Legion Square (X: 195.2, Y: -934.1)</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded border border-border bg-card/60 p-2 text-muted-foreground">
                    <MapPin size={14} className="text-primary inline mr-1.5" /> Pillbox Hospital: 450m
                  </div>
                  <div className="rounded border border-border bg-card/60 p-2 text-muted-foreground">
                    <MapPin size={14} className="text-primary inline mr-1.5" /> Mission Row PD: 320m
                  </div>
                </div>
              </div>
            )}

            {/* Content for NEWS */}
            {active.id === "news" && (
              <div className="space-y-3 font-sans text-xs text-muted-foreground">
                <div className="rounded border border-primary/30 bg-primary/10 p-3">
                  <span className="font-mono text-[10px] font-bold uppercase text-primary">Kiemelt frissítés</span>
                  <h3 className="font-display text-base font-bold text-foreground">Night Shift v2.4 Patch Notes</h3>
                  <p className="mt-1">
                    Új éjszakai munkafolyamatok, átdolgozott drogkereskedelem, valamint 12 új egyedi jármű a Premium Deluxe Motorsportban.
                  </p>
                </div>
                <ul className="space-y-1.5 font-mono text-[11px] text-zinc-300">
                  <li>• Új egyedi hangrendszer FiveM pause menühöz</li>
                  <li>• Megnövelt szerver tickrate és optimalizált szinkronizáció</li>
                  <li>• Új ruházati csomagok és kiegészítők</li>
                </ul>
              </div>
            )}

            {/* Content for HELP */}
            {active.id === "help" && (
              <div className="space-y-2.5 font-mono text-xs">
                <div className="rounded border border-border bg-card/60 p-2.5">
                  <span className="font-bold text-primary">/report [indok]</span>
                  <p className="mt-0.5 font-sans text-muted-foreground">Segítségkérés vagy szabálytalanság jelentése az online adminisztrátoroknak.</p>
                </div>
                <div className="rounded border border-border bg-card/60 p-2.5">
                  <span className="font-bold text-primary">/me [cselekvés] & /do [történés]</span>
                  <p className="mt-0.5 font-sans text-muted-foreground">Látható karaktercselekedetek és környezeti események leírása.</p>
                </div>
                <div className="rounded border border-border bg-card/60 p-2.5">
                  <span className="font-bold text-primary">/szamla & /penztad</span>
                  <p className="mt-0.5 font-sans text-muted-foreground">Pénzügyi tranzakciók kezelése a közelben álló játékosokkal.</p>
                </div>
              </div>
            )}

            {/* Content for DISCONNECT */}
            {active.id === "disconnect" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-4">
                  <div className="flex items-center gap-2.5 font-display text-base font-bold uppercase text-red-400">
                    <AlertTriangle size={20} className="shrink-0 text-red-500 animate-pulse" />
                    <span>Szerver kapcsolat bontása</span>
                  </div>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-zinc-300">
                    Valóban el szeretnéd hagyni a szervert? Ez a művelet visszaléptet a <strong>FiveM főmenüjébe</strong>, anélkül hogy a FiveM játék bezáródna.
                  </p>
                </div>

                <div className="rounded-md border border-border/70 bg-card/60 p-3 font-mono text-[11px] text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Power size={14} className="text-red-400" />
                    <span>FiveM Kliens Parancs: <code className="bg-black/60 px-1.5 py-0.5 rounded text-red-300 border border-red-500/30">disconnect</code></span>
                  </div>
                  <p className="text-[10.5px] leading-normal">
                    Nem a teljes játék zárul be (nem &apos;quit&apos;), hanem csak az aktuális szerverkapcsolat szakad meg és a FiveM főmenüje fogad.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <Button
                    variant="ghost"
                    className="px-4 font-mono text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setActive(null)}
                  >
                    Mégse (Vissza a játékba)
                  </Button>
                  <Button
                    variant="destructive"
                    className="gap-2 px-5 font-display text-sm font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-600/30"
                    onClick={handleDisconnect}
                  >
                    <LogOut size={16} /> Lecsatlakozás (Disconnect)
                  </Button>
                </div>
              </div>
            )}

            {active.id !== "disconnect" && (
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  className="px-5 font-display text-sm font-bold uppercase"
                  onClick={() => {
                    playMenuSound("close");
                    setActive(null);
                  }}
                >
                  Bezárás
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Development & Browser Testing Toolbar (Only shown in browser/dev, hidden inside FiveM game) */}
      {!isFiveM && (
        <div className="fixed top-3 right-4 z-40 flex flex-wrap items-center gap-2">
          {/* Disconnect Hover Animation Test Button (4s timed test) */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerDisconnectHoverTest(4)}
            className={cn(
              "gap-1.5 px-3 py-1.5 text-xs font-mono font-bold backdrop-blur-md transition-all shadow-md",
              testDisconnectHover && hoverCountdown !== null
                ? "border-red-500 bg-red-950 text-red-200 shadow-[0_0_18px_rgba(239,68,68,0.7)] animate-pulse"
                : "border-red-500/60 bg-black/85 text-red-400 hover:bg-red-900/60 hover:text-white hover:border-red-400",
            )}
            title="Kattints a lecsatlakozás felett megjelenő interaktív karakter (szemkövetés, nem szabad fejrázás, ujjrázás) 4 másodperces teszteléséhez"
          >
            <Zap size={14} className={testDisconnectHover ? "text-red-400 animate-spin" : "text-red-500"} />
            {testDisconnectHover && hoverCountdown !== null
              ? `Karakter teszt: ${hoverCountdown}s`
              : "Karakter & 'Nem szabad!' Teszt (4s)"}
          </Button>

          {/* Toggle Lock Hover State (to inspect the visual effects permanently) */}
          <Button
            size="sm"
            variant="outline"
            onClick={toggleDisconnectHoverLock}
            className={cn(
              "gap-1 px-2.5 py-1.5 text-xs font-mono backdrop-blur-md transition-all",
              testDisconnectHover && hoverCountdown === null
                ? "border-red-500 bg-red-600 text-white font-bold shadow-[0_0_16px_rgba(239,68,68,0.8)]"
                : "border-border/70 bg-black/85 text-zinc-300 hover:text-white hover:border-zinc-400",
            )}
            title="Karakter és figyelmeztetés folyamatos rögzítése / zárolása"
          >
            {testDisconnectHover && hoverCountdown === null ? (
              <>
                <PinOff size={13} /> Karakter Rögzítve (Ki)
              </>
            ) : (
              <>
                <Pin size={13} /> Karakter Rögzítés
              </>
            )}
          </Button>

          {/* FiveM Code / Lua Snippets modal button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFiveMGuide(true)}
            className="gap-2 border-primary/50 bg-black/80 px-3.5 py-1.5 text-xs font-mono font-bold text-primary backdrop-blur-md hover:bg-primary hover:text-black hover:border-primary shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all"
          >
            <FileCode2 size={14} /> FiveM Kód (Lua)
          </Button>
        </div>
      )}

      {/* Floating Bottom Quick-Test Helper (when Pause Menu is open in browser) */}
      {!isFiveM && menuOpen && !active && (
        <div className="fixed bottom-3 right-4 z-40 flex items-center gap-2 rounded-lg border border-red-500/50 bg-black/90 p-1.5 shadow-[0_0_24px_rgba(0,0,0,0.85)] backdrop-blur-md animate-detail-in">
          <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-red-300 font-bold hidden sm:inline">
            Karakter Teszt:
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => triggerDisconnectHoverTest(4)}
            className={cn(
              "h-7 gap-1.5 px-3 font-mono text-xs font-bold transition-all",
              testDisconnectHover && hoverCountdown !== null
                ? "bg-red-500 text-white shadow-[0_0_14px_rgba(239,68,68,0.9)] animate-pulse"
                : "bg-red-950/90 text-red-200 border border-red-500/60 hover:bg-red-700 hover:text-white",
            )}
            title="Kattints a 'Nem szabad!' karakter animáció 4 másodperces kipróbálásához"
          >
            <Zap size={12} className={testDisconnectHover ? "animate-bounce" : ""} />
            {testDisconnectHover && hoverCountdown !== null
              ? `Karakter aktív (${hoverCountdown}s)...`
              : "Karakter animáció teszt"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleDisconnectHoverLock}
            className={cn(
              "h-7 px-2.5 font-mono text-[11px] transition-all",
              testDisconnectHover && hoverCountdown === null
                ? "bg-red-600 text-white border-red-400 font-bold"
                : "bg-black/60 text-zinc-400 hover:text-white border-zinc-700",
            )}
            title="Karakter megjelenítésének folyamatos rögzítése a lecsatlakozási gombon"
          >
            {testDisconnectHover && hoverCountdown === null ? "Rögzítve ✓" : "Rögzítés"}
          </Button>
        </div>
      )}

      {/* FiveM Integration Helper Modal */}
      {showFiveMGuide && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/85 px-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl rounded-lg border border-border/90 bg-panel p-5 shadow-2xl animate-detail-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded bg-primary/20 text-primary border border-primary/40">
                  <FileCode2 size={18} />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">FiveM Teljes Integráció</h2>
                  <p className="font-mono text-[11px] text-muted-foreground">Kész Lua scriptek, fxmanifest és azonnali beillesztési útmutató</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-zinc-400 hover:text-white"
                onClick={() => setShowFiveMGuide(false)}
              >
                <X size={16} />
              </Button>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex flex-wrap gap-1.5 border-b border-border/60 pb-2.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setGuideTab("client")}
                className={cn(
                  "px-3 py-1.5 rounded transition-all font-semibold",
                  guideTab === "client" ? "bg-primary text-black" : "text-muted-foreground hover:text-white bg-card/60 border border-border/40"
                )}
              >
                client.lua
              </button>
              <button
                type="button"
                onClick={() => setGuideTab("fxmanifest")}
                className={cn(
                  "px-3 py-1.5 rounded transition-all font-semibold",
                  guideTab === "fxmanifest" ? "bg-primary text-black" : "text-muted-foreground hover:text-white bg-card/60 border border-border/40"
                )}
              >
                fxmanifest.lua
              </button>
              <button
                type="button"
                onClick={() => setGuideTab("config")}
                className={cn(
                  "px-3 py-1.5 rounded transition-all font-semibold",
                  guideTab === "config" ? "bg-primary text-black" : "text-muted-foreground hover:text-white bg-card/60 border border-border/40"
                )}
              >
                config.lua
              </button>
              <button
                type="button"
                onClick={() => setGuideTab("install")}
                className={cn(
                  "px-3 py-1.5 rounded transition-all font-semibold",
                  guideTab === "install" ? "bg-primary text-black" : "text-muted-foreground hover:text-white bg-card/60 border border-border/40"
                )}
              >
                Telepítési lépések
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-3 flex-1 overflow-y-auto rounded border border-border/70 bg-black/90 p-3 font-mono text-xs text-zinc-300">
              {guideTab === "install" ? (
                <div className="space-y-3 font-sans text-xs leading-relaxed text-zinc-300">
                  <div className="rounded border border-primary/40 bg-primary/10 p-3">
                    <p className="font-bold text-white font-mono text-xs mb-1">1. Buildelés és fájlok elkészítése</p>
                    <p>Futtasd az <code className="bg-black/80 px-1.5 py-0.5 rounded text-primary font-mono">npm run build</code> parancsot. A létrejövő <code className="text-primary font-mono">dist/</code> mappa tartalmazza a kész HTML/JS/CSS fájlokat FiveM relatív útvonalakkal.</p>
                  </div>
                  <div className="rounded border border-border bg-card/50 p-3">
                    <p className="font-bold text-white font-mono text-xs mb-1">2. FiveM Resource mappa felépítése</p>
                    <pre className="text-[11px] font-mono text-primary/90 bg-black/80 p-2.5 rounded mt-1.5 border border-border/50">
{`resources/[custom]/pausemenu/
  ├── fxmanifest.lua
  ├── client.lua
  ├── config.lua
  └── dist/
       ├── index.html
       └── assets/`}
                    </pre>
                  </div>
                  <div className="rounded border border-border bg-card/50 p-3">
                    <p className="font-bold text-white font-mono text-xs mb-1">3. server.cfg engedélyezés</p>
                    <p>Add hozzá a szerver indító konfigurációjához:</p>
                    <code className="text-primary font-mono bg-black/80 px-2 py-1 rounded block mt-1 border border-border/50">ensure pausemenu</code>
                  </div>
                  <div className="rounded border border-red-500/30 bg-red-950/20 p-3 text-red-200">
                    <p className="font-bold font-mono text-xs text-red-300 mb-1">4. Lecsatlakozás (Disconnect) működése</p>
                    <p>A menü a FiveM natív <code className="bg-black/60 px-1 py-0.5 rounded font-mono text-red-300">ExecuteCommand(&quot;disconnect&quot;)</code> parancsát futtatja le, ami visszaviszi a játékost a FiveM főmenüjébe, és nem zárja be a teljes GTA V alkalmazást.</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="sticky top-0 z-10 flex justify-end pb-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-1.5 font-mono text-[11px] bg-zinc-800 hover:bg-zinc-700 text-white shadow"
                      onClick={() => {
                        const code = guideTab === "client" ? clientLuaCode : guideTab === "fxmanifest" ? fxmanifestCode : configLuaCode;
                        void navigator.clipboard.writeText(code);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                    >
                      {copiedCode ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      {copiedCode ? "Másolva!" : "Kód másolása"}
                    </Button>
                  </div>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed p-2 text-zinc-300">
                    {guideTab === "client" ? clientLuaCode : guideTab === "fxmanifest" ? fxmanifestCode : configLuaCode}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="font-mono text-xs"
                onClick={() => setShowFiveMGuide(false)}
              >
                Bezárás
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Index;

