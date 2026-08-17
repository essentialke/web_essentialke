const trimTrailingSlashes = (value) => value.replace(/\/+$/, "");

const configuredAssetOrigin = () => {
    const assetUrl = import.meta.env.VITE_ASSET_URL;
    if (assetUrl) return trimTrailingSlashes(assetUrl).replace(/\/api$/, "");

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) return "";

    try {
        return new URL(apiUrl).origin;
    } catch {
        return trimTrailingSlashes(apiUrl).replace(/\/api$/, "");
    }
};

export const resolveAssetUrl = (path) => {
    if (!path || path.startsWith("blob:") || path.startsWith("data:")) return path || "";
    if (/^https?:\/\//i.test(path)) return path;

    const origin = configuredAssetOrigin();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${origin}${normalizedPath}`;
};
