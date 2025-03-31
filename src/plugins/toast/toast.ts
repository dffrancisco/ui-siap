import { useToast } from "vue-toastification";
import type { ToastOptions } from "vue-toastification/dist/types/types";

const init = useToast()

const toast = {
    success: (message: string, options?: ToastOptions) => {
        //@ts-ignore
        init.success(message, options)
    },
    error: (message: string, options?: ToastOptions) => {
        //@ts-ignore
        init.error(message, options)
    },
    warning: (message: string, options?: ToastOptions) => {
        //@ts-ignore
        init.warning(message, options)
    },
}

export default toast