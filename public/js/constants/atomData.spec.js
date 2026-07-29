import {
  getAtomByType,
  isAtomTypeEditable,
  getCreateUrlFromAtomType
} from './atomData';

jest.mock('../util/storeAccessor');

test('getAtomByType', () => {
  expect(getAtomByType("cta").type).toBe("cta");
  expect(getAtomByType("notarealatom")).toBe(undefined);
  expect(getAtomByType("multimediaslideshow").type).toBe("multimediaslideshow");
});

test('isAtomTypeEditable', () => {
  expect(isAtomTypeEditable("cta")).toBe(true);
  expect(isAtomTypeEditable("media")).toBe(false);
  expect(isAtomTypeEditable("notarealatom")).toBe(false);
  expect(isAtomTypeEditable("multimediaslideshow")).toBe(true);
});

test('getCreateUrlFromAtomType', () => {
  const ctaAtomType = getAtomByType("cta");
  const mediaAtomType = getAtomByType("media");
  const multimediaSlideshowAtomType = getAtomByType("multimediaslideshow");
  expect(getCreateUrlFromAtomType(ctaAtomType)).toBe("/create/cta");
  expect(getCreateUrlFromAtomType(mediaAtomType)).toBe("https://video.test.dev-gutools.co.uk/videos/create");
  expect(getCreateUrlFromAtomType(multimediaSlideshowAtomType)).toBe("/create/multimediaslideshow");
});
