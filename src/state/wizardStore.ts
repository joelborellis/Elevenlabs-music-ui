import { create } from 'zustand';
import type {
  WizardState,
  WizardActions,
  WizardStep,
  ProjectBlueprint,
  SoundProfile,
  DeliveryAndControl,
  AudioResult,
  EditorMode,
  CompositionPlanData
} from '@/types';

const initialState: WizardState = {
  currentStep: 0,
  userNarrative: '',
  selections: {
    project_blueprint: null,
    sound_profile: null,
    delivery_and_control: null,
    instrumental_only: false,
  },
  promptText: '',
  compositionPlanText: '',
  compositionPlanObject: null,
  planJsonError: null,
  editorMode: 'visual',
  audioResult: null,
  isGeneratingPrompt: false,
  isGeneratingPlan: false,
  isCreatingMusic: false,
};

export const useWizardStore = create<WizardState & WizardActions>((set, get) => ({
  ...initialState,

  // Navigation
  setStep: (step: WizardStep) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 3) {
      set({ currentStep: (currentStep + 1) as WizardStep });
    }
  },
  
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: (currentStep - 1) as WizardStep });
    }
  },
  
  reset: () => set(initialState),

  // Step 0 actions
  setUserNarrative: (text: string) => set({ userNarrative: text }),

  // Step 1 actions
  setProjectBlueprint: (value: ProjectBlueprint | null) => 
    set((state) => ({ 
      selections: { ...state.selections, project_blueprint: value } 
    })),
    
  setSoundProfile: (value: SoundProfile | null) => 
    set((state) => ({ 
      selections: { ...state.selections, sound_profile: value } 
    })),
    
  setDeliveryAndControl: (value: DeliveryAndControl | null) => 
    set((state) => ({ 
      selections: { ...state.selections, delivery_and_control: value } 
    })),
    
  setInstrumentalOnly: (value: boolean) => 
    set((state) => ({ 
      selections: { ...state.selections, instrumental_only: value } 
    })),

  // Step 2 actions
  setPromptText: (text: string) => set({ promptText: text }),
  
  setCompositionPlanText: (text: string) => set({ compositionPlanText: text }),
  
  validateAndSetPlan: (text: string) => {
    try {
      const parsed = JSON.parse(text);
      set({
        compositionPlanText: text,
        compositionPlanObject: parsed,
        planJsonError: null
      });
      return true;
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Invalid JSON';
      set({
        compositionPlanText: text,
        compositionPlanObject: null,
        planJsonError: error
      });
      return false;
    }
  },

  updatePlanObject: (updater: (plan: CompositionPlanData) => CompositionPlanData) => {
    const { compositionPlanObject } = get();
    if (!compositionPlanObject) return;

    try {
      const updated = updater(compositionPlanObject as CompositionPlanData);
      const text = JSON.stringify(updated, null, 2);
      set({
        compositionPlanObject: updated,
        compositionPlanText: text,
        planJsonError: null
      });
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Failed to update plan';
      set({ planJsonError: error });
    }
  },

  setEditorMode: (mode: EditorMode) => set({ editorMode: mode }),

  // Results
  setAudioResult: (result: AudioResult | null) => set({ audioResult: result }),

  // Loading states
  setIsGeneratingPrompt: (value: boolean) => set({ isGeneratingPrompt: value }),
  setIsGeneratingPlan: (value: boolean) => set({ isGeneratingPlan: value }),
  setIsCreatingMusic: (value: boolean) => set({ isCreatingMusic: value }),
}));

// Selector helpers
export const useSelectionsComplete = () => 
  useWizardStore((state) => 
    state.selections.project_blueprint !== null &&
    state.selections.sound_profile !== null &&
    state.selections.delivery_and_control !== null
  );

export const usePlanValid = () =>
  useWizardStore((state) => 
    state.compositionPlanObject !== null && 
    state.planJsonError === null
  );
