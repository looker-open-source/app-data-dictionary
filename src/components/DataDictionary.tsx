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

import React from 'react'
import {
  Chip,
  Flex,
  Heading,
  Spinner,
  ComponentsProvider,
  theme,
} from '@looker/components'
import humanize from 'humanize-string'
import styled from 'styled-components'
import { useAllModels, useComments } from '../utils/fetchers'
import './styles.css'
import { useCurrentModel, useCurrentExplore } from '../utils/routes'
import { PanelFields } from './PanelFields'
import SidebarToggle from './SidebarToggle'
import type {
  ColumnDescriptor,
  SidebarStyleProps,
  FormatterProps,
} from './interfaces'
import { SQLSnippet } from './SQLSnippet'
import { Sidebar } from './Sidebar'
import { CommentIcon } from './CommentIcon'

import { NoModelsAvailable } from './NoModelsAvailable'
import { CategorizedLabel } from './CategorizedLabel'

export const columns: ColumnDescriptor[] = [
  {
    name: 'comment-icon',
    label: ' ',
    rowValueDescriptor: 'comment',
    Formatter: function RenderCommentIcon({
      isRow,
      commentCount,
      canComment,
      reader,
    }: FormatterProps) {
      const showIcon = !reader || commentCount > 0
      if (canComment && isRow && showIcon) {
        return <CommentIcon count={commentCount} />
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
    Formatter: function RenderLabelShort({ x, field }: FormatterProps) {
      if (field.field_group_label && field.field_group_variant) {
        return <>{`${field.field_group_label} ${field.field_group_variant}`}</>
      } else {
        return <>{x}</>
      }
    },
    minWidth: '12em',
    default: true,
  },
  {
    name: 'category',
    label: 'Category',
    rowValueDescriptor: 'category',
    Formatter: function RenderCategoryLabel({ x, field }: FormatterProps) {
      return <CategorizedLabel label={x} category={field.category} />
    },
    minWidth: '10em',
    default: false,
  },
  {
    name: 'description',
    label: 'Description',
    rowValueDescriptor: 'description',
    Formatter: function RenderDescription({ x, isRow }: FormatterProps) {
      if (x && isRow && x.length > 200) {
        return <>{x.slice(0, 200) + '...'}</>
      }
      return <>{x}</>
    },
    minWidth: '10em',
    default: true,
  },
  {
    name: 'lookml-name',
    label: 'LookML Name',
    rowValueDescriptor: 'name',
    Formatter: function RenderLookmlName({ x }: FormatterProps) {
      return <>{x.replace(/\./g, '.\u200B')}</>
    },
    minWidth: '8em',
    default: true,
  },
  {
    name: 'type',
    label: 'Type',
    rowValueDescriptor: 'type',
    Formatter: function RenderType({ x }: FormatterProps) {
      return <>{humanize(x)}</>
    },
    minWidth: '8em',
    default: true,
  },
  {
    label: 'SQL',
    rowValueDescriptor: 'sql',
    Formatter: function RenderSqlSnippet({ x, isRow }: FormatterProps) {
      return <SQLSnippet isRow={isRow} src={x} />
    },
    minWidth: '10em',
    name: 'sql',
    default: true,
  },
  {
    name: 'tags',
    label: 'Tags',
    rowValueDescriptor: 'tags',
    Formatter: function RenderTags({ tags }: FormatterProps) {
      return (
        <>
          {tags &&
            tags.map((tag: string) => (
              <Chip disabled key={tag}>
                {tag}
              </Chip>
            ))}
        </>
      )
    },
    default: false,
  },
]

export const DataDictionary = () => {
  const unfilteredModels = useAllModels()
  const currentModel = useCurrentModel()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const { currentExplore, loadingExplore } = useCurrentExplore()
  const {
    comments,
    authors,
    me,
    permissions,
    addComment,
    editComment,
    deleteComment,
  } = useComments(currentExplore)

  let models

  if (unfilteredModels) {
    models = unfilteredModels.filter(
      (m) => m.explores && m.explores.some((e) => !e.hidden)
    )
    if (!models.length) {
      return <NoModelsAvailable />
    }
  }

  if (!models || !me) {
    return (
      <Flex alignItems="center" height="100vh" justifyContent="center">
        <Spinner />
      </Flex>
    )
  }

  const toggleFn = () => setSidebarOpen(!sidebarOpen)

  return (
    <ComponentsProvider>
      <div style={{ minWidth: '1200px' }}>
        <PageHeader>
          <Heading as="h1" fontSize="xlarge" fontWeight="semiBold">
            Data Dictionary
          </Heading>
        </PageHeader>
        <PageLayout open={sidebarOpen}>
          <LayoutSidebar>
            {sidebarOpen && (
              <Sidebar
                currentExplore={currentExplore}
                currentModel={currentModel}
                loadingExplore={loadingExplore}
                models={models}
                search={search}
                setSearch={setSearch}
              />
            )}
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
              comments={comments}
              addComment={addComment}
              editComment={editComment}
              deleteComment={deleteComment}
              authors={authors}
              me={me}
              permissions={permissions}
            />
          </PageContent>
        </PageLayout>
      </div>
    </ComponentsProvider>
  )
}

// TODO fix this hard coded color as part of theming overhaul.
//      This was originally Looker purple with a strange background image.
//      Removing image resulted in Looker purple which is odd so hard
//      coding to Google blue. Still not great but better than before.
const PageHeader = styled(Flex as any)`
  background-color: #1a73e8;
  padding: ${theme.space.large};
  h1 {
    color: ${theme.colors.keyText};
  }
`

const PageLayout = styled.div<SidebarStyleProps>`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: ${({ open }) =>
    open ? '16.625rem 0 1fr' : '1.5rem 0 1fr'};
  grid-template-areas: 'sidebar divider main';
  position: relative;
`

const PageContent = styled.div`
  grid-area: main;
  position: relative;
`

const LayoutSidebar = styled.aside`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16.625rem;
  grid-area: sidebar;
  z-index: 0;
`

const SidebarDivider = styled.div<SidebarStyleProps>`
  transition: border 0.3s;
  border-left: 1px solid
    ${({ theme, open }) => (open ? theme.colors.ui2 : 'transparent')};
  grid-area: divider;
  overflow: visible;
  position: relative;
  &:hover {
    border-left: 1px solid
      ${({ theme, open }) => (open ? theme.colors.ui2 : theme.colors.ui4)};
  }
`
