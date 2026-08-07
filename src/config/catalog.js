export const DEFAULT_CATEGORIES = [
    { id: 1, name: "Necklaces", slug: "necklaces", parentId: null, status: "active" },
    { id: 2, name: "Rings", slug: "rings", parentId: null, status: "active" },
    { id: 3, name: "Bracelets", slug: "bracelets", parentId: null, status: "active" },
    { id: 4, name: "Earrings", slug: "earrings", parentId: null, status: "active" },
    { id: 5, name: "Chains", slug: "chains", parentId: null, status: "active" },
    { id: 6, name: "Gift Sets", slug: "gift-sets", parentId: null, status: "active" },
    { id: 7, name: "Stickers", slug: "stickers", parentId: null, status: "active" },
    { id: 8, name: "Collections", slug: "collections", parentId: null, status: "active" },
    { id: 9, name: "Rooted Collection", slug: "rooted", parentId: 8, status: "active" },
    { id: 10, name: "Ayatul Kursi Collection", slug: "ayatul-kursi", parentId: 8, status: "active" },
    { id: 11, name: "Verily Collection", slug: "verily", parentId: 8, status: "active" },
    { id: 12, name: "Bloom Collection", slug: "bloom", parentId: 8, status: "active" },
    { id: 13, name: "Ronde Collection", slug: "ronde", parentId: 8, status: "active" },
    { id: 14, name: "Initial Collection", slug: "initial", parentId: 8, status: "active" },
    { id: 15, name: "Dainty Collection", slug: "dainty", parentId: 8, status: "active" },
    { id: 16, name: "Meaningful Collection", slug: "meaningful", parentId: 8, status: "active" },
];

export const copyDefaultCategories = () =>
    DEFAULT_CATEGORIES.map((category) => ({ ...category }));

export const activeLeafCategories = (categories) =>
    categories.filter(
        (category) =>
            category.status === "active" &&
            !categories.some(
                (candidate) =>
                    candidate.status === "active" &&
                    candidate.parentId === category.id,
            ),
    );

export const collectionCategories = (categories) => {
    const parent = categories.find(
        (category) => category.status === "active" && category.slug === "collections",
    );
    return parent
        ? categories.filter(
              (category) =>
                  category.status === "active" && category.parentId === parent.id,
          )
        : [];
};
