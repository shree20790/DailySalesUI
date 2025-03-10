import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

class AlertService {
    static success(message) {
        MySwal.fire({
            title: message,
            icon: "success",
            iconColor:"#f7f9f8",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            width: 500,
            showCloseButton: true,
            background: "#44ca5a",
        });
    }

    static error(message) {
        MySwal.fire({
            title: message,
            icon: "error",
            iconColor:"#f7f9f8",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            width: 500,
            showCloseButton: true,
            background: "#e46b6b",
            customClass: {
                popup: `color-danger`,
            }
        });
    }

    static warning(message) {
        MySwal.fire({
            title: message,
            icon: "warning",
            iconColor:"#f7f9f8",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            width: 500,
            showCloseButton: true,
            background: "#f88b42",
        });
    }

    static info(message) {
        MySwal.fire({
            title: message,
            icon: "info",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            width: 500,
            showCloseButton: true,
        });
    }
    

    static confirm({ message, confirmButtonText = "OK", cancelButtonText = "Cancel" }) {
        return MySwal.fire({
            title: message,
            icon: "warning",
            iconColor: "#e75858",
            confirmButtonColor: "#d33",
            showCancelButton: true,
            cancelButtonColor: "#3085d6",
            confirmButtonText,
            cancelButtonText,
            allowOutsideClick: false,
        });
    }
    
}

export default AlertService;
