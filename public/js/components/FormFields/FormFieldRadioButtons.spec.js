import React from 'react';
import FormFieldRadioButtons from './FormFieldRadioButtons';
import renderer from 'react-test-renderer';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

let fieldLabel = 'test',
    fieldName = 'test',
    fieldValues = ['One', 'Two'];

test('Should render', () => {

  const updateFn = jest.fn();
  const component = renderer.create(
    <FormFieldRadioButtons fieldLabel={fieldLabel} fieldName={fieldName} selectValues={fieldValues} onUpdateField={updateFn} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should call update function on change', () => {

  const updateFn = jest.fn();
  const radio = shallow(
    <FormFieldRadioButtons fieldLabel={fieldLabel} fieldName={fieldName} selectValues={fieldValues} onUpdateField={updateFn} />
  );

  radio.find('input').first().simulate('change', {target: {value: "test"}});

  expect(updateFn).toHaveBeenCalledTimes(1);
});
