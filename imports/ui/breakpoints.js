/**
 * This file defines view breakpoints for the app
 * Following an example from
 * styled-components: https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md#media-templates
 */

// these sizes are arbitrary and you can set them to whatever you wish
import { css } from 'styled-components';

const sizes = {
  giant: 1170,
  desktop: 992,
  tablet: 768,
  phone: 376,
};

// iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((accumulator, label) => {
  /* eslint-disable no-param-reassign */
  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16;
  accumulator[label] = (...args) => css`@media (max-width: ${emSize}em) {${css(...args)};}`;
  return accumulator;
}, {});

export default media;
