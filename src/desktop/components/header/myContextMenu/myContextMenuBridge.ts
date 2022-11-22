/*
    Path + Filename: src/desktop/components/header/myContextMenu/myContextMenuBridge.tsx
*/

import { createBridge } from 'react-context-menu-hooks';

export interface MyContextMenuTriggerData {
}

export const myContextMenuBridge = createBridge<MyContextMenuTriggerData>({
});