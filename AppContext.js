import React, { createContext } from 'react';

import PropTypes from 'prop-types';

const Context = createContext();

const Provider = ({
  children,
}) => {

  return (
    <Context.Provider
      value={{
        
      }}>
        {children}
      </Context.Provider>
  );

};

Provider.propTypes = {
  children: PropTypes.node,
};

export {
  Context,
  Provider,
}