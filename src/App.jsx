
import './App.css'
import { Routes, Route } from "react-router-dom";

import Layouts from "./components/Layouts";

import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Profile from "./features/users/Profile";

import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import "./App.css";
import NavInicio from "./features/fields/NavInicio";
import NavProximas from "./features/fields/NavProximas";
import MiPerfil from "./features/fields/MiPerfil";
import UserList from "./features/fields/UserList";
import PswdChange from "./features/fields/PswdChange";
import NuevoUsuario from "./features/fields/NuevoUsuario";
import InfoUser from "./features/fields/InfoUser";
import NuevoCultivo from "./features/fields/NuevoCultivo";
import EditarCampos from "./features/fields/EditarCampos";
import ActInformacion from "./features/fields/ActInformacion"
import NavCultivos from "./features/fields/NavCultivos";
import NavCampos from "./features/fields/NavCampos";
import EditUsuario  from "./features/fields/EditUsuario";
import RegistrarPlantilla from "./features/fields/RegistrarPlantilla"
import RegistrarActividad from "./features/fields/RegistrarActvidad";
import ItemSection from "./features/fields/ItemSection";




function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route path="dash" element={<DashLayout />}>
              <Route path="perfil">
                <Route index element={<Profile />} />
                {/*<Route path="users" element={<Users />} />*/}
                
              </Route>
              {/*lo agregado aqui en adelante es de fran*/}
              <Route index element={<NavInicio />} />
              <Route path="proximas" element={<NavProximas />} />
              <Route path="cultivos">
                <Route index element={<NavCultivos />} />
                <Route path="nuevo-cultivo" element={<NuevoCultivo />} />
                <Route path="registrar-plantilla" element={<RegistrarPlantilla />} /> 
                <Route path="registrar-actividad" element={<RegistrarActividad /> } />
                <Route path="item-section" element={<ItemSection />} />
              </Route>
              <Route path="campos">
                <Route index element={<NavCampos />}/>
                <Route path="editar-campos" element={<EditarCampos />} />
              </Route>
              <Route path="usuario">
                <Route path="mi-perfil">
                  <Route index element={<MiPerfil />} />
                  <Route path="act-info/:id" element={<ActInformacion />} />
                  <Route path="pswd-change" element={<PswdChange />} />
                </Route>
                <Route path="lista-usuarios">
                  <Route index element={<UserList />} />
                  <Route path="nuevo-usuario" element={<NuevoUsuario />} />
                  <Route path="editar-usuario" element={<EditUsuario />} />
                  <Route path="info-user" element={<InfoUser />} />
                </Route>
              </Route>
              {/*lo agregado aqui en adelante es de fran*/}
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
