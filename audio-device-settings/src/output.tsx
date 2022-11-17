import { execaSync } from "execa";
import { ActionPanel, Action, closeMainWindow, Icon, List, popToRoot, showHUD } from "@raycast/api";

type AudioSource = {
  name: string;
  type: string;
  id: string;
  uid: string;
  icon?: Icon.Checkmark | null;
};

export default function main() {
  // 音声入力デバイス一覧取得
  function getInputAudioDevices() {
    const script = `
      on run
        set theSwitch to "/opt/homebrew/bin/SwitchAudioSource"
        do shell script theSwitch & " -f json -t output -a"
      end run
    `;
    const { stdout } = execaSync("osascript", ["-e", script]);
    return stdout.split("\r").map((v) => JSON.parse(v));
  }

  // 現在の音声入力デバイス取得
  function getCurrentInputAudioDevice() {
    const script = `
      on run
        set theSwitch to "/opt/homebrew/bin/SwitchAudioSource"
        do shell script theSwitch & " -f json -t output -c"
      end run
    `;
    const { stdout } = execaSync("osascript", ["-e", script]);
    return stdout.split("\r").map((v) => JSON.parse(v));
  }

  // 音声入力デバイスを選択
  function setInputAudioDevice(v: AudioSource) {
    const script = `
      on run
        set theSwitch to "/opt/homebrew/bin/SwitchAudioSource"
        do shell script theSwitch & " -t output -i ${v.id}"
      end run
    `;
    const { stdout } = execaSync("osascript", ["-e", script]);
    return stdout.split("\r");
  }

  const [currentInputAudioDevice] = getCurrentInputAudioDevice();
  const inputAudioDevices = getInputAudioDevices().map((v): AudioSource => {
    v.id === currentInputAudioDevice.id ? (v.icon = Icon.Checkmark) : (v.icon = null);
    return v;
  });

  return (
    <List>
      {inputAudioDevices.map((v) => (
        <List.Item
          key={v.id}
          id={v.id}
          icon={Icon.Microphone}
          title={v.name}
          subtitle={v.uid}
          accessories={[{ icon: v.icon }]}
          actions={
            <ActionPanel>
              <Action
                title="Select"
                onAction={() => {
                  setInputAudioDevice(v);
                  closeMainWindow({ clearRootSearch: true });
                  popToRoot({ clearSearchBar: true });
                  showHUD(`Active output audio device set to ${v.name}`);
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
