import { create } from 'zustand';
import { Trip, Station, Train, Disruption } from '../types';

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTripId: string | null;
  setSelectedTripId: (id: string | null) => void;
  selectedStationId: string | null;
  setSelectedStationId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedTripId: null,
  setSelectedTripId: (id) => set({ selectedTripId: id }),
  selectedStationId: null,
  setSelectedStationId: (id) => set({ selectedStationId: id }),
}));
