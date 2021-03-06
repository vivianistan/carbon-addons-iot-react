import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  DataTable,
  OverflowMenu,
  OverflowMenuItem,
  Icon,
  Loading,
} from 'carbon-components-react';
import styled from 'styled-components';
import classnames from 'classnames';
import omit from 'lodash/omit';

import { settings } from '../../../../constants/Settings';
import { RowActionPropTypes, RowActionErrorPropTypes } from '../../TablePropTypes';
import { COLORS } from '../../../../styles/styles';

import RowActionsError from './RowActionsError';

const { TableCell } = DataTable;
const { iotPrefix } = settings;

const StyledTableCell = styled(TableCell)`
  && {
    padding: 0;
    vertical-align: middle;
  }
`;

const RowActionsContainer = styled.div`
  &&& {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    /* If the actions are focused on, they should show up */
    > *:focus {
      opacity: 1;
    }

    /* the spinner was a little too big and causing the row to scroll so need to scale down a bit */
    .bx--loading--small {
      width: 1.875rem;
      height: 1.875rem;
    }
  }
`;

const OverflowMenuContent = styled.div`
  & {
    display: flex;
    align-items: center;
  }
`;

const StyledIcon = styled(Icon)`
  & {
    margin-right: 0.5rem;
    width: 1rem;
  }
`;

const StyledOverflowMenu = styled(({ isRowExpanded, ...other }) => <OverflowMenu {...other} />)`
  &&& {
    margin-left: 0.5rem;
    svg {
      margin-left: ${props => (props.hideLabel !== 'false' ? '0' : '')};
    }
  }
  &&&:hover > svg {
    fill: ${COLORS.blue};
  }
`;

const propTypes = {
  /** Need to render different styles if expanded */
  isRowExpanded: PropTypes.bool,
  /** Unique id for each row, passed back for each click */
  id: PropTypes.string.isRequired,
  /** Unique id for the table */
  tableId: PropTypes.string.isRequired,
  /** Array with all the actions to render */
  actions: RowActionPropTypes,
  /** Callback called if a row action is clicked */
  onApplyRowAction: PropTypes.func.isRequired,
  /** translated text for more actions */
  overflowMenuAria: PropTypes.string,
  /** Is a row action actively running */
  isRowActionRunning: PropTypes.bool,
  /** row action error out */
  rowActionsError: RowActionErrorPropTypes,
  onClearError: PropTypes.func,
  /** I18N label for in progress */
  inProgressText: PropTypes.string,
  /** I18N label for action failed */
  actionFailedText: PropTypes.string, // eslint-disable-line
  /** I18N label for learn more */
  learnMoreText: PropTypes.string, // eslint-disable-line
  /** I18N label for dismiss */
  dismissText: PropTypes.string, // eslint-disable-line
  /** `true` to make this menu item a divider. */
  hasDivider: PropTypes.bool,
  /** `true` to make this menu item a "danger button". */
  isDelete: PropTypes.bool,
};

const defaultProps = {
  isRowExpanded: false,
  actions: null,
  isRowActionRunning: false,
  rowActionsError: null,
  overflowMenuAria: 'More actions',
  inProgressText: 'In progress',
  onClearError: null,
  hasDivider: false,
  isDelete: false,
};

const onClick = (e, id, action, onApplyRowAction) => {
  onApplyRowAction(action, id);
  e.preventDefault();
  e.stopPropagation();
};

class RowActionsCell extends React.Component {
  state = {
    isOpen: false,
  };

  handleOpen = () => {
    const { isOpen } = this.state;
    if (!isOpen) {
      this.setState({ isOpen: true });
    }
  };

  handleClose = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const {
      isRowExpanded,
      id,
      tableId,
      actions,
      onApplyRowAction,
      overflowMenuAria,
      actionFailedText,
      learnMoreText,
      dismissText,
      isRowActionRunning,
      rowActionsError,
      onClearError,
      inProgressText,
    } = this.props;
    const { isOpen } = this.state;
    const hasOverflow = actions && actions.filter(action => action.isOverflow).length > 0;
    return actions && actions.length > 0 ? (
      <StyledTableCell key={`${id}-row-actions-cell`}>
        <RowActionsContainer
          isRowExpanded={isRowExpanded}
          className={`${iotPrefix}--row-actions-container`}
        >
          <div
            className={classnames(`${iotPrefix}--row-actions-container__background`, {
              [`${iotPrefix}--row-actions-container__background--overflow-menu-open`]: isOpen,
            })}
          >
            {rowActionsError ? (
              <RowActionsError
                actionFailedText={actionFailedText}
                learnMoreText={learnMoreText}
                dismissText={dismissText}
                rowActionsError={rowActionsError}
                onClearError={onClearError}
              />
            ) : isRowActionRunning ? (
              <Fragment>
                <Loading small withOverlay={false} />
                {inProgressText}
              </Fragment>
            ) : (
              <Fragment>
                {actions
                  .filter(action => !action.isOverflow)
                  .map(({ id: actionId, labelText, ...others }) => (
                    <Button
                      {...omit(others, ['isOverflow'])}
                      iconDescription={overflowMenuAria}
                      key={`${tableId}-${id}-row-actions-button-${actionId}`}
                      data-testid={`${tableId}-${id}-row-actions-button-${actionId}`}
                      kind="ghost"
                      className={classnames({
                        [`${iotPrefix}--row-actions-cell-btn--icononly`]: !labelText,
                      })}
                      onClick={e => onClick(e, id, actionId, onApplyRowAction)}
                    >
                      {labelText}
                    </Button>
                  ))}
                {hasOverflow ? (
                  <StyledOverflowMenu
                    id={`${tableId}-${id}-row-actions-cell-overflow`}
                    data-testid={`${tableId}-${id}-row-actions-cell-overflow`}
                    flipped
                    ariaLabel={overflowMenuAria}
                    onClick={event => event.stopPropagation()}
                    isRowExpanded={isRowExpanded}
                    iconDescription={overflowMenuAria}
                    onOpen={this.handleOpen}
                    onClose={this.handleClose}
                  >
                    {actions
                      .filter(action => action.isOverflow)
                      .map(action => (
                        <OverflowMenuItem
                          key={`${id}-row-actions-button-${action.id}`}
                          onClick={e => onClick(e, id, action.id, onApplyRowAction)}
                          requireTitle
                          hasDivider={action.hasDivider}
                          isDelete={action.isDelete}
                          itemText={
                            action.renderIcon ? (
                              <OverflowMenuContent>
                                {typeof action.renderIcon === 'string' ? (
                                  <StyledIcon
                                    icon={action.renderIcon}
                                    description={action.labelText}
                                    iconTitle={action.labelText}
                                  />
                                ) : (
                                  <action.renderIcon />
                                )}
                                {action.labelText}
                              </OverflowMenuContent>
                            ) : (
                              action.labelText
                            )
                          }
                          disabled={action.disabled}
                        />
                      ))}
                  </StyledOverflowMenu>
                ) : null}
              </Fragment>
            )}
          </div>
        </RowActionsContainer>
      </StyledTableCell>
    ) : null;
  }
}

RowActionsCell.propTypes = propTypes;
RowActionsCell.defaultProps = defaultProps;

export default RowActionsCell;
