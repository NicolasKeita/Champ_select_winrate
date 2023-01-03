/*
    Path + Filename: src/desktop/utils/hooks/index.tsx
*/

import {AppDispatch, RootState} from '../../../background/store/store'
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector