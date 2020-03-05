/*
 *
 * LanguageToggle
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import { DropButton, Box, ResponsiveContext } from 'grommet';
import { FormDown, FormUp, Checkmark } from 'grommet-icons';
import DropOption from 'styled/DropOption';

import { appLocales } from 'i18n';

import { getLocale } from 'containers/App/selectors';
import { LANGUAGES } from 'containers/App/constants';
import { changeLocale } from 'containers/LanguageProvider/actions';

import messages from './messages';

const Styled = styled.span``;
// prettier-ignore
const StyledDropButton = styled(DropButton)`
  padding: 0 0 0 6px;
  color: ${({ theme, light }) => theme.global.colors[light ? 'dark-2' : 'dark-3' ]};
  font-weight: 600;
  background: transparent;
  &:hover {
    color: ${({ theme, light }) => light && theme.global.colors.highlight3};
  }
  &:active {
    color: ${({ theme, light }) => light && theme.global.colors.highlight3};
  }
  &:visited {
    color: ${({ theme, light }) => light && theme.global.colors.highlight3};
  }
  &:focus {
    color: ${({ theme, light }) => light && theme.global.colors.highlight3};
  }
  @media (min-width: ${({ theme }) => theme.breakpointsMin.large}) {
    padding-left: 10px;
  }
`;

const DropContent = ({ active, options, onSelect }) => (
  <Box pad="none">
    {options &&
      options.map(option => (
        <DropOption
          key={option}
          onClick={() => onSelect(option)}
          active={active === option}
          disabled={active === option}
        >
          <Box align="center" direction="row">
            {LANGUAGES.long[option]}
            {active === option && (
              <Box margin={{ left: 'auto' }}>
                <Checkmark color="dark-4" />
              </Box>
            )}
          </Box>
        </DropOption>
      ))}
  </Box>
);

export function LocaleToggle({ intl, locale, onLocaleToggle, light }) {
  const [open, setOpen] = useState(false);
  return (
    <Styled>
      <ResponsiveContext.Consumer>
        {size => (
          <StyledDropButton
            plain
            reverse
            light={light}
            gap="xxsmall"
            active={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            dropProps={{ align: { top: 'bottom', right: 'right' } }}
            icon={open ? <FormUp /> : <FormDown />}
            label={
              size === 'small'
                ? `${LANGUAGES.short[locale]}`
                : `${intl.formatMessage(messages.language)}
              ${LANGUAGES.short[locale]}`
            }
            dropContent={
              <DropContent
                active={locale}
                options={appLocales}
                onSelect={onLocaleToggle}
              />
            }
          />
        )}
      </ResponsiveContext.Consumer>
    </Styled>
  );
}

// <Toggle
//   inverse
//   value={props.locale}
//   values={appLocales}
//   formattedMessages={LANGUAGES.short}
//   onToggle={props.onLocaleToggle}
// />

LocaleToggle.propTypes = {
  onLocaleToggle: PropTypes.func,
  locale: PropTypes.string,
  light: PropTypes.bool,
  intl: intlShape.isRequired,
};

DropContent.propTypes = {
  onSelect: PropTypes.func,
  active: PropTypes.string,
  options: PropTypes.array,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLocaleToggle: locale => dispatch(changeLocale(locale)),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(LocaleToggle));
