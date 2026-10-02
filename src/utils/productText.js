export const hasDisplayText = (value) => {
    if (typeof value !== "string") return false;
    const text = value.trim();
    return Boolean(text) && !["null", "undefined"].includes(text.toLowerCase());
};