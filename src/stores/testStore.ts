import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * 아래 코드는 예시 코드니까 해당 타입 및 코드 형식을 참고해서 사용하면 됩니다.
 * +) immer 미들웨어를 사용하면 보다 쉽게 상태를 업데이트할 수 있으나 불편하시면 안쓰셔도 무방합니다.
 */

type State = {
  firstName: string;
  lastName: string;
};

type Action = {
  updateFirstName: (firstName: State['firstName']) => void;
  updateLastName: (lastName: State['lastName']) => void;
};

const INITIAL_STATE: State = {
  firstName: '',
  lastName: '',
} as const;

// 기본
const usePersonStore = create<State & Action>((set) => ({
  ...INITIAL_STATE,
  updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
  updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}));
type UsePersonStoreType = typeof usePersonStore;

// Immer 사용 시 아래와 같이 사용
const usePersonStoreWithImmer = create<State & Action>()(
  immer((set) => ({
    ...INITIAL_STATE,
    updateFirstName: (firstName) =>
      set((state) => {
        state.firstName = firstName;
      }),
    updateLastName: (lastName) =>
      set((state) => {
        state.lastName = lastName;
      }),
  }))
);
type UsePersonStoreWithImmerType = typeof usePersonStoreWithImmer;
