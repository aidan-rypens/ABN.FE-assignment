import { TV_MAZE_API_URL } from "~~/server/constants";

/* 
  Connecting the application to a monitoring service could be more useful.
  This is also insufficient as this only returns a 503 if a specific endpoint is not responding.
  Showing errors at specific sections in the UI is a better approach.
*/

export default defineEventHandler(async (event) => {
  try {
    await $fetch(`${TV_MAZE_API_URL}/shows/1`);
    return { status: "ok" };
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: "Service Unavailable",
      message: "TVMaze API is not responding",
    });
  }
});
