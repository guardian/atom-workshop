import React from 'react';
import FormFieldCheckbox from './FormFieldCheckbox';
import renderer from 'react-test-renderer';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

let fieldLabel = 'test',
    fieldName = 'test',
    fieldValue = true;

test('Should render', () => {

  const updateFn = jest.fn();
  const component = renderer.create(
    <FormFieldCheckbox fieldLabel={fieldLabel} fieldName={fieldName} fieldValue={fieldValue} onUpdateField={updateFn} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should call update function on change', () => {

  const updateFn = jest.fn();
  const checkbox = shallow(
    <FormFieldCheckbox fieldLabel={fieldLabel} fieldName={fieldName} fieldValue={fieldValue} onUpdateField={updateFn} />
  );

  checkbox.find('input').simulate('change', {target: {value: false}});

  expect(updateFn).toHaveBeenCalledTimes(1);
});
