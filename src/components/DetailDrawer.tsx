/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import React from "react";
import {
  theme,
  AvatarIcon,
  ButtonOutline,
  ButtonTransparent,
  Card,
  CardContent,
  DrawerManager,
  Flex,
  FlexItem,
  Heading,
  ModalContent,
  Paragraph,
  Table,
  TableRow,
  TableDataCell,
  TableBody,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Text,
} from "@looker/components";
import styled from "styled-components";

import {ILookmlModel, ILookmlModelExplore, ILookmlModelExploreField, IUser } from "@looker/sdk";
import {ColumnDescriptor, FieldComments, ExploreComments} from "./interfaces";
import { getAuthorData, getMe, getAuthorIds, getExploreComments } from "../utils/fetchers";
import { ExternalLink } from "./ExternalLink";
import { exploreFieldURL } from "../utils/urls";
import { canGetDistribution, canGetTopValues } from "../utils/queries";
import { QueryChart } from './QueryChart'
import { DetailDrawerRow } from "./DetailDrawerRow";
import { FieldMetadata } from "./FieldMetadata";


// Page Header
const TableRowCustom = styled(TableRow)`
  transition: background-color 0.3s ease;
  &.active,
  &:hover {
    background-color: ${theme.colors.palette.charcoal100};
  }

  .disabled{
    visibility: hidden;
  }

  &:hover .disabled{
    visibility: visible;
  }

  td {
    word-break: break-word;
  }
  cursor: pointer;
`;

const DETAILS_PANE = 0;
const COMMENTS_PANE = 1;

export const DetailDrawer: React.FC<{
  columns: ColumnDescriptor[],
  explore: ILookmlModelExplore,
  model: ILookmlModel,
  field: ILookmlModelExploreField,
  shownColumns: string[],
  tab: number,
  setTab: (i: number) => void,
  comments: ExploreComments,
  updateComments: (i: string) => void,
  commentAuthors: IUser[],
  me: IUser,
}> = ({ columns, 
        explore, 
        field, 
        model, 
        shownColumns, 
        tab, 
        setTab,
        comments,
        updateComments,
        commentAuthors,
        me
  }) => {
  function detailsPane() {
    setTab(DETAILS_PANE);
  }
  function commentsPane() {
    setTab(COMMENTS_PANE);
  }

  return (
    <DrawerManager
      content={
        <FieldMetadata
          field={field}
          columns={columns}
          explore={explore}
          key={field.name}
          model={model}
          shownColumns={shownColumns}
          tab={tab}
          setTab={setTab}
          allComments={comments}
          setComments={updateComments}
          commentAuthors={commentAuthors}
          me={me}
        />
      }
    >
      {onClick => (
        <TableRowCustom onClick={onClick}>
          { columns.map(column => {
            if (shownColumns.includes(column.rowValueDescriptor)) {
              return (
                <TableDataCell
                  color="palette.charcoal700"
                  p="medium"
                  pl="small"
                  key={column.rowValueDescriptor}
                  maxWidth={column.maxWidth}
                  minWidth={column.minWidth}
                  onClick={column.rowValueDescriptor === "comment" ? commentsPane : detailsPane}
                >
                  {/* 
                  // @ts-ignore */}
                  { column.formatter(field[column.rowValueDescriptor], true, field, comments[field.name] && comments[field.name].length > 0 ? comments[field.name].length : null) }
                </TableDataCell>
              )
            }
          })}
        </TableRowCustom>
      )}
    </DrawerManager>
  );
};
