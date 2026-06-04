// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import {
  Box,
  ButtonGroup,
  ButtonItem,
  Flex,
  FlexItem,
  Heading,
  theme,
} from '@looker/components'
import styled from 'styled-components'

export const Main = styled(Box as any)`
  border-radius: 0.25rem;
  min-height: 1.2em;
  padding 0.2em;
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -ms-user-select: none;
`

export const FilterHeading = styled(Heading as any)`
  margin-bottom: 0.4em;
  color: ${theme.colors.text1};
`

export const Group = styled(FlexItem as any)`
  margin-right: 1.2em;
`

export const QuickSearch: React.FC<{
  selectedFields: string[]
  fields: string[]
  fieldTypes: string[]
  hasDescription: string[]
  hasTags: string[]
  hasComments: string[]
  setSelectedFields: (fields: string[]) => void
  setFieldTypes: (fieldTypes: string[]) => void
  setHasDescription: (hasDescription: string[]) => void
  setHasTags: (hasTags: string[]) => void
  setHasComments: (hasTags: string[]) => void
  showComments: boolean
}> = ({
  selectedFields,
  fields,
  fieldTypes,
  hasDescription,
  hasTags,
  hasComments,
  setSelectedFields,
  setFieldTypes,
  setHasDescription,
  setHasTags,
  setHasComments,
  showComments,
}) => {
  return (
    <Main>
      <Flex
        flexDirection="row"
        flexWrap="wrap"
        mt="xlarge"
        pl="xxlarge"
        pr="xxlarge"
      >
        <Group>
          <FilterHeading as="h6">Has Description</FilterHeading>
          <ButtonGroup value={hasDescription} onChange={setHasDescription}>
            <ButtonItem value={'yes'}>Yes</ButtonItem>
            <ButtonItem value={'no'}>No</ButtonItem>
          </ButtonGroup>
        </Group>

        <Group>
          <FilterHeading as="h6">Fields</FilterHeading>
          <ButtonGroup value={fieldTypes} onChange={setFieldTypes}>
            <ButtonItem value="dimensions">Dimension</ButtonItem>
            <ButtonItem value="measures">Measure</ButtonItem>
          </ButtonGroup>
        </Group>

        <Group>
          <FilterHeading as="h6">Has Tags</FilterHeading>
          <ButtonGroup value={hasTags} onChange={setHasTags}>
            <ButtonItem value="yes">Yes</ButtonItem>
            <ButtonItem value="no">No</ButtonItem>
          </ButtonGroup>
        </Group>

        {showComments && (
          <Group>
            <FilterHeading as="h6">Has Comments</FilterHeading>
            <ButtonGroup value={hasComments} onChange={setHasComments}>
              <ButtonItem value="yes">Yes</ButtonItem>
              <ButtonItem value="no">No</ButtonItem>
            </ButtonGroup>
          </Group>
        )}

        <Group>
          <FilterHeading as="h6">Type</FilterHeading>
          <ButtonGroup value={selectedFields} onChange={setSelectedFields}>
            {fields.map((field) => {
              return (
                <ButtonItem key={field} value={field}>
                  {field}
                </ButtonItem>
              )
            })}
          </ButtonGroup>
        </Group>
      </Flex>
    </Main>
  )
}
