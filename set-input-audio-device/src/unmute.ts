import { execaSync } from "execa";

import { closeMainWindow, popToRoot, showHUD } from "@raycast/api";
export default async function main() {
  const { stdout } = execaSync("osascript", ["-e", "set volume input volume 100"]);
  const data = stdout.split("\r");
  console.log(data);

  closeMainWindow({ clearRootSearch: true });
  popToRoot({ clearSearchBar: true });
  showHUD(`Unmuted input audio device.`);
}
