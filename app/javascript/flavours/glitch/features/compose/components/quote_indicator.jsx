//  Package imports.
import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';


import CloseIcon from '@/material-icons/400-24px/close.svg?react';
import AttachmentList from 'flavours/glitch/components/attachment_list';
import { WithOptionalRouterPropTypes, withOptionalRouter } from 'flavours/glitch/utils/react_router';

import { Avatar } from '../../../components/avatar';
import { DisplayName } from '../../../components/display_name';
import { Icon } from '../../../components/icon';
import { IconButton } from '../../../components/icon_button';

//  Messages.
const messages = defineMessages({
  cancel: {
    defaultMessage: 'Cancel',
    id: 'quote_indicator.cancel',
  },
});

class QuoteIndicator extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map,
    onCancel: PropTypes.func,
    intl: PropTypes.object.isRequired,
    ...WithOptionalRouterPropTypes,
  };

  handleClick = () => {
    this.props.onCancel();
  };

  handleAccountClick = (e) => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.props.history?.push(`/@${this.props.status.getIn(['account', 'acct'])}`);
    }
  }

  //  Rendering.
  render () {
    const { status, intl } = this.props;

    if (!status) {
      return null;
    }

    const content = { __html: status.get('contentHtml') };

    //  The result.
    return (
      <article className='quote-indicator'>
        <header className='quote-indicator__header'>
          <div className='quote-indicator__cancel'>
            <IconButton title={intl.formatMessage(messages.cancel)} icon='times' iconComponent={CloseIcon} onClick={this.handleClick} inverted />
          </div>

          <a href={status.getIn(['account', 'url'])} onClick={this.handleAccountClick} className='quote-indicator__display-name' target='_blank' rel='noopener noreferrer'>
            <div className='quote-indicator__display-avatar'><Avatar account={status.get('account')} size={24} /></div>
            <DisplayName account={status.get('account')} inline />
          </a>
        </header>

        <div className='quote-indicator__content translate' dangerouslySetInnerHTML={content} />

        {status.get('media_attachments').size > 0 && (
          <AttachmentList
            compact
            media={status.get('media_attachments')}
          />
        )}
      </article>
    );
  }

}

export default withOptionalRouter(injectIntl(QuoteIndicator));
