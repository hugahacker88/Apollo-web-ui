/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './styles.scss';

export default function Button(props) {
  const {
    onClick, name, className, type, disabled,
    color, size, isLoading,
  } = props;

  return (
    <button
      type={type}
      className={cn('btn', `btn-${color} btn-${size}`, className)}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading && (
        <div className="button-loader">
          <div className="ball-pulse">
            <div />
            <div />
            <div />
          </div>
        </div>
      )}
      <span className="button-text">{name}</span>
    </button>
  );
}

PropTypes.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  color: PropTypes.oneOf(['default', 'green', 'grey', 'transparent']),
  size: PropTypes.oneOf(['sm', 'lg']),
  className: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

Button.defaultProps = {
  type: 'button',
  color: 'default',
  disabled: false,
  isLoading: false,
};
