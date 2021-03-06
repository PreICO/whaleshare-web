import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import Icon from 'app/components/elements/Icon';
import user from 'app/redux/User';
import Userpic from 'app/components/elements/Userpic';
import {browserHistory} from 'react-router';
import {LinkWithDropdown} from 'react-foundation-components/lib/global/dropdown';
import VerticalMenu from 'app/components/elements/VerticalMenu';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import NotifiCounter from 'app/components/elements/NotifiCounter';
import tt from 'counterpart';

const defaultNavigate = (e) => {
  if (e.metaKey || e.ctrlKey) {
    // prevent breaking anchor tags
  } else {
    e.preventDefault();
  }
  const a = e.target.nodeName.toLowerCase() === 'a' ? e.target : e.target.parentNode;
  browserHistory.push(a.pathname + a.search + a.hash);
};

function TopRightMenu({username, showLogin, logout, loggedIn, vertical, navigate, toggleOffCanvasMenu, probablyLoggedIn, nightmodeEnabled, toggleNightmode}) {
  const mcn = 'menu' + (vertical ? ' vertical show-for-small-only' : '');
  const mcl = vertical ? '' : ' sub-menu';
  const lcn = vertical ? '' : 'show-for-medium';
  const nav = navigate || defaultNavigate;
  let submit_story = null;
  const feed_link = `/@${username}/feed`;
  const replies_link = `/@${username}/recent-replies`;
  const wallet_link = `/@${username}/transfers`;
  const account_link = `/@${username}`;
  const shares = `/@${username}/shares`;
  const comments_link = `/@${username}/comments`;
  const reset_password_link = `/@${username}/password`;
  const settings_link = `/@${username}/settings`;
  const tt_search = tt('g.search');
  if (loggedIn) { // change back to if(username) after bug fix:  Clicking on Login does not cause drop-down to close #TEMP!
    submit_story = $STM_Config.read_only_mode ? null :
      <li className="submit-icon"><Link to="/submit.html"><Icon size="2x" name="i-write"/></Link></li>;
    const user_menu = [
      {link: feed_link, icon: 'i-feed', value: tt('g.usermenu.feed'), addon: <NotifiCounter fields="feed"/>},
      {link: account_link, icon: 'i-blog', value: tt('g.usermenu.blog')},
      {link: shares, icon: 'i-shares', value: tt('g.usermenu.shares')},
      {link: comments_link, icon: 'i-comments', value: tt('g.usermenu.comments')},
      {
        link: replies_link,
        icon: 'i-replies',
        value: tt('g.usermenu.replies'),
        addon: <NotifiCounter fields="comment_reply"/>
      },
      {
        link: wallet_link,
        icon: 'i-wallet',
        value: tt('g.usermenu.wallet'),
        addon: <NotifiCounter fields="follow,send,receive,account_update"/>
      },
      {link: '#', icon: 'i-night', onClick: toggleNightmode, value: tt('g.usermenu.night')},
      {link: reset_password_link, icon: 'i-password', value: tt('g.usermenu.password')},
      {link: settings_link, icon: 'i-settings', value: tt('g.usermenu.settings')},
      loggedIn ?
        {link: '#', icon: 'i-logout', onClick: logout, value: tt('g.usermenu.logout')} :
        {link: '#', onClick: showLogin, value: tt('g.login')}
    ];
    return (
      <ul className={mcn + mcl}>
        {submit_story}
        <LinkWithDropdown
          closeOnClickOutside
          dropdownPosition="bottom"
          dropdownAlignment="right"
          dropdownContent={
            <VerticalMenu className={'Usermenu'} items={user_menu} title={username}/>
          }
        >
          {!vertical && <li className={'Header__userpic '}>
            <a href={account_link} title={username} onClick={e => e.preventDefault()}>
              <Userpic account={username}/>
            </a>
            <div className="TopRightMenu__notificounter"><NotifiCounter fields="total"/></div>
          </li>}
        </LinkWithDropdown>
        {toggleOffCanvasMenu && <li className="toggle-menu Header__hamburger"><a href="#" onClick={toggleOffCanvasMenu}>
          <span className="hamburger"/>
        </a></li>}
      </ul>
    );
  }
  if (probablyLoggedIn) {
    return (
      <ul className={mcn + mcl}>
        <li className={lcn} style={{paddingTop: 0, paddingBottom: 0}}><LoadingIndicator type="circle" inline/></li>
        {toggleOffCanvasMenu && <li className="toggle-menu Header__hamburger"><a href="#" onClick={toggleOffCanvasMenu}>
          <span className="hamburger"/>
        </a></li>}
      </ul>
    );
  }
  return (
    <ul className={mcn + mcl}>
      {/*<li className={lcn}><a href="/pick_account">{tt('g.sign_up')}</a></li>*/}
      {/*<li className={lcn}><a href="/claim.html">{tt('g.claim_acc')}</a></li>*/}
      <li className={lcn}><a href="/newsignup.html">{tt('g.sign_up')}</a></li>
      <li className={lcn}><a href="/login.html" onClick={showLogin}>{tt('g.login')}</a></li>
      {submit_story}
      {toggleOffCanvasMenu && <li className="toggle-menu Header__hamburger"><a href="#" onClick={toggleOffCanvasMenu}>
        <span className="hamburger"/>
      </a></li>}
    </ul>
  );
}

TopRightMenu.propTypes = {
  username: React.PropTypes.string,
  loggedIn: React.PropTypes.bool,
  probablyLoggedIn: React.PropTypes.bool,
  showLogin: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
  vertical: React.PropTypes.bool,
  navigate: React.PropTypes.func,
  toggleOffCanvasMenu: React.PropTypes.func,
  nightmodeEnabled: React.PropTypes.bool,
  toggleNightmode: React.PropTypes.func,
};

export default connect(
  state => {
    if (!process.env.BROWSER) {
      return {
        username: null,
        loggedIn: false,
        probablyLoggedIn: !!state.offchain.get('account')
      }
    }
    const username = state.user.getIn(['current', 'username']);
    const loggedIn = !!username;
    return {
      username,
      loggedIn,
      probablyLoggedIn: false,
      nightmodeEnabled: state.user.getIn(['user_preferences', 'nightmode']),
    }
  },
  dispatch => ({
    showLogin: e => {
      if (e) e.preventDefault();
      dispatch(user.actions.showLogin())
    },
    logout: e => {
      if (e) e.preventDefault();
      dispatch(user.actions.logout())
    },
    toggleNightmode: e => {
      if (e) e.preventDefault();
      dispatch({type: 'TOGGLE_NIGHTMODE'});
    },
  })
)(TopRightMenu);
