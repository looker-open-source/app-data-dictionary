// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import type { ILookmlModelExplore, ILookmlModelExploreField } from '@looker/sdk'

export function exploreURL(explore: ILookmlModelExplore) {
  return `/explore/${encodeURIComponent(
    explore.model_name
  )}/${encodeURIComponent(explore.name)}`
}

export function exploreFieldURL(
  explore: ILookmlModelExplore,
  field: ILookmlModelExploreField
) {
  return `${exploreURL(explore)}?fields=${encodeURIComponent(field.name)}`
}
