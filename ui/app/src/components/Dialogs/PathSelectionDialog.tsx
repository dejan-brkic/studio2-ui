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

import DialogHeader from './DialogHeader';
import DialogBody from './DialogBody';
import DialogFooter from './DialogFooter';
import Button from '@material-ui/core/Button';
import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import { useActiveSiteId, useLogicResource, useUnmount } from '../../utils/hooks';
import FolderBrowserTreeView, {
  legacyItemsToTreeNodes,
  TreeNode
} from '../Navigation/FolderBrowserTreeView';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import CreateNewFolderDialog from './CreateNewFolderDialog';
import { get } from '../../utils/ajax';
import LookupTable from '../../models/LookupTable';
import Suspencified from '../SystemStatus/Suspencified';
import { getIndividualPaths } from '../../utils/path';
import { forkJoin, Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';

const messages = defineMessages({
  ok: {
    id: 'words.accept',
    defaultMessage: 'Accept'
  },
  cancel: {
    id: 'words.cancel',
    defaultMessage: 'Cancel'
  },
  create: {
    id: 'path.browser.createFolderButtonLabel',
    defaultMessage: 'Create Folder'
  }
});

const useStyles = makeStyles(() => createStyles({
  dialogBody: {
    minHeight: '60vh'
  },
  createFolderBtn: {
    marginRight: 'auto'
  },
  treeViewRoot: {
    marginTop: '15px'
  }
}));

interface PathSelectionDialogProps {
  open: boolean;
  rootPath: string;
  initialPath?: string;
  title?: string;
  onClose(): void;
  onClosed?(): void;
  onOk(selectedPath: string): void;

}

export default function PathSelectionDialog(props: PathSelectionDialogProps) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      maxWidth='sm'
    >
      <PathSelectionDialogWrapper {...props} />
    </Dialog>
  );
}

function PathSelectionDialogWrapper(props: PathSelectionDialogProps) {
  const { onClosed, onClose, onOk, rootPath, initialPath, title } = props;
  const classes = useStyles({});
  const site = useActiveSiteId();
  const { formatMessage } = useIntl();
  const [currentPath, setCurrentPath] = useState(initialPath ?? rootPath);
  const [expanded, setExpanded] = useState(initialPath ? getIndividualPaths(initialPath, rootPath) : [rootPath]);
  const [invalidPath, setInvalidPath] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [treeNodes, setTreeNodes] = useState<TreeNode>(null);
  const [createFolder, setCreateFolder] = useState(false);
  const nodesLookupRef = useRef<LookupTable<TreeNode>>({});
  useUnmount(onClosed);

  useEffect(() => {

    if (currentPath) {
      let nodesLookup = nodesLookupRef.current;

      if (nodesLookup[currentPath] && nodesLookup[currentPath]?.fetched) {
        setInvalidPath(false);
      } else {
        let cleanedRootPath = rootPath.endsWith('/') ? rootPath.slice(0, -1) : rootPath;
        const allPaths = getIndividualPaths(currentPath, cleanedRootPath).filter(
          path => {
            if (cleanedRootPath === path && nodesLookup[rootPath]) {
              return false;
            }
            return !nodesLookup[path] || !nodesLookup[path].fetched;
          }
        );
        const requests: Observable<AjaxResponse>[] = [];
        allPaths.forEach((nextPath) => {
          setFetching(true);
          requests.push(
            get(
              `/studio/api/1/services/api/1/content/get-items-tree.json?site=${site}&path=${nextPath}&depth=1&order=default`
            )
          );
        });

        forkJoin(requests).subscribe((responses) => {
          let rootNode;
          setFetching(false);
          responses.forEach(({ response: { item } }, i) => {
            let parent;

            if (i === requests.length - 1) {
              setInvalidPath(item.deleted);
            }

            if (item.deleted) {
              return;
            }

            if (!nodesLookup['root']) {
              let id = item.path + '/';
              parent = {
                id: id,
                name: item.name,
                fetched: true,
                children: legacyItemsToTreeNodes(item.children)
              };
              rootNode = parent;
              nodesLookup[id] = parent;
              nodesLookup['root'] = parent;
            } else {
              rootNode = nodesLookup['root'];
              parent = nodesLookup[item.path];
              parent.fetched = true;
              parent.children = legacyItemsToTreeNodes(item.children);
            }

            parent.children.forEach((child) => {
              nodesLookup[child.id] = child;
            });

          });
          setTreeNodes({ ...rootNode });
        });
      }
    }

  }, [currentPath, rootPath, site]);

  const resource = useLogicResource<TreeNode, TreeNode>(treeNodes, {
    shouldResolve: (treeNodes) => Boolean(treeNodes),
    shouldReject: (treeNodes) => false,
    shouldRenew: (treeNodes, resource) => treeNodes === null && resource.complete,
    resultSelector: (treeNodes) => treeNodes,
    errorSelector: (treeNodes) => null
  });

  const onCreateFolder = () => {
    setCreateFolder(true);
  };

  const onCloseCreateFolder = () => {
    setCreateFolder(false);
  };

  const onFolderCreated = (path: string, name: string) => {
    setCreateFolder(false);
    let id = `${path}/${name}`;
    nodesLookupRef.current[currentPath].children.push({
      id,
      name: name,
      children: []
    });
    nodesLookupRef.current[id] = {
      id,
      name: name,
      children: [],
      fetched: true
    };
    setCurrentPath(id);
    setTreeNodes({ ...treeNodes });
  };

  const onNodeToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const onNodeSelected = (event: React.ChangeEvent<{}>, nodeId: string) => {
    setCurrentPath(nodeId);
  };

  const onPathChanged = (path: string) => {
    setCurrentPath(path);
    setExpanded(getIndividualPaths(path, rootPath));
  };

  return (
    <>
      <DialogHeader
        title={title
          ? title
          : <FormattedMessage id="path.dialog.title" defaultMessage="Select Path" />}
        onDismiss={onClose}
      />
      <DialogBody className={classes.dialogBody}>
        <Suspencified>
          <FolderBrowserTreeView
            classes={{
              treeViewRoot: classes.treeViewRoot
            }}
            invalidPath={invalidPath}
            onNodeToggle={onNodeToggle}
            onNodeSelected={onNodeSelected}
            rootPath={rootPath}
            currentPath={currentPath}
            expanded={expanded}
            selected={currentPath}
            resource={resource}
            onPathChanged={onPathChanged}
            fetching={fetching}
          />
        </Suspencified>
      </DialogBody>
      <DialogFooter>
        <Button
          disabled={invalidPath || fetching} onClick={onCreateFolder} variant="outlined"
          className={classes.createFolderBtn}
        >
          {formatMessage(messages.create)}
        </Button>
        <Button onClick={onClose} variant="outlined">
          {formatMessage(messages.cancel)}
        </Button>
        <Button
          disabled={invalidPath || fetching} onClick={() => onOk(currentPath)} variant="contained"
          color="primary"
        >
          {formatMessage(messages.ok)}
        </Button>
      </DialogFooter>
      <CreateNewFolderDialog
        path={currentPath}
        open={createFolder}
        onClose={onCloseCreateFolder}
        onCreated={onFolderCreated}
      />
    </>
  );
}

