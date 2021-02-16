export const SECTIONS = {
    ME: {
        slug: "/me",
        z: 5,
    },
    WORK: {
        slug: "/work",
        z: -10,
    },
    THOUGHTS: {
        slug: "/thoughts",
        z: -20,
    },
};

export const DPR =
    window.innerWidth <= 2560 ? Math.max(window.devicePixelRatio, 2) : 1.5;

export const PROJECTS = [
    "Yeezy",
    "Dwarf Cases",
    "LunchBuddy",
    "TV2 Regions",
    "Kammeradvokat",
    "Knabstrup",
].map((c) => c.toUpperCase());
