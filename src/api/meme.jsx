/**
 * Fetches all meme templates from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the API.
 */
export const GetAllMemes = async () => {
  try {
    const response = await fetch("https://api.imgflip.com/get_memes");
    return await response.json();
  } catch (error) {
    console.error("Error fetching memes:", error);

    return { data: { memes: [] } };
  }
};
