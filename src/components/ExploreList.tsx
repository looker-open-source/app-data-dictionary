// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import React from 'react'
import { FlexItem, List, ListItem, theme } from '@looker/components'
import './styles.css'
import { useHistory } from 'react-router'
import type { ILookmlModelExplore } from '@looker/sdk'
import { internalExploreURL, useCurrentModel } from '../utils/routes'

const isActive = (
  currentExplore: ILookmlModelExplore,
  listExplore: ILookmlModelExplore,
  loadingExplore: string
) => {
  if (
    !loadingExplore &&
    currentExplore &&
    listExplore.name === currentExplore.name
  ) {
    return 'active'
  } else if (loadingExplore && listExplore.name === loadingExplore) {
    return 'active'
  } else {
    return null
  }
}

export const ExploreList: React.FC<{
  currentExplore: ILookmlModelExplore
  search: string
  loadingExplore: string
}> = ({ currentExplore, loadingExplore, search }) => {
  const currentModel = useCurrentModel()
  const history = useHistory()
  return (
    <FlexItem pt="xlarge" ml="xsmall">
      <List density={0} color={theme.colors.key}>
        {currentModel &&
          currentModel.explores &&
          currentModel.explores.map((explore: any) => {
            if (
              !explore.hidden &&
              (!search ||
                explore.label.toLowerCase().includes(search.toLowerCase()))
            ) {
              return (
                <ListItem
                  key={explore.name}
                  truncate={true}
                  onClick={() => {
                    history.push(
                      internalExploreURL({
                        model: currentModel.name || '',
                        explore: explore.name,
                      })
                    )
                  }}
                  selected={isActive(currentExplore, explore, loadingExplore)}
                >
                  {explore.label}
                </ListItem>
              )
            }
            return undefined
          })}
      </List>
    </FlexItem>
  )
}
