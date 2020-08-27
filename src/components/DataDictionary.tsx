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

import React, { PureComponent, useState, useEffect, useContext } from "react";
import {
  Chip,
  Flex,
  FlexItem,
  Heading,
  Spinner,
  theme,
  Icon,
} from "@looker/components";
import humanize from 'humanize-string'
import styled, { ThemeProvider } from "styled-components";
import { useAllModels } from "../utils/fetchers";
import "./styles.css";
import { PanelFields } from "./PanelFields";
import SidebarToggle from "./SidebarToggle";
import { useCurrentModel, useCurrentExplore } from "../utils/routes"
import { ColumnDescriptor, FieldComments } from "./interfaces";
import { SQLSnippet } from "./SQLSnippet";
import { Sidebar } from './Sidebar'
import { CommentIcon } from './CommentIcon'
import { SidebarStyleProps } from "./interfaces";
import { NoModelsAvailable } from "./NoModelsAvailable";
import { ILookmlModelExploreField, IUser } from "@looker/sdk";
import { CategorizedLabel } from './CategorizedLabel'
import { getAuthorIds, getMyUser, loadUsers } from "../utils/fetchers";
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import * as semver from 'semver'

export const columns: ColumnDescriptor[] = [
  {
    name: 'comment-icon',
    label: ' ',
    rowValueDescriptor: 'comment',
    formatter: (x: any, isRow: boolean, field: ILookmlModelExploreField, commentCount: number) => {
      if (isRow) {
        return <CommentIcon count={commentCount}/>
      } else {
        return null
      }
    },
    maxWidth: '4em',
    default: true,
  },
  {
    name: 'field-label',
    label: 'Field Label',
    rowValueDescriptor: 'label_short',
    formatter: (x: any, isRow: boolean, field: ILookmlModelExploreField) => {
      if (field.field_group_label && field.field_group_variant) {
        return `${field.field_group_label} ${field.field_group_variant}`  
      } else {
        return x
      }
    },
    minWidth: '6em',
    default: true,
  },
  {
    name: 'category',
    label: 'Category',
    rowValueDescriptor: 'category',
    formatter: (x: any, isRow: boolean, field: ILookmlModelExploreField) => {
      return <CategorizedLabel label={x} category={field.category} />
    },
    minWidth: '12em',
    default: false,
  },
  {
    name: 'description',
    label: 'Description',
    rowValueDescriptor: 'description',
    formatter: (x: any, isRow: boolean) => {
      if (x && isRow && x.length > 200) {
        return x.substring(0, 200) + '...'
      }
      return x
    },
    maxWidth: '20em',
    default: true,
  },
  {
    name: 'lookml-name',
    label: 'LookML Name',
    rowValueDescriptor: 'name',
    formatter: (x: any) => {
      return x.replace(/\./g, '.\u200B');
    },
    minWidth: '6em',
    default: true,
  },
  {
    name: 'type',
    label: 'Type',
    rowValueDescriptor: 'type',
    formatter: (x: any) => humanize(x),
    minWidth: '6em',
    default: true,
  },
  {
    label: 'SQL',
    rowValueDescriptor: 'sql',
    formatter: (x: any, isRow: boolean) => {
      return (<SQLSnippet isRow={isRow} src={x} />)
    },
    maxWidth: '20em',
    name: 'sql',
    default: true,
  },
  {
    name: 'tags',
    label: 'Tags',
    rowValueDescriptor: 'tags',
    formatter: (tags: any) => {
      return tags.map((tag: string) => (
        <Chip disabled>{tag}</Chip>
      ))
    },
    default: false,
  },
]

export const DataDictionary: React.FC<{}> = () => {
  const unfilteredModels = useAllModels()
  const currentModel = useCurrentModel()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const { currentExplore, loadingExplore } = useCurrentExplore()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK, initializeError } = extensionContext
  const [canPersistContextData, setCanPersistContextData] = useState<boolean>(false)
  const { coreSDK } = useContext(ExtensionContext)
  const [contextCopy, setContextCopy] = React.useState("{}")
  const [authors, setAuthors] = React.useState<IUser[]>([])
  const [comments, setComments] = React.useState("{}")
  const [me, setMe] = React.useState<IUser>()


  const addComment = async (newCommentStr: string, field: string): Promise<boolean> => {
    let revivedComments = JSON.parse(contextCopy)
    let newComment = JSON.parse(newCommentStr)
    
    if (revivedComments[currentExplore.name][field]) {
      let revivedFields = revivedComments[currentExplore.name][field]
      revivedFields.push(newComment)
      // revivedComments[currentExplore.name][field] = revivedFields
    } else {
      revivedComments[currentExplore.name][field] = [newComment]
    }

    if (canPersistContextData) {
      try {
        setComments(JSON.stringify(revivedComments))
        setContextCopy(JSON.stringify(revivedComments))
        await extensionSDK.saveContextData(JSON.stringify(revivedComments))
        return true
      } catch (error) {
        console.log(error)
      }
    }
    return false
  }

  const editComment = async (modCommentStr: string, field: string): Promise<boolean> => {
    let revivedComments = JSON.parse(contextCopy)
    let modComment = JSON.parse(modCommentStr)

    let newFieldComments = revivedComments[currentExplore.name][field].filter((d: FieldComments) => {
      return d.pk !== modComment.pk
    })
    newFieldComments.push(modComment)
    revivedComments[currentExplore.name][field] = newFieldComments

    if (canPersistContextData) {
      try {
        setComments(JSON.stringify(revivedComments))
        setContextCopy(JSON.stringify(revivedComments))
        await extensionSDK.saveContextData(JSON.stringify(revivedComments))
        return true
      } catch (error) {
        console.log(error)
      }
    }
    return false
  }

  const deleteComment = async (delCommentStr: string, field: string): Promise<boolean> => {
    let revivedComments = JSON.parse(contextCopy)
    let delComment = JSON.parse(delCommentStr)

    let newFieldComments = revivedComments[currentExplore.name][field].filter((d: any) => {
      return d.pk !== delComment.pk
    })
    revivedComments[currentExplore.name][field] = newFieldComments

    if (canPersistContextData) {
      try {
        setComments(JSON.stringify(revivedComments))
        setContextCopy(JSON.stringify(revivedComments))
        await extensionSDK.saveContextData(JSON.stringify(revivedComments))
        return true
      } catch (error) {
        console.log(error)
      }
    }
    return false
  }
  
  useEffect(() => {
    const initialize = async () => {
      // Context requires Looker version 7.14.0. If not supported provide
      // default configuration object and disable saving of context data.
      let context
      if (
        semver.intersects(
          '>=7.14.0',
          extensionSDK.lookerHostData?.lookerVersion || '7.0.0',
          true
        )
      ) {
        try {
          context = await extensionSDK.getContextData()
          setCanPersistContextData(true)
          setContextCopy(context)
          let authorIds = getAuthorIds(context)
          let contextObj = JSON.parse(context)
          currentExplore && contextObj[currentExplore.name] ? null : contextObj[currentExplore.name] = {}
          setContextCopy(JSON.stringify(contextObj))
          setComments(JSON.stringify(contextObj))
          setAuthors(await loadUsers(coreSDK, authorIds))
          setMe(await getMyUser(coreSDK))
        } catch (error) {
          console.error(error)
        }
      }
    }
    initialize()
  }, [currentExplore])

  let models

  if (unfilteredModels) {
    models = unfilteredModels.filter(m => m.explores && m.explores.some(e => !e.hidden))
    if (!models.length) {
      return <NoModelsAvailable />
    }
  }

  if (!models) {
    return <Flex alignItems="center" height="100%" justifyContent="center"><Spinner /></Flex>
  }

  const toggleFn = () => setSidebarOpen(!sidebarOpen);

  return (
    <ThemeProvider theme={theme}>
      <div style={{minWidth: "1200px"}}>
        <PageHeader>
          <FlexItem>
            <Heading as="h1" fontSize="xlarge" fontWeight="semiBold" mb="xsmall">
              Data Dictionary
            </Heading>
          </FlexItem>
        </PageHeader>
        <PageLayout open={sidebarOpen}>
          <LayoutSidebar>
            {sidebarOpen && <Sidebar
              currentExplore={currentExplore}
              currentModel={currentModel}
              loadingExplore={loadingExplore}
              models={models}
              search={search}
              setSearch={setSearch}
            />}
          </LayoutSidebar>
          <SidebarDivider open={sidebarOpen}>
            <SidebarToggle
              isOpen={sidebarOpen}
              onClick={toggleFn}
              headerHeight="114px"
            />
          </SidebarDivider>
          <PageContent>
            <PanelFields
              columns={columns}
              currentExplore={currentExplore}
              currentModel={currentModel}
              loadingExplore={loadingExplore}
              model={currentModel}
              comments={comments}
              addComment={addComment}
              editComment={editComment}
              deleteComment={deleteComment}
              authors={authors}
              me={me}
            />
          </PageContent>
        </PageLayout>
      </div>
    </ThemeProvider>
  );
}

// @ts-ignore
const PageHeader = styled(Flex)`
  background-color: ${theme.colors.palette.purple400};
  background-position: 100% 0;
  background-repeat: no-repeat;
  background-size: 836px 120px;
  padding: ${theme.space.large};
  background-image: url('https://berlin-test-2.s3-us-west-1.amazonaws.com/spirals.png');

  h1 {
    color: ${theme.colors.palette.white};
  }
`;

// @ts-ignore
const PageLayout = styled.div<SidebarStyleProps>`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: ${({ open }) =>
    open ? "16.625rem 0 1fr" : "1.5rem 0 1fr"};
  grid-template-areas: "sidebar divider main";
  position: relative;
`;

// @ts-ignore
const PageContent = styled.div`
  grid-area: main;
  position: relative;
`;

// @ts-ignore
const LayoutSidebar = styled.aside`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16.625rem;
  grid-area: sidebar;
  z-index: 0;
`;

// @ts-ignore
const SidebarDivider = styled.div<SidebarStyleProps>`
  transition: border 0.3s;
  border-left: 1px solid
    ${({ theme, open }) =>
      open ? theme.colors.palette.charcoal200 : "transparent"};
  grid-area: divider;
  overflow: visible;
  position: relative;
  &:hover {
    border-left: 1px solid
      ${({ theme, open }) =>
        open
          ? theme.colors.palette.charcoal300
          : theme.colors.palette.charcoal200};
  }
`;
