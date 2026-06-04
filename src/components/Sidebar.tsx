// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import {
  FieldSelect,
  Flex,
  FlexItem,
  Heading,
  InputSearch,
  theme,
} from '@looker/components'
import { useHistory } from 'react-router'
import type { ILookmlModel, ILookmlModelExplore } from '@looker/sdk'
import './styles.css'
import { internalModelURL } from '../utils/routes'
import { ExploreList } from './ExploreList'

export const Sidebar: React.FC<{
  currentExplore: ILookmlModelExplore
  currentModel: ILookmlModel
  loadingExplore: string
  models: ILookmlModel[]
  search: string
  setSearch: (search: string) => void
}> = ({
  currentExplore,
  currentModel,
  loadingExplore,
  models,
  search,
  setSearch,
}) => {
  const history = useHistory()

  const onSelectModel = (selectedModel: string) => {
    if (selectedModel) {
      const url = internalModelURL({ model: selectedModel })
      history.push(url)
    }
  }

  return (
    <Flex flexDirection="column" pt="xxlarge" pb="xxlarge">
      <FlexItem
        borderBottom={`1px solid ${theme.colors.ui2}`}
        ml="large"
        mr="xlarge"
        pb="medium"
      >
        <FieldSelect
          name="select-model"
          label="Select a Model"
          options={models
            .map((m) => ({ value: m.name, label: m.label }))
            .sort((a, b) => (a.label < b.label ? -1 : 1))}
          onChange={onSelectModel}
          value={currentModel && currentModel.name}
        />
      </FlexItem>
      <FlexItem ml="large" mr="xlarge" pt="medium">
        <Heading as="h5" color="text" fontWeight="semiBold">
          Explores
        </Heading>
        <InputSearch
          hideSearchIcon
          placeholder="Search Model"
          mt="medium"
          onChange={setSearch}
          value={search}
        />
      </FlexItem>
      <ExploreList
        currentExplore={currentExplore}
        loadingExplore={loadingExplore}
        search={search}
      />
    </Flex>
  )
}
