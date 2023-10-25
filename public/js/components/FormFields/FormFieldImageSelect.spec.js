import React from 'react';
import FormFieldImageSelect from './FormFieldImageSelect';
import renderer from 'react-test-renderer';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const gridUrl = "https://media.test.dev-gutools.co.uk";

const testImage = {
  "assets":[
    {
      "file":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f/783_0_2025_1215/2000.jpg",
      "mimeType":"image/jpeg",
      "size":119846,
      "dimensions":{"width":2000,"height":1200}
    },
    {
      "file":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f/783_0_2025_1215/1000.jpg",
      "mimeType":"image/jpeg",
      "size":35608,
      "dimensions":{"width":1000,"height":600}
    }
  ],
  "master":{
    "file":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f/783_0_2025_1215/master/2025.jpg",
    "mimeType":"image/jpeg",
    "size":980347,
    "dimensions":{"width":2025,"height":1215}
  },
  "mediaId":"https://api.media.test.dev-gutools.co.uk/images/5dfc898f6866c8bb4224b65b9aae89e6eb7af30f"
};

const mockGridMessage = {"image":{"uri":"https://api.media.test.dev-gutools.co.uk/images/8582a3fb775d38294d61a35fa036338518d8e375","data":{"id":"8582a3fb775d38294d61a35fa036338518d8e375","uploadTime":"2017-02-03T11:37:53Z","uploadedBy":"pa","lastModified":"2017-02-03T11:37:53Z","identifiers":{},"uploadInfo":{"filename":"POLITICS_Scotland_113464.jpg"},"source":{"file":"http://media-service-test-imagebucket-1qt2lbcwnpgl0.s3.amazonaws.com/8/5/8/2/a/3/8582a3fb775d38294d61a35fa036338518d8e375","size":574944,"mimeType":"image/jpeg","dimensions":{"width":2948,"height":2161},"secureUrl":"https://media-service-test-imagebucket-1qt2lbcwnpgl0.s3.amazonaws.com/8/5/8…UHJNQ6MS2A&Expires=1486123800&Signature=VYh2qy5lX%2BQYd1Gh%2Bx1eBpDhgnU%3D"},"thumbnail":{"file":"http://media-service-test-thumbbucket-1sm53rniszbqf.s3.amazonaws.com/8/5/8/2/a/3/8582a3fb775d38294d61a35fa036338518d8e375","size":10761,"mimeType":"image/jpeg","dimensions":{"width":256,"height":188},"secureUrl":"https://d2av06b16cc3yv.cloudfront.net/8/5/8/2/a/3/8582a3fb775d38294d61a35fa…AdRoPIMkIxRAS1J2SOhFBwr7m1ChKRKbZw4Y34g__&Key-Pair-Id=APKAJPTTPZNNPHQSSUAQ"},"fileMetadata":{},"metadata":{"dateTaken":"2017-02-03T00:00:00Z","description":"File photo dated 07/07/16 of Michael Gove, who has said that Nicola Sturgeon would be \"foolish\" to call a second independence referendum in the wake of the Brexit vote. PRESS ASSOCIATION Photo. Issue date: Friday February 3, 2017. Gove, who served as both education and justice secretary under David Cameron, said: \"The people of the United Kingdom, having voted to leave one union that didn't work, the people of Scotland are not going to vote to leave another union that works.\" See PA story POLITICS Scotland. Photo credit should read: Jonathan Brady/PA Wire","credit":"PA","byline":"Jonathan Brady","title":"Brexit","copyright":"PA Archive/PA Images","suppliersReference":"POLITICS_Scotland_113464.JPG","source":"PA","specialInstructions":"FILE PHOTO","keywords":["politics conservatives"],"city":"London","country":"United Kingdom"},"originalMetadata":{"dateTaken":"2017-02-03T00:00:00Z","description":"File photo dated 07/07/16 of Michael Gove, who has said that Nicola Sturgeon would be \"foolish\" to call a second independence referendum in the wake of the Brexit vote. PRESS ASSOCIATION Photo. Issue date: Friday February 3, 2017. Gove, who served as both education and justice secretary under David Cameron, said: \"The people of the United Kingdom, having voted to leave one union that didn't work, the people of Scotland are not going to vote to leave another union that works.\" See PA story POLITICS Scotland. Photo credit should read: Jonathan Brady/PA Wire","credit":"PA","byline":"Jonathan Brady","title":"Brexit","copyright":"PA Archive/PA Images","suppliersReference":"POLITICS_Scotland_113464.JPG","source":"PA","specialInstructions":"FILE PHOTO","keywords":["politics conservatives"],"city":"London","country":"United Kingdom"},"usageRights":{"category":"agency","supplier":"PA"},"originalUsageRights":{"category":"agency","supplier":"PA"},"exports":[],"usages":{},"leases":{},"collections":[],"userMetadata":{},"valid":true,"invalidReasons":{},"cost":"free","persisted":{"value":false,"reasons":[]}}},"crop":{"uri":"https://cropper.media.test.dev-gutools.co.uk/crops","data":{"id":"1194_688_1072_643","author":"christopher.lloyd@guardian.co.uk","date":"2017-02-03T11:53:01Z","specification":{"uri":"https://api.media.test.dev-gutools.co.uk/images/8582a3fb775d38294d61a35fa036338518d8e375","bounds":{"x":1194,"y":688,"width":1072,"height":643},"aspectRatio":"5:3","type":"crop"},"master":{"file":"http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/master/1072.jpg","size":682941,"mimeType":"image/jpeg","dimensions":{"width":1072,"height":643},"secureUrl":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/master/1072.jpg"},"assets":[{"file":"http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1000.jpg","size":77716,"mimeType":"jpg","dimensions":{"width":1000,"height":600},"secureUrl":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1000.jpg"},{"file":"http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/500.jpg","size":25313,"mimeType":"jpg","dimensions":{"width":500,"height":300},"secureUrl":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/500.jpg"},{"file":"http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/140.jpg","size":6146,"mimeType":"jpg","dimensions":{"width":140,"height":84},"secureUrl":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/140.jpg"},{"file":"http://media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1072.jpg","size":95745,"mimeType":"jpg","dimensions":{"width":1072,"height":643},"secureUrl":"https://s3-eu-west-1.amazonaws.com/media-origin.test.dev-guim.co.uk/8582a3fb775d38294d61a35fa036338518d8e375/1194_688_1072_643/1072.jpg"}]}}};

test('Should render no image when none provided', () => {
  const component = renderer.create(
    <FormFieldImageSelect
      gridUrl={gridUrl}
      fieldName="test field name"
      fieldLabel="test field label"
      onUpdateField={() => {}}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should render with image when provided', () => {
  const component = renderer.create(
    <FormFieldImageSelect
      gridUrl={gridUrl}
      fieldName="test field name"
      fieldLabel="test field label"
      fieldValue={testImage}
      onUpdateField={() => {}}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should save image when message recieved', () => {

  const fn = jest.fn();

  const imageSelect = mount(
    <FormFieldImageSelect
      gridUrl={gridUrl}
      fieldName="test field name"
      fieldLabel="test field label"
      onUpdateField={fn}
    />
  );

  imageSelect.instance().onMessage({
    data: mockGridMessage,
    origin: gridUrl
  });

  expect(fn).toHaveBeenCalled();

});

test('Should not save image when message origin is inCorrect', () => {

  const fn = jest.fn();

  const imageSelect = mount(
    <FormFieldImageSelect
      gridUrl={gridUrl}
      fieldName="test field name"
      fieldLabel="test field label"
      onUpdateField={fn}
    />
  );

  imageSelect.instance().onMessage({
    data: mockGridMessage,
    origin: "not the gridUrl"
  });

  expect(fn).not.toHaveBeenCalled();

});
