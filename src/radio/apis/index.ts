export async function getChannels(includeAll = false) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/talradio/channels?includeAll=${includeAll}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching channels:", error);
    throw error;
  }
}
