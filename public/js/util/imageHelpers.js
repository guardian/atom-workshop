export function parseMimeType(mimeType) {
  //Normalise Mime Types coming from the grid.
  switch (mimeType) {
    case 'jpg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
  }

  return mimeType;
}

function getMetadata(metadata) {
  const credit = getCredit(metadata);
  const { copyright, source, byline, suppliersReference } = metadata;
  return {
    credit,
    copyright,
    source,
    photographer: byline,
    suppliersReference,
  };
}

function getCredit(metadata) {
  const imageType = metadata.imageType ? metadata.imageType : 'Photograph';

  const getName = (byline, source) => {
    if (byline && source) {
      if (byline === source) return byline;
      else return `${byline}/${source}`;
    } else return byline || source;
  };

  const name = getName(metadata.byline, metadata.source);

  return name ? `${imageType}: ${name}` : null;
}

function parseAsset(asset, formattedMetadata) {
  const { secureUrl, mimeType, size, dimensions } = asset;
  const { credit, copyright, source, photographer, suppliersReference } =
    formattedMetadata;
  return {
    file: secureUrl,
    mimeType: parseMimeType(mimeType),
    size,
    dimensions: {
      width: dimensions.width,
      height: dimensions.height,
    },
    credit,
    copyright,
    source,
    photographer,
    suppliersReference,
  };
}

export function parseImageFromGridCrop(data) {
  const cropData = data.crop.data;
  const formattedMetadata = getMetadata(data.image.data.metadata);
  return {
    assets: cropData.assets.map((asset) =>
      parseAsset(asset, formattedMetadata)
    ),
    master: parseAsset(cropData.master, formattedMetadata),
    mediaId: cropData.specification.uri,
  };
}

export function findSmallestAsset(assetsArray) {
  return assetsArray.reduce((smallestAsset, newAsset) => {
    if (newAsset.size < smallestAsset.size) {
      return newAsset;
    } else {
      return smallestAsset;
    }
  });
}

export function findSmallestAssetAboveWidth(assetsArray, minSize = 250) {
  // Grid provides various versions of a crop
  // their widths are fixed and typically 140, 500, 1000, 2000px
  // use the first one that's above `minSize` in width
  // as the resolution is usually good enough for a simple preview
  const usefulAssets = assetsArray.filter(
    (asset) => asset.dimensions.width > minSize
  );
  if (usefulAssets.length === 0) {
    // Crops narrower than minSize have no such asset, so use the widest there is.
    return assetsArray.reduce((widest, asset) =>
      asset.dimensions.width > widest.dimensions.width ? asset : widest
    );
  }
  return findSmallestAsset(usefulAssets);
}

export function gridUrlFromApiUrl(url) {
  return url.replace('https://api.media.', 'https://media.');
}
