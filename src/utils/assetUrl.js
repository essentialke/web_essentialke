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

const cloudinaryTransform = (url, { width } = {}) => {
    if (!url?.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
        return url;
    }

    const transformations = ["f_auto", "q_auto"];
    if (width) transformations.push(`w_${Math.round(width)}`, "c_limit");

    return url.replace(
        "/image/upload/",
        `/image/upload/${transformations.join(",")}/`,
    );
};

export const resolveAssetUrl = (path, options = {}) => {
    if (!path || path.startsWith("blob:") || path.startsWith("data:")) return path || "";
    const resolvedUrl = /^https?:\/\//i.test(path)
        ? path
        : `${configuredAssetOrigin()}${path.startsWith("/") ? path : `/${path}`}`;

    return options.transform === false
        ? resolvedUrl
        : cloudinaryTransform(resolvedUrl, options);
};

export const createImageSrcSet = (path, widths = [320, 480, 720, 960]) => {
    if (!path) return undefined;
    const original = resolveAssetUrl(path, { transform: false });
    if (!original.includes("res.cloudinary.com")) return undefined;

    return widths
        .map((width) => `${cloudinaryTransform(original, { width })} ${width}w`)
        .join(", ");
};
