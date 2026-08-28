export const STOREFRONT_SECTION_IDS = [
    "quickNav",
    "bestSellers",
    "featuredCollections",
    "newArrivals",
    "gifting",
    "testimonials",
];

export const STOREFRONT_SECTION_LABELS = {
    quickNav: "Quick-nav categories",
    bestSellers: "Best Sellers",
    featuredCollections: "Featured Collections",
    newArrivals: "New Pieces",
    gifting: "Gifting Banner",
    testimonials: "Testimonials",
};

export const DEFAULT_STOREFRONT_CONTENT = {
    version: 1,
    gifting: {
        eyebrow: "Made to be given",
        heading: "A meaningful gift, beautifully chosen.",
        body: "Mark the moments that matter with jewelry they’ll keep close.",
        ctaLabel: "Explore gifting",
        ctaRoute: "/gifting",
    },
    sections: {
        order: [...STOREFRONT_SECTION_IDS],
        visibility: Object.fromEntries(STOREFRONT_SECTION_IDS.map((id) => [id, true])),
    },
    featuredCollections: [
        { categoryId: 10, description: "A verse of protection, worn close." },
        { categoryId: 11, description: "A quiet reminder that ease follows hardship." },
        { categoryId: 9, description: "Made for the strength that keeps you grounded." },
        { categoryId: 12, description: "A celebration of becoming and beginning again." },
    ],
    quickNavCategoryIds: [1, 4, 3, 2, 5, 6],
    headings: {
        bestSellers: { kicker: "Most loved", title: "Best Sellers" },
        featuredCollections: { kicker: "Jewelry with intention", title: "Stories you can wear" },
        newArrivals: { kicker: "Just arrived", title: "New Pieces" },
    },
};

export const normalizeStorefrontContent = (content) => {
    const value = content || {};
    return {
        ...structuredClone(DEFAULT_STOREFRONT_CONTENT),
        ...value,
        gifting: { ...DEFAULT_STOREFRONT_CONTENT.gifting, ...value.gifting },
        sections: {
            order: Array.isArray(value.sections?.order) ? value.sections.order : [...STOREFRONT_SECTION_IDS],
            visibility: { ...DEFAULT_STOREFRONT_CONTENT.sections.visibility, ...value.sections?.visibility },
        },
        headings: {
            bestSellers: { ...DEFAULT_STOREFRONT_CONTENT.headings.bestSellers, ...value.headings?.bestSellers },
            featuredCollections: { ...DEFAULT_STOREFRONT_CONTENT.headings.featuredCollections, ...value.headings?.featuredCollections },
            newArrivals: { ...DEFAULT_STOREFRONT_CONTENT.headings.newArrivals, ...value.headings?.newArrivals },
        },
    };
};
