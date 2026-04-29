export const PROFILE_PHOTOS = [
    {
        key: "profile",
        source: require("../../assets/profile.png"),
    },
    {
        key: "profileOne",
        source: require("../../assets/profileOne.png"),
    },
    {
        key: "profileTwo",
        source: require("../../assets/profileTwo.png"),
    },
];

const legacyAssetIds = {
    19: "profile",
    20: "profileOne",
    21: "profileTwo",
};

export const getProfilePhotoKey = (value) => {
    if (typeof value === "string") {
        return PROFILE_PHOTOS.some((photo) => photo.key === value) ? value : "profile";
    }

    const photoByCurrentAssetId = PROFILE_PHOTOS.find((photo) => photo.source === value);
    if (photoByCurrentAssetId) {
        return photoByCurrentAssetId.key;
    }

    return legacyAssetIds[value] ?? "profile";
};

export const getProfilePhotoSource = (value) => {
    const key = getProfilePhotoKey(value);
    return PROFILE_PHOTOS.find((photo) => photo.key === key)?.source ?? PROFILE_PHOTOS[0].source;
};
