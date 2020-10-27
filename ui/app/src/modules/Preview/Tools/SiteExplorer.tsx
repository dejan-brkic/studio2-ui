/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { createStyles } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ToolPanel from './ToolPanel';
import { siteExplorerItem } from '../../../services/configuration';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Widget from '../../../components/Navigation/PathNavigator/Widget';
import { Resource } from '../../../models/Resource';
import { SuspenseWithEmptyState } from '../../../components/SystemStatus/Suspencified';
import { useActiveSiteId, useLogicResource, useRoles, useSelection } from '../../../utils/hooks';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
import palette from '../../../styles/palette';

type SiteExplorerResource = { supported: siteExplorerItem[]; notSupported: siteExplorerItem[] };

interface SiteExplorerProps {
  resource: Resource<SiteExplorerResource>;
}

const translations = defineMessages({
  title: {
    id: 'siteExplorerPanel.title',
    defaultMessage: 'Site Explorer'
  },
  noSidebarItems: {
    id: 'siteExplorerPanel.emptyMessage',
    defaultMessage: 'No widgets are configured to show on the site explorer.'
  },
  unsupportedItemsPreset: {
    id: 'siteExplorerPanel.unsupportedItemsPreset',
    defaultMessage: "Some items in the site explorer config are not supported and won't show."
  }
});

const useLinkIconStyles = makeStyles(() =>
  createStyles({
    links: {
      paddingTop: 0,
      paddingLeft: 9,
      paddingBottom: 0,
      textDecoration: 'none !important'
    },
    icon: {
      marginRight: 3
    }
  })
);

const useExplorerStyles = makeStyles(() =>
  createStyles({
    body: {
      marginLeft: 10,
      borderLeft: `3px solid ${palette.gray.light2}`
    },
    searchRoot: {
      marginRight: 10
    }
  })
);

interface LinkWithIconProps {
  label: string;
  link: string;
  icon: {
    baseClass: string;
    baseStyle: object;
  };
}

const LinkWithIcon = (props: LinkWithIconProps) => {
  const { link, label, icon } = props;
  const classes = useLinkIconStyles();
  return (
    <ListItem button component={Link} href={link} className={classes.links}>
      <ListItemText
        primary={
          <>
            <i className={`${classes.icon} ${icon.baseClass}`} style={{ ...icon.baseStyle }} />{' '}
            {label}
          </>
        }
      />
    </ListItem>
  );
};

const ItemToComponentMap = {
  'craftercms.pathNavigator': Widget,
  'craftercms.linkWithIcon': LinkWithIcon
};

export function SiteExplorer(props: SiteExplorerProps) {
  const { resource } = props;
  const { supported: widgets, notSupported } = resource.read();
  const { formatMessage } = useIntl();
  const classes = useExplorerStyles();

  return (
    <>
      {Boolean(notSupported.length) && (
        <Alert severity="warning">{formatMessage(translations.unsupportedItemsPreset)}</Alert>
      )}
      {widgets?.map((item, index) => {
        const Component = ItemToComponentMap[item.id];
        return <Component key={index} {...item.parameters} classes={classes} />;
      })}
    </>
  );
}

export function SiteExplorerContainer() {
  const { formatMessage } = useIntl();
  const site = useActiveSiteId();
  const state = useSelection((state) => state.uiConfig);
  const rolesBySite = useRoles();

  const resource = useLogicResource(state, {
    errorSelector: (state) => state.error,
    resultSelector: ({ siteExplorer }) => {
      const supported = siteExplorer.filter((item) => {
        const userRoles = rolesBySite[site];
        const itemRoles = item.permittedRoles;
        const hasPermission = itemRoles?.length
          ? userRoles.some((role) => itemRoles.includes(role))
          : true;
        return (
          ['craftercms.linkWithIcon', 'craftercms.pathNavigator'].includes(item.id) && hasPermission
        );
      });
      const notSupported = siteExplorer.filter(
        (i) => !['craftercms.linkWithIcon', 'craftercms.pathNavigator'].includes(i.id)
      );
      return { supported, notSupported };
    },
    shouldReject: (state) => Boolean(state.error),
    shouldRenew: (state, resource) => resource.complete,
    shouldResolve: (state) => !state.isFetching && Boolean(state.siteExplorer)
  });

  return (
    <ToolPanel title={translations.title}>
      <SuspenseWithEmptyState
        resource={resource}
        withEmptyStateProps={{
          emptyStateProps: { title: formatMessage(translations.noSidebarItems) }
        }}
      >
        {/* @ts-ignore */}
        <SiteExplorer resource={resource} />
      </SuspenseWithEmptyState>
    </ToolPanel>
  );
}

export default SiteExplorerContainer;
