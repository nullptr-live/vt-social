import { connect } from 'react-redux';

import { cancelQuoteCompose } from 'flavours/glitch/actions/compose';
import { makeGetStatus } from '../../../selectors';
import QuoteIndicator from '../components/quote_indicator';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = state => {
    const statusId = state.getIn(['compose', 'quote_id'], null);
    const editing  = false;

    return {
      status: getStatus(state, { id: statusId }),
      editing,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({

  onCancel () {
    dispatch(cancelQuoteCompose());
  },

});

export default connect(makeMapStateToProps, mapDispatchToProps)(QuoteIndicator);
