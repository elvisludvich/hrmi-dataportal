import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// import styled from 'styled-components';
import { Heading, Text, Box } from 'grommet';
import BarHorizontal from 'components/BarHorizontal';

import rootMessages from 'messages';
import formatScore from 'utils/format-score';

const IndicatorScoreText = props => (
  <Text
    weight="bold"
    size="small"
    alignSelf="end"
    margin={{ right: '52px' }}
    {...props}
  />
);

function IndicatorPanel({ indicator, column }) {
  const value = indicator.value && indicator.value[column];
  const maxValue = 100;
  return (
    <Box pad={{ vertical: 'xxsmall', horizontal: 'small' }} fill="horizontal">
      <Heading level={6} margin={{ vertical: '2px' }}>
        <FormattedMessage {...rootMessages.indicators[indicator.key]} />
      </Heading>
      {value && (
        <BarHorizontal
          height={8}
          color="esr"
          value={parseFloat(value)}
          minValue={0}
          maxValue={maxValue}
          noData={!value}
          unit="%"
        />
      )}
      <IndicatorScoreText color="esrDark">
        {value && formatScore(value)}
        {!value && 'N/A'}
      </IndicatorScoreText>
    </Box>
  );
}
IndicatorPanel.propTypes = {
  indicator: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  column: PropTypes.string,
};

export default IndicatorPanel;
