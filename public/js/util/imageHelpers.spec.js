import {
  parseMimeType,
  parseImageFromGridCrop,
  findSmallestAsset,
  findSmallestAssetAboveWidth,
  gridUrlFromApiUrl,
} from './imageHelpers';

test('parseImageFromGridCrop', () => {
  expect(parseMimeType('image/jpeg')).toBe('image/jpeg');
  expect(parseMimeType('jpg')).toBe('image/jpeg');
  expect(parseMimeType('blah')).toBe('blah');
});

test('parseImageFromGridCrop', () => {
  const mockGridMessage = {
    image: {
      uri: 'https://api.media.test.dev-gutools.co.uk/images/8582a3fb775d38294d61a35fa036338518d8e375',
      data: {
        id: '8582a3fb775d38294d61a35fa036338518d8e375',
        uploadTime: '2017-02-03T11:37:53Z',
        uploadedBy: 'pa',
        lastModified: '2017-02-03T11:37:53Z',
        identifiers: {},
        uploadInfo: { filename: 'POLITICS_Scotland_113464.jpg' },
        source: {
          file: 'http://media-service-test-imagebucket-1qt2lbcwnpgl0.s3.amazonaws.com/8/5/8/2/a/3/8582a3fb775d38294d61a35fa036338518d8e375',
          size: 574944,
          mimeType: 'image/jpeg',
          dimensions: { width: 2948, height: 2161 },
          secureUrl:
            'https://media-service-test-imagebucket-1qt2lbcwnpgl0.s3.amazonaws.com/8/5/8…UHJNQ6MS2A&Expires=1486123800&Signature=VYh2qy5lX%2BQYd1Gh%2Bx1eBpDhgnU%3D',
        },
        thumbnail: {
          file: 'http://media-service-test-thumbbucket-1sm53rniszbqf.s3.amazonaws.com/8/5/8/2/a/3/8582a3fb775d38294d61a35fa036338518d8e375',
          size: 10761,
          mimeType: 'image/jpeg',
          dimensions: { width: 256, height: 188 },
          secureUrl:
            'https://d2av06b16cc3yv.cloudfront.net/8/5/8/2/a/3/8582a3fb775d38294d61a35fa…AdRoPIMkIxRAS1J2SOhFBwr7m1ChKRKbZw4Y34g__&Key-Pair-Id=APKAJPTTPZNNPHQSSUAQ',
        },
        fileMetadata: {},
        metadata: {
          dateTaken: '2017-02-03T00:00:00Z',
          description:
            'File photo dated 07/07/16 of Michael Gove, who has said that Nicola Sturgeon would be "foolish" to call a second independence referendum in the wake of the Brexit vote. PRESS ASSOCIATION Photo. Issue date: Friday February 3, 2017. Gove, who served as both education and justice secretary under David Cameron, said: "The people of the United Kingdom, having voted to leave one union that didn\'t work, the people of Scotland are not going to vote to leave another union that works." See PA story POLITICS Scotland. Photo credit should read: Jonathan Brady/PA Wire',
          credit: 'PA',
          byline: 'Jonathan Brady',
          title: 'Brexit',
          copyright: 'PA Archive/PA Images',
          suppliersReference: 'POLITICS_Scotland_113464.JPG',
          source: 'PA',
          specialInstructions: 'FILE PHOTO',
          keywords: ['politics conservatives'],
          city: 'London',
          country: 'United Kingdom',
        },
        originalMetadata: {
          dateTaken: '2017-02-03T00:00:00Z',
          description:
            'File photo dated 07/07/16 of Michael Gove, who has said that Nicola Sturgeon would be "foolish" to call a second independence referendum in the wake of the Brexit vote. PRESS ASSOCIATION Photo. Issue date: Friday February 3, 2017. Gove, who served as both education and justice secretary under David Cameron, said: "The people of the United Kingdom, having voted to leave one union that didn\'t work, the people of Scotland are not going to vote to leave another union that works." See PA story POLITICS Scotland. Photo credit should read: Jonathan Brady/PA Wire',
          credit: 'PA',
          byline: 'Jonathan Brady',
          title: 'Brexit',
          copyright: 'PA Archive/PA Images',
          suppliersReference: 'POLITICS_Scotland_113464.JPG',
          source: 'PA',
          specialInstructions: 'FILE PHOTO',
          keywords: ['politics conservatives'],
          city: 'London',
          country: 'United Kingdom',
        },
        usageRights: { category: 'agency', supplier: 'PA' },
        originalUsageRights: { category: 'agency', supplier: 'PA' },
        exports: [],
        usages: {},
        leases: {},
        collections: [],
        userMetadata: {},
        valid: true,
        invalidReasons: {},
        cost: 'free',
        persisted: { value: false, reasons: [] },
      },
    },
    crop: {
      uri: 'https://cropper.media.test.dev-gutools.co.uk/crops',
      data: {
        id: '1194_688_1072_643',
        author: 'christopher.lloyd@guardian.co.uk',
        date: '2017-02-03T11:53:01Z',
        specification: {
          uri: 'https://api.media.test.dev-gutools.co.uk/images/8582a3fb775d38294d61a35fa036338518d8e375',
          bounds: { x: 1194, y: 688, width: 1072, height: 643 },
          aspectRatio: '5:3',
          type: 'crop',
        },
        master: {
          file: 'http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/master/1072.jpg',
          size: 682941,
          mimeType: 'image/jpeg',
          dimensions: { width: 1072, height: 643 },
          secureUrl:
            'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/master/1072.jpg',
        },
        assets: [
          {
            file: 'http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1000.jpg',
            size: 77716,
            mimeType: 'jpg',
            dimensions: { width: 1000, height: 600 },
            secureUrl:
              'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1000.jpg',
          },
          {
            file: 'http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/500.jpg',
            size: 25313,
            mimeType: 'jpg',
            dimensions: { width: 500, height: 300 },
            secureUrl:
              'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/500.jpg',
          },
          {
            file: 'http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/140.jpg',
            size: 6146,
            mimeType: 'jpg',
            dimensions: { width: 140, height: 84 },
            secureUrl:
              'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/140.jpg',
          },
          {
            file: 'http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1072.jpg',
            size: 95745,
            mimeType: 'jpg',
            dimensions: { width: 1072, height: 643 },
            secureUrl:
              'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1072.jpg',
          },
        ],
      },
    },
  };

  expect(parseImageFromGridCrop(mockGridMessage)).toEqual({
    assets: [
      {
        copyright: 'PA Archive/PA Images',
        credit: 'Photograph: Jonathan Brady/PA',
        dimensions: { height: 600, width: 1000 },
        file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1000.jpg',
        mimeType: 'image/jpeg',
        photographer: 'Jonathan Brady',
        size: 77716,
        source: 'PA',
        suppliersReference: 'POLITICS_Scotland_113464.JPG',
      },
      {
        copyright: 'PA Archive/PA Images',
        credit: 'Photograph: Jonathan Brady/PA',
        dimensions: { height: 300, width: 500 },
        file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/500.jpg',
        mimeType: 'image/jpeg',
        photographer: 'Jonathan Brady',
        size: 25313,
        source: 'PA',
        suppliersReference: 'POLITICS_Scotland_113464.JPG',
      },
      {
        copyright: 'PA Archive/PA Images',
        credit: 'Photograph: Jonathan Brady/PA',
        dimensions: { height: 84, width: 140 },
        file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/140.jpg',
        mimeType: 'image/jpeg',
        photographer: 'Jonathan Brady',
        size: 6146,
        source: 'PA',
        suppliersReference: 'POLITICS_Scotland_113464.JPG',
      },
      {
        copyright: 'PA Archive/PA Images',
        credit: 'Photograph: Jonathan Brady/PA',
        dimensions: { height: 643, width: 1072 },
        file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1072.jpg',
        mimeType: 'image/jpeg',
        photographer: 'Jonathan Brady',
        size: 95745,
        source: 'PA',
        suppliersReference: 'POLITICS_Scotland_113464.JPG',
      },
    ],
    master: {
      copyright: 'PA Archive/PA Images',
      credit: 'Photograph: Jonathan Brady/PA',
      dimensions: { height: 643, width: 1072 },
      file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/master/1072.jpg',
      mimeType: 'image/jpeg',
      photographer: 'Jonathan Brady',
      size: 682941,
      source: 'PA',
      suppliersReference: 'POLITICS_Scotland_113464.JPG',
    },
    mediaId:
      'https://api.media.test.dev-gutools.co.uk/images/8582a3fb775d38294d61a35fa036338518d8e375',
  });
});

test('findSmallestAsset', () => {
  const assets = [
    {
      dimensions: { height: 600, width: 1000 },
      file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1000.jpg',
      mimeType: 'image/jpeg',
      size: 77716,
    },
    {
      dimensions: { height: 300, width: 500 },
      file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/500.jpg',
      mimeType: 'image/jpeg',
      size: 25313,
    },
    {
      dimensions: { height: 84, width: 140 },
      file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/140.jpg',
      mimeType: 'image/jpeg',
      size: 6146,
    },
    {
      dimensions: { height: 643, width: 1072 },
      file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1072.jpg',
      mimeType: 'image/jpeg',
      size: 95745,
    },
  ];
  expect(findSmallestAsset(assets)).toEqual({
    dimensions: { height: 84, width: 140 },
    file: 'https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/140.jpg',
    mimeType: 'image/jpeg',
    size: 6146,
  });
});

test('findSmallestAssetAboveWidth', () => {
  const asset = (width) => ({
    file: `${width}.jpg`,
    size: width * 10,
    dimensions: { width, height: width / 2 },
  });

  expect(
    findSmallestAssetAboveWidth([asset(1000), asset(140), asset(500)], 200)
  ).toEqual(asset(500));
  expect(findSmallestAssetAboveWidth([asset(80), asset(140)], 200)).toEqual(
    asset(140)
  );
});

test('gridUrlFromApiUrl', () => {
  expect(gridUrlFromApiUrl('https://api.media.gutools.co.uk')).toEqual(
    'https://media.gutools.co.uk'
  );
  expect(gridUrlFromApiUrl('https://api.media.test.dev-gutools.co.uk')).toEqual(
    'https://media.test.dev-gutools.co.uk'
  );
  expect(gridUrlFromApiUrl('https://notmedia.api.gutools.co.uk')).toEqual(
    'https://notmedia.api.gutools.co.uk'
  );
  expect(
    gridUrlFromApiUrl('https://something.media.api.gutools.co.uk')
  ).toEqual('https://something.media.api.gutools.co.uk');
});
