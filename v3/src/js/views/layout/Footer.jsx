// @flow
import React from 'react';
// import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="nm-footer text-muted">
      <div className="container">
        <ul className="nm-footer-links">
          Forked from <li><a href="https://github.com/nusmodifications/nusmods">NUSMods</a></li>
          { /*
            <li><a href="https://www.facebook.com/nusmods">Facebook</a></li>
            <li><a href="https://twitter.com/nusmods">Twitter</a></li>
            <li><a href="http://blog.nusmods.com/">Blog</a></li>
            <li><a href="https://github.com/nusmodifications/nusmods-api">API</a></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          */ }
        </ul>
        {/* TODO: Change team to link to internal page. */}
        {/* TODO: Change contributors link to internal page */}
        {/* TODO: Add last updated timestamp */}
        {/*
          <p>Designed and built with all the love in the world by{' '}
            <a href="https://github.com/nusmodifications" target="_blank" rel="noopener noreferrer">
              @nusmodifications
            </a>.
            Maintained by the{' '}
            <a href="https://github.com/orgs/nusmodifications/people" rel="noopener noreferrer">
              core team
            </a>
            {' '}with the help of{' '}
            <a href="https://github.com/nusmodifications/nusmods/graphs/contributors"
              rel="noopener noreferrer"
            >
              our contributors
            </a>.
          </p>
        */}
        <p>Jointly designed by{' '}
          <a href="https://github.com/bayweiheng" target="_blank" rel="noopener noreferrer">
            @bayweiheng
          </a> and{' '}
          <a href="https://github.com/raynoldng" target="_blank" rel="noopener noreferrer">
            @raynoldng
          </a> as part of NUS Orbital 2017.
        </p>
        <p>© Copyright 2017. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
