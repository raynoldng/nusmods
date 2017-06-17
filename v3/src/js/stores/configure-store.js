import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'reducers';
import requestsMiddleware from 'middlewares/requests-middleware';

// Creates a preconfigured store for this example.
export default function configureStore(defaultState) {
  const middlewares = [thunk, requestsMiddleware];
  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable */
    const { createLogger } = require('redux-logger');
    /* eslint-enable */
    const logger = createLogger({
      level: 'info',
      collapsed: true,
      duration: true,
      diff: true,
    });
    middlewares.push(logger);
  }
  return createStore(rootReducer, defaultState, compose(
    applyMiddleware(...middlewares), window.devToolsExtension ? window.devToolsExtension() : f => f));
}
