export function checkDefaultChannel(
  currentChannel: string | null = null
): string {
  switch (currentChannel) {
    case "telugu":
      return "telugu";
    case "hindi":
      return "hindi";
    case "talradio":
      return "english";
    case "kannada":
      return "kannada";
    default:
      return "all";
  }
}