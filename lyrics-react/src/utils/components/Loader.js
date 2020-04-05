import React, { memo } from 'react';
import { css } from '@emotion/core';
import FadeLoader from 'react-spinners/FadeLoader';

const loadingStyle = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Loader = ({ loading }) => (
  <FadeLoader
    css={loadingStyle}
    size={150}
    color={'#8d56fd'}
    loading={loading}
  />
);

export default memo(Loader);
