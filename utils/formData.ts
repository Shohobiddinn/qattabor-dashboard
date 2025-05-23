
// /**
//  * Ma'lumotlardan FormData obyektini hosil qiladi.
//  * @param data - Kalit-qiymat juftliklar ko‘rinishidagi obyekt
//  * @returns FormData obyekt
//  */
// export function formData(data: Record<any, any>): FormData {
//   const formData = new FormData();

//   Object.entries(data).forEach(([key, value]) => {
//     if (Array.isArray(value)) {
//       // Agar qiymat array bo‘lsa, har bir elementni qo‘shamiz
//       value.forEach((item, index) => {
//         formData.append(`${key}[${index}]`, item instanceof File ? item : String(item));
//       });
//     } else if (value instanceof File) {
//       formData.append(key, value);
//     } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
//       formData.append(key, String(value)); // string yoki number bo‘lsa, to‘g‘ri formatda qo‘shish
//     } else if (value !== null && typeof value === 'object') {
//       formData.append(key, JSON.stringify(value)); // object bo‘lsa, JSON stringi sifatida qo‘shamiz
//     }
//   });

//   return formData;
// }


export function formData(data: Record<any, any> | any[]): FormData {
  const formData = new FormData();

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        const formKey = `${index}.${key}`;
        if (Array.isArray(value)) {
          value.forEach((el, i) => {
            formData.append(`${formKey}[${i}]`, el instanceof File ? el : String(el));
          });
        } else if (value instanceof File) {
          formData.append(formKey, value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          formData.append(formKey, String(value));
        } else if (value !== null && typeof value === 'object') {
          formData.append(formKey, JSON.stringify(value));
        }
      });
    });
  } else {
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item instanceof File ? item : String(item));
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        formData.append(key, String(value));
      } else if (value !== null && typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      }
    });
  }

  return formData;
}
