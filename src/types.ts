export type UnitSelectType = 'default' | 'grid' | 'flex' | 'size' | 'auto'

export type DefaultUnit = 'px' | '%' | 'em'

export type GridUnit = DefaultUnit | 'fr' | 'auto' | 'min-content' | 'max-content' | 'minmax'

export type Initial = 'initial'

export type GlobalPropierties = Initial | 'inherit' | 'unset'

export type UniversalUnits = GridUnit | Initial

export type BasicProperties = 'center' | 'start' | 'end' | 'stretch' | Initial

export type ContentProperties = BasicProperties | 'around' | 'between' | 'evenly'

export type Cell = 'col' | 'row'

export type AreaType = 'width' | 'height'

export type AlignOptionsType = 'content' | 'items' | 'self'
export interface LineName {
  active: boolean
  name: string
}

export interface UnitsInterface {
  flex: DefaultUnit[]
  grid: GridUnit[]
  default: DefaultUnit[]
  size: UniversalUnits[]
  auto: UniversalUnits[]
}

export interface GridDimension {
  sizes: string[]
  auto?: any
  lineNames: LineName[]
  gap: string
}

export interface GridState {
  row: GridDimension
  col: GridDimension
  autoFlow: string
  justifyContent: ContentProperties
  alignContent: ContentProperties
  justifyItems: BasicProperties
  alignItems: BasicProperties
}

export interface ValueUnit {
  value: string | number
  unit: UniversalUnits
}

export interface ValueGapUnit extends Omit<ValueUnit, 'unit'> {
  unit: DefaultUnit
}

export * from './types/area'
export * from './types/constans'
