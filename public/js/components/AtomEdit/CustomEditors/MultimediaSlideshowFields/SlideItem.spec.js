import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SlideItem } from './SlideItem';
import FormFieldImageSelect from '../../../FormFields/FormFieldImageSelect';
import FormFieldMediaAtomSelect from '../../../FormFields/FormFieldMediaAtomSelect';
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

const renderSlide = (fieldValue, onUpdateField = jest.fn()) =>
  mount(
    <SlideItem
      fieldName="slides-0"
      fieldValue={fieldValue}
      onUpdateField={onUpdateField}
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
  expect(slide.find('.image-select__image-details').text()).not.toMatch(
    /Size|Dimensions/
  );
});

test('slide media can be replaced but not removed', () => {
  [{ image }, video].forEach((content) => {
    const slide = renderSlide({ content });

    expect(slide.find('.image-select__replace-button')).toHaveLength(1);
    expect(slide.find('.image-select__remove-button')).toHaveLength(0);
  });
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

test('changing the slide type is only saved once the new media is picked', () => {
  const onUpdateField = jest.fn();
  const slide = renderSlide(
    { content: { image }, caption: 'Kept' },
    onUpdateField
  );

  slide.find('input[value="video"]').simulate('change');
  expect(onUpdateField).not.toHaveBeenCalled();
  expect(slide.find('.slide__thumbnail--missing').text()).toBe('No video');

  slide.find(FormFieldMediaAtomSelect).prop('onUpdateField')({
    mediaAtomId: 'new-video',
  });
  expect(onUpdateField).toHaveBeenCalledWith({
    content: { mediaAtom: { mediaAtomId: 'new-video' } },
    caption: 'Kept',
  });
});

test('switching back to the saved slide type restores its media', () => {
  const onUpdateField = jest.fn();
  const slide = renderSlide({ content: { image } }, onUpdateField);

  slide.find('input[value="video"]').simulate('change');
  slide.find('input[value="image"]').simulate('change');

  expect(onUpdateField).toHaveBeenCalledTimes(1);
  expect(onUpdateField).toHaveBeenCalledWith({ content: { image } });
  expect(slide.find('img.slide__thumbnail').prop('src')).toBe(
    'https://media.test/140.jpg'
  );
});

test('new slides are only passed up once they have media', () => {
  const onUpdateField = jest.fn();
  const slide = renderSlide(undefined, onUpdateField);
  const captionInput = () => slide.find('.slide__text input').first();

  captionInput().simulate('change', { target: { value: 'Draft caption' } });
  expect(onUpdateField).not.toHaveBeenCalled();
  expect(captionInput().prop('value')).toBe('Draft caption');

  slide.find(FormFieldImageSelect).prop('onUpdateField')(image);
  expect(onUpdateField).toHaveBeenCalledWith({
    content: { image },
    caption: 'Draft caption',
  });
});
