import "./App.css";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import { Routes, Route } from "react-router-dom";

import Layouts from "./components/Layouts";

import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";

import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";

import NavInicio from "./features/fields/NavInicio";
import NavProximas from "./features/fields/NavProximas";
import MiPerfil from "./features/fields/MiPerfil";
import UserList from "./features/fields/UserList";
import NuevoUsuario from "./features/fields/NuevoUsuario";
import NuevoCultivo from "./features/fields/NuevoCultivo";
import EditarCampos from "./features/fields/EditarCampos";
import NavCultivos from "./features/fields/NavCultivos";
import NavCampos from "./features/fields/NavCampos";
import RegistrarPlantilla from "./features/fields/RegistrarPlantilla";
import RegistrarActividad from "./features/fields/RegistrarActvidad";
import ItemSection from "./features/fields/ItemSection";
import RegistrarPlanta from "./features/fields/RegistrarPlanta";
import InfoCultivo from "./features/fields/InfoCultivo";
import InfoCultivoPdf from "./features/fields/InfoCultivoPdf";
import Report from "./features/fields/Report";
import InfoAppCult from "./features/fields/InfoAppCult";


function App() {
    return (
    <Routes>
      <Route path="/" element={<Layouts />}>
        <Route index element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                {/*lo agregado aqui en adelante es de fran*/}
                <Route index element={<NavInicio />} />
                <Route path="proximas" element={<NavProximas />} />
                <Route path="cultivos">
                  <Route index element={<NavCultivos />} />
                  <Route path="nuevo-cultivo" element={<NuevoCultivo />} />
                  <Route path="info-cultivo/:id" element={<InfoCultivo />} />
                  <Route
                    path="info-cultivo-pdf/:id"
                    element={<InfoCultivoPdf />}
                  />
                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.Administrador, ROLES.Supervisor]}
                      />
                    }
                  >
                    <Route path="info-app/:id" element={<InfoAppCult />} />
                  </Route>
                  <Route
                    path="registrar-plantilla"
                    element={<RegistrarPlantilla />}
                  />
                  <Route
                    path="registrar-planta"
                    element={<RegistrarPlanta />}
                  />
                  <Route
                    path="registrar-actividad"
                    element={<RegistrarActividad />}
                  />
                  <Route path="item-section" element={<ItemSection />} />
                </Route>
                <Route path="campos">
                  <Route index element={<NavCampos />} />
                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.Administrador, ROLES.Supervisor]}
                      />
                    }
                  >
                    <Route path="editar-campos" element={<EditarCampos />} />
                  </Route>
                </Route>
                <Route path="usuario">
                  <Route path="mi-perfil">
                    <Route index element={<MiPerfil />} />
                  </Route>

                  <Route
                    element={
                      <RequireAuth allowedRoles={[ROLES.Administrador]} />
                    }
                  >
                    <Route path="lista-usuarios">
                      <Route index element={<UserList />} />
                      <Route path="nuevo-usuario" element={<NuevoUsuario />} />
                    </Route>
                  </Route>
                </Route>
                <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.Administrador]}
                      />
                    }
                  >
                    <Route path="reporteria" element={<Report />} />
                  </Route>
                {/*lo agregado aqui en adelante es de fran*/}
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
