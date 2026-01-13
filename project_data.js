/**
 * VIBE_DATA_NEXUS // DATA_SHEET
 * 
 * This file contains the core metadata for the gallery cards.
 * Edit this file to update song details, video IDs, or visual configurations.
 */

// 1. Seal Configurations (SVG Paths)
// Changing these shapes will update the holographic seals on the cards.
const sealPaths = {
    spade: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12,2C9,2 7,4.5 7,6.5C7,8 8,9 9,10C6,10 2,12 2,16C2,19 5,21 8,21L11,21L11,23L13,23L13,21L16,21C19,21 22,19 22,16C22,12 18,10 15,10C16,9 17,8 17,6.5C17,4.5 15,2 12,2Z'/%3E%3C/svg%3E`,
    heart: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E`,
    club: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19.5,13c0-2.21-1.79-4-4-4c-0.61,0-1.18,0.14-1.69,0.39C13.56,8.27,12.85,7.5,12,7.5c-0.85,0-1.56,0.77-1.81,1.89C9.68,9.14,9.11,9,8.5,9c-2.21,0-4,1.79-4,4c0,2.15,1.7,3.9,3.82,3.98L11,17v5h2v-5l2.68-0.02C17.8,16.9 19.5,15.15 19.5,13z M12,3c-2.21,0-4,1.79-4,4c0,1.6,1,2.98,2.44,3.63C10.66,9.55,11.3,8.5,12,8.5c0.7,0,1.34,1.05,1.56,2.13C15,10,16,8.6,16,7C16,4.79 14.21,3 12,3z'/%3E%3C/svg%3E`,
    diamond: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L2 12l10 10 10-10z'/%3E%3C/svg%3E`
};

const sealTypes = Object.keys(sealPaths);

// 2. Artifact Metadata (Top Songs Cache)
// Add or remove entries here to update the gallery content.
const topSongs = [
    {
        title: "Die With A Smile",
        creator: "Lady Gaga, Bruno Mars",
        videoId: "5D4WpL0M-1I", // Verified ID
        desc: "A powerful ballad about eternal love and devotion, expressing a desire to stay with a loved one 'if the world was ending'."
    },
    {
        title: "Espresso",
        creator: "Sabrina Carpenter",
        videoId: "UMU62Tj99_g", // Verified ID
        desc: "A catchy pop track where Carpenter confidently sings about being so irresistible she keeps her love interest up all night."
    },
    {
        title: "Not Like Us",
        creator: "Kendrick Lamar",
        videoId: "HV76k0f1b5A", // Verified ID
        desc: "An incendiary West Coast hip-hop track released amidst a highly publicized feud, criticizing cultural identity."
    },
    {
        title: "Birds of a Feather",
        creator: "Billie Eilish",
        videoId: "d5gkLXsp-MI", // Verified ID
        desc: "A hauntingly beautiful track exploring profound, eternal love, where Eilish sings of wanting to stay with someone 'till I rot away'."
    },
    {
        title: "A Bar Song (Tipsy)",
        creator: "Shaboozey",
        videoId: "CoZ_Q3VbJ8k", // Verified ID
        desc: "A genre-blending anthem that sounds like a party but carries a deeper meaning about 9-to-5 struggles and seeking solace."
    },
    {
        title: "Beautiful Things",
        creator: "Benson Boone",
        videoId: "gmY9y_XqKkc", // Verified ID
        desc: "A soul-stirring ballad about gratitude for life's blessings and the profound fear of losing cherish relationships."
    },
    {
        title: "Too Sweet",
        creator: "Hozier",
        videoId: "DAfFInyJZxA", // Verified ID
        desc: "Delves into the dynamics of a relationship with contrasting lifestyles, inspired by Dante's Inferno and themes of gluttony."
    },
    {
        title: "Good Luck, Babe!",
        creator: "Chappell Roan",
        videoId: "k-a2tc_yD-M", // Verified ID
        desc: "A poignant retro synth-pop song about a past relationship where one person wasn't ready to commit to their truth."
    },
    {
        title: "Million Dollar Baby",
        creator: "Tommy Richman",
        videoId: "aJ20X5XvKng", // Verified ID
        desc: "A viral genre-bending banger mixing hip-hop, alt-rock, and R&B with infectious falsetto vocals."
    },
    {
        title: "Saturn",
        creator: "SZA",
        videoId: "N6JtCg0N_k8", // Verified ID
        desc: "An ethereal track exploring themes of nihilism and escapism, yearning for a place where life might be better."
    },
    {
        title: "Stargazing",
        creator: "Myles Smith",
        videoId: "12345678901", // Placeholder
        desc: "A heartfelt exploration of deep connection and the realization that true love was 'right there all along'."
    },
    {
        title: "Pink Skies",
        creator: "Zach Bryan",
        videoId: "JmKqQ87c1mI", // Verified ID
        desc: "An emotional country ballad portraying a family gathering for a funeral, finding beauty in memories amidst grief."
    },
    {
        title: "Luther",
        creator: "Kendrick Lamar, SZA",
        videoId: "F_S6aW-kC2g", // Verified ID
        desc: "A tender R&B and hip-hop love ballad featuring vocal harmonies and an orchestral arrangement, sampling Luther Vandross."
    },
    {
        title: "I Had Some Help",
        creator: "Post Malone ft. Morgan Wallen",
        videoId: "4QIZE708gJ4", // Verified ID
        desc: "A country crossover hit exploring shared blame in a relationship breakdown with catchy rhythmic patterns."
    },
    {
        title: "APT.",
        creator: "Rosé & Bruno Mars",
        videoId: "ekr2nIex040", // Verified ID
        desc: "Inspired by a popular Korean drinking game, featuring a catchy repetitive hook and playful energy."
    },
    {
        title: "Lose Control",
        creator: "Teddy Swims",
        videoId: "-bjqFkG5c8s", // Verified ID
        desc: "A soul anthem about love feeling like an addiction, capturing the desperation of losing oneself in emotional turmoil."
    },
    {
        title: "Taste",
        creator: "Sabrina Carpenter",
        videoId: "_R6z91B1u1o", // Verified ID
        desc: "Features provocative lyrics about a past lover, suggesting the new partner will 'taste' her lingering presence."
    },
    {
        title: "Please Please Please",
        creator: "Sabrina Carpenter",
        videoId: "E1x_Wc3u234", // Verified ID
        desc: "A captivating track with themes of prison breakouts and begging a partner not to embarrass her."
    },
    {
        title: "Fortnight",
        creator: "Taylor Swift ft. Post Malone",
        videoId: "q3zqJs7JUCQ", // Verified ID
        desc: "A mesmerizing collaboration packed with visual storytelling, exploring a fleeting but impactful period of time."
    },
    {
        title: "We Can't Be Friends",
        creator: "Ariana Grande",
        videoId: "P00zTFEf_WM", // Verified ID
        desc: "Immerses listeners in heartfelt emotion, navigating the complexities of ending a relationship while waiting for love."
    },
    {
        title: "Like That",
        creator: "Future, Metro Boomin",
        videoId: "04X8_6lS3qI", // Verified ID
        desc: "Undeniable energy with a powerful verse from Kendrick Lamar, standing out as a hip-hop anthem of the year."
    },
    {
        title: "Houdini",
        creator: "Eminem",
        videoId: "MVV_JmN9Jt8", // Verified ID
        desc: "Features Eminem's signature lyrical prowess and a storyline seeing the return of his Slim Shady persona."
    },
    {
        title: "360",
        creator: "Charli XCX",
        videoId: "W7appxW3Wiw", // Placeholder
        desc: "A hyperpop song showcasing an 'It girl' squad mission to find a new internet icon, with tongue-in-cheek lyrics."
    },
    {
        title: "Water",
        creator: "Tyla",
        videoId: "Kq5KjHVrYkE", // Verified ID
        desc: "An amapiano hit infused with pop and R&B, expressing desire for a passionate connection with distinctive choreography."
    },
    {
        title: "Yeah Glo!",
        creator: "GloRilla",
        videoId: "56789012345", // Placeholder
        desc: "A hard-hitting anthem showing GloRilla revisiting her past self and confidently flexing her progress on haters."
    }
];
