"use client";

import { create } from "zustand";

interface UiState {
  isSearchOpen: boolean;
  isCartDrawerOpen: boolean;
  isAnnouncementVisible: boolean;
  gridColumns: 2 | 3;
  openSearch: () => void;
  closeSearch: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  dismissAnnouncement: () => void;
  setGridColumns: (columns: 2 | 3) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSearchOpen: false,
  isCartDrawerOpen: false,
  isAnnouncementVisible: true,
  gridColumns: 3,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  dismissAnnouncement: () => set({ isAnnouncementVisible: false }),
  setGridColumns: (gridColumns) => set({ gridColumns })
}));
