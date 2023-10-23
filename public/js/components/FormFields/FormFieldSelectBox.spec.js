import React from 'react';
import FormFieldSelectBox from './FormFieldSelectBox';
import renderer from 'react-test-renderer';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

let fieldLabel = 'test',
    fieldName = 'test',
    fieldValue= 'test',
    selectValues = ['test', 'test1'];

test('Should render', () => {

  const updateFn = jest.fn();
  const component = renderer.create(
    <FormFieldSelectBox fieldLabel={fieldLabel} fieldName={fieldName} fieldValue={fieldValue} selectValues={selectValues} onUpdateField={updateFn} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Should call update function on change', () => {

  const updateFn = jest.fn();
  const select = shallow(
    <FormFieldSelectBox fieldLabel={fieldLabel} fieldName={fieldName} fieldValue={fieldValue} selectValues={selectValues} onUpdateField={updateFn} />
  );

  select.find('select').simulate('change', {target: {value: "test"}});

  expect(updateFn).toHaveBeenCalledTimes(1);
});
