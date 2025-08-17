import { TV_MAZE_API_URL } from "~~/server/api/constants";

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
