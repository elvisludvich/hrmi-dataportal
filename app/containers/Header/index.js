/**
 *
 * Header
 *
 */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { Box, Button, ResponsiveContext, Image, Layer } from 'grommet';
import { Menu, Close, Share } from 'grommet-icons';

import logo from 'images/HRMI-Logo.svg';

import { appLocales, DEFAULT_LOCALE } from 'i18n';
import LocaleToggle from 'containers/LocaleToggle';
import {
  getRouterMatch,
  getRouterRoute,
  getLocale,
} from 'containers/App/selectors';
import { PAGES, PATHS, XPATHS } from 'containers/App/constants';

import {
  navigate,
  loadDataIfNeeded,
  setAsideLayer,
} from 'containers/App/actions';

import Search from 'containers/Search';

import ButtonNavPrimary from 'styled/ButtonNavPrimary';
import ContentMaxWidth from 'styled/ContentMaxWidth';

import {
  getHeaderHeight,
  getHeaderHeightTop,
  getHeaderHeightBottom,
  isMinSize,
  isMaxSize,
} from 'utils/responsive';

import rootMessages from 'messages';

import NavBottom from './NavBottom';

const Styled = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  width: 100%;
  height: ${({ theme }) => getHeaderHeight('small', theme)}px;
  @media (min-width: ${({ theme }) => theme.breakpointsMin.medium}) {
    height: ${({ theme }) => getHeaderHeight('medium', theme)}px;
  }
`;

const NavBarTop = props => (
  <Box
    direction="row"
    align="center"
    justify="end"
    height={`${getHeaderHeightTop(props.size, props.theme)}px`}
    {...props}
  />
);
NavBarTop.propTypes = {
  theme: PropTypes.object,
  size: PropTypes.string,
};

const NavBarBottom = props => (
  <Box
    direction="row"
    align="end"
    justify={isMinSize(props.size, 'medium') ? 'end' : 'start'}
    height={`${getHeaderHeightBottom(props.size, props.theme)}px`}
    {...props}
  />
);
NavBarBottom.propTypes = {
  theme: PropTypes.object,
  size: PropTypes.string,
};

const BrandButton = styled(Button)`
  height: ${({ theme }) => theme.sizes.header.small.heightTop}px;
  width: ${({ theme }) => theme.sizes.header.small.brandWidth}px;
  &:hover {
    opacity: 0.8;
  }
  @media (min-width: ${({ theme }) => theme.breakpointsMin.medium}) {
    height: ${({ theme }) => theme.sizes.header.height}px;
    width: ${({ theme }) => theme.sizes.header.brandWidth}px;
  }
`;
// color: ${({ theme }) => theme.global.colors.hover};
const BrandInner = styled(Box)`
  padding-top: ${({ theme }) => theme.sizes.header.small.padTop}px;
  padding-bottom: ${({ theme }) => theme.sizes.header.small.padBottom}px;
  padding-right: ${({ theme }) => theme.sizes.header.small.padRight}px;
  height: ${({ theme }) => theme.sizes.header.small.heightTop}px;
  @media (min-width: ${({ theme }) => theme.breakpointsMin.medium}) {
    height: ${({ theme }) => theme.sizes.header.height}px;
    padding-top: ${({ theme }) => theme.sizes.header.padTop}px;
    padding-bottom: ${({ theme }) => theme.sizes.header.padBottom}px;
    padding-right: ${({ theme }) => theme.sizes.header.padRight}px;
  }
`;

const LogoWrap = styled(Box)``;
const Logo = styled(Image)``;

const MenuList = styled(Box)`
  padding: ${({ theme }) => theme.global.edgeSize.small} 0;
  min-width: 280px;
`;

const MenuGroup = styled(Box)`
  vertical-align: top;
`;
// prettier-ignore
const ToggleMenu = styled(Button)`
  z-index: 300;
  width: 30px;
  height: 30px;
  background-color: transparent;
  text-align: center;
`;

const SearchWrap = styled(Box)`
  height: ${({ theme }) => getHeaderHeightBottom('small', theme)}px;
  @media (min-width: ${({ theme }) => theme.breakpointsMin.medium}) {
    height: ${({ theme }) => getHeaderHeightBottom('medium', theme)}px;
  }
`;

const StyledShare = styled(p => <Share {...p} size="small" />)`
  vertical-align: middle;
  margin-left: 7px;
  stroke: currentColor;
`;

const TextWrap = styled.span`
  vertical-align: middle;
`;

const navButtonOnClick = ({ match, onClick, align, locale }) =>
  PAGES &&
  Object.values(PAGES)
    .filter(page => page.primary)
    .map(page =>
      page.key === 'download' ? (
        <ButtonNavPrimary
          as="a"
          href={XPATHS.download[locale] || XPATHS.download[DEFAULT_LOCALE]}
          target="_blank"
          rel="noopener noreferrer"
          key={page.key}
        >
          <TextWrap>
            <FormattedMessage {...rootMessages.page[page.key]} />
          </TextWrap>
          <StyledShare />
        </ButtonNavPrimary>
      ) : (
        <ButtonNavPrimary
          key={page.key}
          active={page.key === match}
          disabled={page.key === match}
          align={align}
          onClick={() => onClick(page.key)}
        >
          <TextWrap>
            <FormattedMessage {...rootMessages.page[page.key]} />
          </TextWrap>
        </ButtonNavPrimary>
      ),
    );

const DEPENDENCIES = ['countries'];

export function Header({
  nav,
  onLoadData,
  match,
  path,
  theme,
  intl,
  onHideAsideLayer,
  locale,
}) {
  useEffect(() => {
    // kick off loading of page content
    onLoadData();
  }, []);

  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const menuRef = useRef(null);

  const onHome = () => {
    setShowMenu(false);
    nav({ pathname: '', search: '' });
  };
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Styled role="banner" size={size}>
          <Box elevation="medium" background="white">
            <ContentMaxWidth column={isMaxSize(size, 'sm')}>
              <Box
                direction="row"
                align="center"
                justify="stretch"
                fill={isMaxSize(size, 'sm') ? 'horizontal' : false}
              >
                <BrandButton plain onClick={onHome}>
                  <BrandInner
                    direction="row"
                    justify="start"
                    gap="10px"
                    fill={false}
                  >
                    <LogoWrap
                      justify="start"
                      width={`${
                        isMaxSize(size, 'sm')
                          ? theme.sizes.header.small.logoWidth
                          : theme.sizes.header.logoWidth
                      }px`}
                      flex={{ shrink: 0 }}
                    >
                      <Logo
                        src={logo}
                        alt={`${intl.formatMessage(rootMessages.app.title)}`}
                        a11yTitle={`${intl.formatMessage(
                          rootMessages.app.title,
                        )}`}
                        fit="contain"
                      />
                    </LogoWrap>
                  </BrandInner>
                </BrandButton>
                {isMaxSize(size, 'sm') && appLocales.length > 1 && (
                  <Box margin={{ left: 'auto' }}>
                    <LocaleToggle />
                  </Box>
                )}
                {isMaxSize(size, 'sm') && (
                  <ToggleMenu
                    plain
                    onClick={() => setShowMenu(!showMenu)}
                    ref={menuRef}
                  >
                    {!showMenu && <Menu color="dark" />}
                    {showMenu && <Close color="dark" />}
                  </ToggleMenu>
                )}
                {showMenu && isMaxSize(size, 'medium') && (
                  <Layer
                    full={isMaxSize(size, 'sm') ? 'horizontal' : false}
                    margin={{ top: '50px' }}
                    onClickOutside={() => setShowMenu(false)}
                    responsive={false}
                    position={isMaxSize(size, 'sm') ? 'top' : 'top-right'}
                    modal={false}
                    animate={false}
                  >
                    <MenuList elevation="large">
                      <MenuGroup>
                        {navButtonOnClick({
                          match,
                          onClick: key => {
                            setShowMenu(false);
                            nav(`${PATHS.PAGE}/${key}`);
                          },
                          align: 'left',
                          locale,
                        })}
                      </MenuGroup>
                    </MenuList>
                  </Layer>
                )}
              </Box>
              <Box fill>
                {isMinSize(size, 'large') && (
                  <NavBarTop
                    theme={theme}
                    direction="row"
                    justify="end"
                    size={size}
                    style={{ paddingTop: '25px' }}
                  >
                    {navButtonOnClick({
                      match,
                      onClick: key => {
                        setShowSearch(false);
                        nav(`${PATHS.PAGE}/${key}`);
                      },
                      locale,
                    })}
                    {appLocales.length > 1 && isMinSize(size, 'medium') && (
                      <LocaleToggle />
                    )}
                  </NavBarTop>
                )}
                {size === 'medium' && (
                  <NavBarTop
                    theme={theme}
                    direction="row"
                    justify="end"
                    size={size}
                  >
                    {appLocales.length > 1 && (
                      <Box margin={{ left: 'auto' }}>
                        <LocaleToggle />
                      </Box>
                    )}
                    <ToggleMenu
                      plain
                      onClick={() => setShowMenu(!showMenu)}
                      ref={menuRef}
                    >
                      {!showMenu && <Menu color="dark" />}
                      {showMenu && <Close color="dark" />}
                    </ToggleMenu>
                  </NavBarTop>
                )}
                <NavBarBottom theme={theme} size={size}>
                  {(!showSearch || isMaxSize(size, 'sm')) && (
                    <>
                      <NavBottom
                        type="metrics"
                        active={path === PATHS.METRICS || path === PATHS.METRIC}
                        onClick={() => {
                          onHideAsideLayer();
                        }}
                      />
                      <NavBottom
                        type="countries"
                        active={
                          path === PATHS.COUNTRIES || path === PATHS.COUNTRY
                        }
                        onClick={() => {
                          onHideAsideLayer();
                        }}
                      />
                      <NavBottom
                        type="people"
                        active={path === PATHS.GROUPS || path === PATHS.GROUP}
                        onClick={() => {
                          onHideAsideLayer();
                        }}
                      />
                    </>
                  )}
                  {isMinSize(size, 'large') && (
                    <SearchWrap justify="center">
                      <Search
                        expand={showSearch}
                        onToggle={show => setShowSearch(show)}
                        borderSize="none"
                      />
                    </SearchWrap>
                  )}
                </NavBarBottom>
              </Box>
            </ContentMaxWidth>
          </Box>
        </Styled>
      )}
    </ResponsiveContext.Consumer>
  );
}

Header.propTypes = {
  /** Navigation action */
  nav: PropTypes.func.isRequired,
  onHideAsideLayer: PropTypes.func.isRequired,
  match: PropTypes.string,
  path: PropTypes.string,
  locale: PropTypes.string,
  onLoadData: PropTypes.func.isRequired,
  theme: PropTypes.object,
  intl: intlShape.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onLoadData: () => {
    DEPENDENCIES.forEach(key => dispatch(loadDataIfNeeded(key)));
  },
  // navigate to location
  nav: location => {
    dispatch(
      navigate(location, {
        keepTab: true,
        trackEvent: {
          category: 'Content',
          action: 'Header: navigate',
          value: typeof location === 'object' ? location.pathname : location,
        },
      }),
    );
  },
  onHideAsideLayer: () => {
    dispatch(setAsideLayer(false));
  },
});

const mapStateToProps = createStructuredSelector({
  match: state => getRouterMatch(state),
  path: state => getRouterRoute(state),
  locale: state => getLocale(state),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(withTheme(injectIntl(Header)));
