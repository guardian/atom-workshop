import React from 'react';
import FormFieldArrayWrapper from './FormFieldArrayWrapper';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const Child = () => <div className="child" />;

test('renders an Add button when no maxItems is set', () => {
  const wrapper = shallow(
    <FormFieldArrayWrapper fieldName="slides" fieldValue={[{}, {}]} onUpdateField={jest.fn()}>
      <Child />
    </FormFieldArrayWrapper>
  );

  expect(wrapper.find('.form__btn-heading__add')).toHaveLength(1);
  expect(wrapper.find('.form__note')).toHaveLength(0);
});

test('renders an Add button while below maxItems', () => {
  const wrapper = shallow(
    <FormFieldArrayWrapper fieldName="slides" maxItems={10} fieldValue={[{}, {}]} onUpdateField={jest.fn()}>
      <Child />
    </FormFieldArrayWrapper>
  );

  expect(wrapper.find('.form__btn-heading__add')).toHaveLength(1);
  expect(wrapper.find('.form__note')).toHaveLength(0);
});

test('hides the Add button and shows a note once maxItems is reached', () => {
  const fieldValue = Array.from({ length: 10 }, () => ({}));
  const wrapper = shallow(
    <FormFieldArrayWrapper fieldName="slides" maxItems={10} fieldValue={fieldValue} onUpdateField={jest.fn()}>
      <Child />
    </FormFieldArrayWrapper>
  );

  expect(wrapper.find('.form__btn-heading__add')).toHaveLength(0);
  expect(wrapper.find('.form__note').text()).toBe('Maximum of 10 reached');
});
