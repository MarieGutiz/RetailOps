// Form error display

const FormError = ({ message }: { message: string }) => {
  console.log('FormError message:', message); // Debug log
  return <div className="text-red-500 text-sm mt-1">{message}</div>;
};

export default FormError;
