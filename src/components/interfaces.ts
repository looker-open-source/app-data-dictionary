// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import type { ILookmlModelExploreField } from '@looker/sdk'

export interface ColumnDescriptor {
  name: string
  label: string
  rowValueDescriptor: string
  Formatter: React.ComponentType<FormatterProps>
  minWidth?: string
  maxWidth?: string
  default?: boolean
}

export interface FormatterProps {
  x: string
  isRow?: boolean
  field?: ILookmlModelExploreField
  commentCount?: number
  canComment?: boolean
  reader?: boolean
  tags?: string[]
}

export interface SidebarStyleProps {
  open: boolean
}

export interface FieldComments {
  author: number | string
  timestamp: number
  content: string
  edited: boolean
  pk: string
  deleted?: boolean
}

export interface ExploreComments {
  [field_name: string]: FieldComments[]
}

export interface UserData {
  display_name: string
  avatar_url: string
  first_name: string
  last_name: string
  color?: string
}

export interface AllComments {
  [explore_name: string]: ExploreComments
}

export interface CommentPermissions {
  disabled?: boolean
  reader?: boolean
  writer?: boolean
  manager?: boolean
}
