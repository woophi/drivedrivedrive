import * as React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { AppState } from 'core/models/app';
import { Link as RouterLink, LinkProps, NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';


const LinkComponent: React.SFC<LinkProps> = ({  to, ...props }) => {
  return <RouterLink to={to} {...props} />;
};

const NavLinkComponent: React.SFC<NavLinkProps> = ({ to, ...props }) => {
  return <RouterNavLink to={to} {...props} />;
};

const Link = LinkComponent;
const NavLink = NavLinkComponent;

export { Link, NavLink };
