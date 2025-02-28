import { Loader } from "lucide-react";

const LoadingSpinner = ({ className }) => {

    return <Loader className={`animate-spin w-6 h-6 ${className || "text-gray-500"}`} />;
};

export default LoadingSpinner;
