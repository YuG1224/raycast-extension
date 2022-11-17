import { execaSync } from "execa";
import { closeMainWindow, popToRoot, showHUD } from "@raycast/api";

export default async function main() {
  const currentVolume = execaSync("osascript", ["-e", "input volume of (get volume settings)"]).stdout;

  console.log(Number(currentVolume) > 0);

  if (Number(currentVolume) > 0) {
    execaSync("osascript", ["-e", "set volume input volume 0"]).stdout;
  } else {
    execaSync("osascript", ["-e", "set volume input volume 100"]).stdout;
  }

  closeMainWindow({ clearRootSearch: true });
  popToRoot({ clearSearchBar: true });
  showHUD(`${Number(currentVolume) > 0 ? "Muted" : "Unmuted"} input audio device.`);
}
