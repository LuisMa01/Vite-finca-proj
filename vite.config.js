import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

//import dns from 'dns'

// https://vitejs.dev/config/

export default defineConfig({
  
  //server: {
    //host: "127.0.0.1",
      
 // },
  plugins: [react()],
});

/*
dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  server:{
    host: "127.0.0.1" 
  },
})
*/
