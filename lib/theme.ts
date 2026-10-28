// Shared by the site and /mev so one choice carries across both; dark unless the reader picked light.
export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "ps-theme";

// Runs before first paint so the page never flashes the wrong theme.
export const NO_FLASH = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t)document.documentElement.dataset.theme=t}catch(e){}`;
