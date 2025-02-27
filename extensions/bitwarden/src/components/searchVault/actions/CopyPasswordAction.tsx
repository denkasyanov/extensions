import { Clipboard, Icon, showHUD, showToast, Toast } from "@raycast/api";
import ActionWithReprompt from "~/components/actions/ActionWithReprompt";
import { useSelectedVaultItem } from "~/components/searchVault/context/vaultItem";
import { getTransientCopyPreference } from "~/utils/preferences";
import useGetUpdatedVaultItem from "~/components/searchVault/utils/useGetUpdatedVaultItem";
import { captureException } from "~/utils/development";

function CopyPasswordAction() {
  const selectedItem = useSelectedVaultItem();
  const getUpdatedVaultItem = useGetUpdatedVaultItem();

  if (!selectedItem.login?.password) return null;

  const handleCopyPassword = async () => {
    try {
      const password = await getUpdatedVaultItem(selectedItem, (item) => item.login?.password, "Getting password...");
      if (password) await copyPassword(password);
    } catch (error) {
      await showToast(Toast.Style.Failure, "Failed to get password");
      captureException("Failed to copy password", error);
    }
  };

  const copyPassword = async (passwordToCopy: string) => {
    await Clipboard.copy(passwordToCopy, { transient: getTransientCopyPreference("password") });
    await showHUD("Copied password to clipboard");
  };

  return (
    <ActionWithReprompt
      title="Copy Password"
      icon={Icon.Key}
      onAction={handleCopyPassword}
      repromptDescription={`Copying the password of <${selectedItem.name}>`}
    />
  );
}

export default CopyPasswordAction;
