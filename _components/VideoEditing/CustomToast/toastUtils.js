import toast from "react-hot-toast";
import CustomToast from "@/app/_components/VideoEditing/CustomToast/CustomToast";

const showErrorToast = (message) => {
  toast.custom(
    (t) => <CustomToast message={message} onClose={() => toast.remove(t.id)} />,
    { duration: Infinity }
  );
  console.error(message);
};

export default showErrorToast;
