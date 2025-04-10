import Swal, { type SweetAlertResult } from 'sweetalert2';
type warningType = 'success' | 'warning' | 'error';

export  function alertWarning(icon: warningType, title: string): Promise<SweetAlertResult> {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right', 
    showConfirmButton: false,
    timer: 1500, 
    timerProgressBar: true, 
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer); 
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon: icon, 
    title: title, 
  });
}
