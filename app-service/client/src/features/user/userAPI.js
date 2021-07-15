import { resolveOnChange } from "antd/lib/input/Input";
import api from "../../helpers/api";

export async function login({ email, password }) {
    try {
        const response = await api.post("/users/login", { email, password });
        if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
      } catch (err) {
        throw new Error(err);
      }
  }

  export async function signup({name, email, password }) {
    //   return new Promise((resolve, reject) => {
    //     try {
    //         const response = await api.post("/users/register", { name, email, password });
    //         resolve(response);
    //       } catch (err) {
    //        reject(err)
    //       }
    //   })

  }