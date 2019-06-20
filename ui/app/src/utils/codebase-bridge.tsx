/*
 * Copyright (C) 2007-2019 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { JSXElementConstructor, lazy } from 'react';
import ReactDOM from 'react-dom';

import { capitalize } from './string';
import CrafterCMSNextBridge from '../components/CrafterCMSNextBridge';
import ajax from './ajax';

/**
 *
 * To use from existing studio-ui code:
 *
 * Example 1 - Using components
 *
 * CrafterCMSNext
 *   .render(someElementOrSelector, 'AsyncVideoPlayer', { nonPlayableMessage })
 *   .then(() => {
 *     // Optional callback - you don't call .then(...) if you don't need a callback
 *     console.log('The AsyncVideoPlayer (react component) is now rendered.')
 *   });
 *
 * Example 2 - Using assets
 *
 * img.src = CrafterCMSNext.Asset.logoIcon
 *
 */

interface CodebaseBridge {
  React: typeof React;
  ReactDOM: typeof ReactDOM;
  components: { [key: string]: JSXElementConstructor<any> };
  assets: { [key: string]: () => Promise<any> };
  util: object;
  render: Function;
}

export function createCodebaseBridge() {

  const Bridge: CodebaseBridge = {

    // React
    React,
    ReactDOM,

    components: {
      AsyncVideoPlayer: lazy(() => import('../components/AsyncVideoPlayer'))
    },

    assets: {
      logoIcon: require('../assets/crafter-icon.svg')
    },

    util: {
      ajax,
      string: { capitalize }
    },

    // Mechanics
    render(
      container: (string | Element),
      component: string | JSXElementConstructor<any>,
      props: object = {}): Promise<any> {

      if (
        typeof component !== 'string' &&
        !Object.values(Bridge.components).includes(component)
      ) {
        throw new Error('The supplied module is not a know component of CrafterCMSNext.');
      } else if (!(component in Bridge.components)) {
        throw new Error('The supplied component name is not a know component of CrafterCMSNext.');
      }

      if (typeof container === 'string') {
        container = document.querySelector(container);
      }

      const Component: JSXElementConstructor<any> = (typeof component === 'string')
        ? Bridge.components[component]
        : component;

      return (
        new Promise((resolve, reject) => {
          try {
            // @ts-ignore
            ReactDOM.unstable_createRoot(container)
              .render(
                // @ts-ignore
                <CrafterCMSNextBridge>
                  <Component {...props} />
                </CrafterCMSNextBridge>,
                () => resolve()
              );
          } catch (e) {
            reject(e);
          }
        })
      );
    }

  };

  // @ts-ignore
  window.CrafterCMSNext = Bridge;

}