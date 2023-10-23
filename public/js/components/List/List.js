import React from 'react';
import {PropTypes} from 'prop-types';

const List = ({ items }) => (
  <section className="list">
    {items.map(({ title, body, type }, i) => (
      <div className="list__item" data-type={type} key={i}>
        <div className="list__item__title">{title}</div>
        {body && <p className="list__item__body">{body}</p>}
      </div>
    ))}
  </section>
);

List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      title: PropTypes.string.isRequired,
      body: PropTypes.string,
    })
  ),
};

export default List;
