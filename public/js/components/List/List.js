import React, { PropTypes } from 'react';

const List = ({ items }) => (
  <section className="list">
    {items.map(({ title, body, type }) => (
      <div className="list__item" data-type={type}>
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
