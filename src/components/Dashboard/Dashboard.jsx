import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import find from 'lodash/find';
import { Loading } from 'carbon-components-react';

import { getLayout } from '../../utils/componentUtilityFunctions';
import {
  ValueCardPropTypes,
  CardSizesToDimensionsPropTypes,
  RowHeightPropTypes,
  DashboardBreakpointsPropTypes,
  DashboardColumnsPropTypes,
  DashboardLayoutPropTypes,
} from '../../constants/PropTypes';
import ValueCard from '../ValueCard/ValueCard';
import DonutCard from '../DonutCard/DonutCard';
import TableCard from '../TableCard/TableCard';
import BarChartCard from '../BarChartCard/BarChartCard';
import PieCard from '../PieCard/PieCard';
import TimeSeriesCard from '../TimeSeriesCard/TimeSeriesCard';
import {
  DASHBOARD_COLUMNS,
  DASHBOARD_BREAKPOINTS,
  CARD_DIMENSIONS,
  CARD_SIZES,
  ROW_HEIGHT,
  GUTTER,
  CARD_TYPES,
} from '../../constants/LayoutConstants';

import DashboardHeader from './DashboardHeader';

const propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  lastUpdated: PropTypes.string,
  lastUpdatedLabel: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.shape(ValueCardPropTypes)).isRequired,
  layouts: PropTypes.shape({
    max: PropTypes.arrayOf(DashboardLayoutPropTypes),
    xl: PropTypes.arrayOf(DashboardLayoutPropTypes),
    lg: PropTypes.arrayOf(DashboardLayoutPropTypes),
    md: PropTypes.arrayOf(DashboardLayoutPropTypes),
    sm: PropTypes.arrayOf(DashboardLayoutPropTypes),
    xs: PropTypes.arrayOf(DashboardLayoutPropTypes),
  }),
  /** Row height in pixels for each layout */
  rowHeight: RowHeightPropTypes,
  /** media query pixel measurement that determines which particular dashboard layout should be used */
  dashboardBreakpoints: DashboardBreakpointsPropTypes,
  /** map of number of columns to a given dashboard layout */
  dashboardColumns: DashboardColumnsPropTypes,
  onCardAction: PropTypes.func,
  /** Is the dashboard in edit mode? */
  isEditable: PropTypes.bool,
  /** Is the dashboard loading data */
  isLoading: PropTypes.bool,
  /** array of configurable sizes to dimensions */
  cardDimensions: CardSizesToDimensionsPropTypes,
  /** Optional filter that should be rendered top right */
  filter: PropTypes.node,
};

const defaultProps = {
  isEditable: false,
  isLoading: false,
  description: null,
  lastUpdated: null,
  lastUpdatedLabel: 'Last updated: ',
  layouts: {},
  rowHeight: ROW_HEIGHT,
  onCardAction: null,
  cardDimensions: CARD_DIMENSIONS,
  dashboardBreakpoints: DASHBOARD_BREAKPOINTS,
  dashboardColumns: DASHBOARD_COLUMNS,
  filter: null,
};

const GridLayout = WidthProvider(Responsive);

const StyledGridLayout = styled(GridLayout)`
  &&& {
    .react-grid-item.cssTransforms {
      transition-property: ${props => (props.shouldAnimate ? 'transform' : 'none')};
    }
  }
`;

/** This component is a dumb component and only knows how to render itself */
const Dashboard = ({
  cards,
  onCardAction,
  title,
  description,
  lastUpdated,
  lastUpdatedLabel,
  dashboardBreakpoints,
  cardDimensions,
  dashboardColumns,
  filter,
  rowHeight,
  layouts,
  isEditable,
  isLoading,
  className,
}) => {
  const [breakpoint, setBreakpoint] = useState('lg');
  // Keep track of whether it's mounted to turn back on the animations
  useEffect(() => {
    console.log('dashboard is remounting'); // eslint-disable-line
  }, []);

  // console.log(breakpoint);
  // console.log(dashboardBreakpoints, cardDimensions, rowHeight);

  const renderCard = card => (
    <div key={card.id}>
      {card.type === CARD_TYPES.VALUE ? (
        <ValueCard
          {...card}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.TIMESERIES ? (
        <TimeSeriesCard
          {...card}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.TABLE ? (
        <TableCard
          {...card}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.DONUT ? (
        <DonutCard
          {...card}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.PIE ? (
        <PieCard
          {...card}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.BAR ? (
        <BarChartCard
          {...card}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
    </div>
  );

  const generatedLayouts = Object.keys(dashboardBreakpoints).reduce((acc, layoutName) => {
    return {
      ...acc, // only generate the layout if we're not passed from the parent
      [layoutName]:
        layouts && layouts[layoutName]
          ? layouts[layoutName].map(layout => {
              // if we can't find the card from the layout, assume small
              let matchingCard = find(cards, { id: layout.i });
              if (!matchingCard) {
                console.error(`Error with your layout. Card with id: ${layout.i} not found`); //eslint-disable-line
                matchingCard = { size: CARD_SIZES.SMALL };
              }
              return { ...layout, ...cardDimensions[matchingCard.size][layoutName] };
            })
          : getLayout(layoutName, cards, dashboardColumns, cardDimensions),
    };
  }, {});

  // TODO: Can we pickup the GUTTER size and PADDING from the carbon grid styles? or css variables?
  // console.log(generatedLayouts);

  const gridContents = cards.map(card => renderCard(card));
  const expandedCard = cards.find(i => i.isExpanded) || null;

  return (
    <div className={className}>
      {expandedCard && (
        <div className="bx--modal is-visible">
          {renderCard({ ...expandedCard, size: CARD_SIZES.XLARGE })}
        </div>
      )}
      <DashboardHeader
        title={title}
        description={description}
        lastUpdated={lastUpdated}
        lastUpdatedLabel={lastUpdatedLabel}
        filter={filter}
      />
      {isLoading ? (
        <Loading withOverlay={false} />
      ) : (
        <StyledGridLayout
          layouts={generatedLayouts}
          compactType="vertical"
          cols={dashboardColumns}
          breakpoints={dashboardBreakpoints}
          margin={[GUTTER, GUTTER]}
          rowHeight={rowHeight[breakpoint]}
          preventCollision={false}
          // Stop the initial animation
          shouldAnimate={isEditable}
          // TODO: need to consider preserving their loose packing decisions on layout change
          // TODO: also, should we reorder our cards based on the layout change, and regenerate all
          //       other layouts?  for example, moving card 5 to before card 2 in lg should mean
          //       that the order changes for xl, md, sm, xs, etc. layouts
          /* onLayoutChange={
         layout =>  console.log('new layout, time to regenerate', JSON.stringify(layout)
        } */
          onBreakpointChange={newBreakpoint => setBreakpoint(newBreakpoint)}
          isResizable={false}
          isDraggable={isEditable}
        >
          {gridContents}
        </StyledGridLayout>
      )}
    </div>
  );
};

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

export default Dashboard;
