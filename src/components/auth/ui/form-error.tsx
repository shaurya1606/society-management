import { IconExclamationCircle } from '@tabler/icons-react'

interface FormErrorProps {
    message?: string
}

const FormError = ({ message }: FormErrorProps) => {
    if (!message) {
        return null
    }
    return (
        <div>
            {message && (
                <p className="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center gap-x-2 text-small">
                    <IconExclamationCircle className="inline-block mr-1" />
                    {message}
                </p>
            )}
        </div>
    )
}

export default FormError
