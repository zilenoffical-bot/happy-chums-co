import type { FC, MouseEvent } from "react";
import pandaFrames from "@/assets/disconnect-panda-frames.png.asset.json";
import { cn } from "@/lib/utils";

interface DisconnectMascotProps {
  visible: boolean;
  onPlaySound?: (sound: "hover" | "select" | "back") => void;
}

export const DisconnectMascot: FC<DisconnectMascotProps> = ({
  visible,
  onPlaySound,
}) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onPlaySound?.("select");
  };

  return (
    <div
      className={cn(
        "disconnect-panda absolute bottom-[calc(100%-9px)] left-1/2 z-0 -translate-x-1/2 select-none",
        visible ? "disconnect-panda-visible" : "disconnect-panda-hidden",
      )}
      aria-hidden={!visible}
      onClick={handleClick}
    >
      <div className="disconnect-panda-frame" aria-label="A kilépés ellen tiltakozó panda">
        <img
          src={pandaFrames.url}
          alt=""
          draggable={false}
          className="disconnect-panda-strip"
        />
      </div>
    </div>
  );
};