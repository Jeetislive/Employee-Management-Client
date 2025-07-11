import { Bounce, ToastContainer } from "react-toastify";
import React from "react";

const ToastInit = () => {
  return React.createElement(ToastContainer, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: false,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "light",
    transition: Bounce,
  });
};

export default ToastInit;