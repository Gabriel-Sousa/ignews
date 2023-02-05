import axios from "axios";

export const api = axios.create({
  baseURL: "/api"
})


// O axios está aproveitando a url da aplicação, então não precisa colocar http://localhost:3000/api