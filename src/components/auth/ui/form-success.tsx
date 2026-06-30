import { CheckCircle2 } from 'lucide-react'

interface FormSuccessProps {
    message?: string
}

const FormSuccess = ({ message }: FormSuccessProps) => {
    if (!message) {
        return null
    }
    return (
        <div>
            {message && (
                <p className="bg-green-200 px-4 py-3 rounded-md flex items-center gap-x-2 text-small text-green-700">
                    <CheckCircle2 className="inline-block mr-1" />
                    {message}
                </p>
            )}
        </div>
    )
}

export default FormSuccess
