import { create } from "zustand"

type State = {
    username: string
    setUsername: (username: string) => void
}

export const useUsername = create<State>((set) => ({
    username: "",
    setUsername: (username: string) => set({ username })
}))