import React from 'react';
import FormFieldTextInput from './FormFieldTextInput';
import renderer from 'react-test-renderer';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

let fieldLabel = 'test',
    fieldName = 'test',
    fieldValue= 'test';

test('Should render', () => {

  const updateFn = jest.fn();
  const component = renderer.create(
    <FormFieldTextInput fieldLabel={fieldLabel} fieldName={fieldName} fieldValue={fieldValue} onUpdateField={updateFn} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should call update function on change', () => {

  const updateFn = jest.fn();
  const input = shallow(
    <FormFieldTextInput fieldLabel={fieldLabel} fieldName={fieldName} fieldValue={fieldValue} onUpdateField={updateFn} />
  );

  input.find('input').simulate('change', {target: {value: "test"}});

  expect(updateFn).toHaveBeenCalledTimes(1);
});
