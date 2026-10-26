import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SlideItem } from './SlideItem';
import { fetchCapiAtom } from '../../../../services/capi';

// A factory, as the real module pulls in panda-session, which Jest can't parse.
jest.mock('../../../../services/capi', () => ({
  fetchCapiAtom: jest.fn(() => new Promise(() => {})),
}));

configure({ adapter: new Adapter() });

const asset = (width, height) => ({
  file: `https://media.test/${width}.jpg`,
  mimeType: 'image/jpeg',
  size: width * 10,
  dimensions: { width, height },
});

const image = {
  assets: [asset(140, 84), asset(500, 300)],
  master: asset(2000, 1200),
  mediaId: 'https://api.media.test/images/abc',
};

const video = { mediaAtom: { mediaAtomId: 'video-atom-id' } };

const renderSlide = (fieldValue) =>
  mount(
    <SlideItem
      fieldName="slides-0"
      fieldValue={fieldValue}
      onUpdateField={jest.fn()}
      gridUrl="https://media.test"
      videoBaseUrl="https://video.test"
    />
  );

test('slides with media start collapsed, showing a thumbnail and summary', () => {
  const slide = renderSlide({
    content: { image },
    label: 'One',
    caption: 'First slide',
  });

  expect(slide.find('.slide__body').prop('hidden')).toBe(true);
  expect(slide.find('img.slide__thumbnail').prop('src')).toBe(
    'https://media.test/140.jpg'
  );
  expect(slide.find('.slide__label').text()).toBe('One');
  expect(slide.find('.slide__summary').text()).toContain('First slide');
});

test('video slides show the media atom poster', async () => {
  fetchCapiAtom.mockResolvedValueOnce({
    data: { media: { posterImage: image } },
  });
  const slide = renderSlide({
    content: { mediaAtom: { mediaAtomId: 'poster-atom-id' } },
  });

  await new Promise((resolve) => setTimeout(resolve, 0));
  slide.update();

  expect(fetchCapiAtom).toHaveBeenCalledWith('media', 'poster-atom-id');
  expect(slide.find('.slide__thumbnail--video img').prop('src')).toBe(
    'https://media.test/140.jpg'
  );
});

test('new slides start expanded', () => {
  const slide = renderSlide(undefined);

  expect(slide.find('.slide__body').prop('hidden')).toBe(false);
  expect(slide.find('.slide__thumbnail--missing').text()).toBe('No image');
});

test('clicking the header toggles the slide fields', () => {
  const slide = renderSlide({ content: video });

  slide.find('.slide__header').simulate('click');
  expect(slide.find('.slide__body').prop('hidden')).toBe(false);
  expect(slide.find('.slide__header').prop('aria-expanded')).toBe(true);

  slide.find('.slide__header').simulate('click');
  expect(slide.find('.slide__body').prop('hidden')).toBe(true);
});

test('slide type radios are named per slide and follow the saved content', () => {
  const slide = renderSlide({ content: video });
  const radios = slide.find('input[type="radio"]');

  radios.forEach((radio) =>
    expect(radio.prop('name')).toBe('slides-0-slideType')
  );
  expect(slide.find('input[value="video"]').prop('checked')).toBeTruthy();

  slide.setProps({ fieldValue: { content: { image } } });
  expect(slide.find('input[value="image"]').prop('checked')).toBeTruthy();
});
