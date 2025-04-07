import './clientes.css';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { tab } from '@testing-library/user-event/dist/tab';


const theme = createTheme();


function showTab(tabActive: string, thisTab: string){
  if(tabActive === thisTab){
    return "block"; 
  }else{
    return "None";
  }
}

function Clientes() {
    const [tabActive, setTabActive] = React.useState('one');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setTabActive(newValue);
    };

    

    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
        <div className="mt-4">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ width: '100%' }}>
          <Tabs
            value={tabActive}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
            centered
          >
            <Tab
              value="1"
              label="Añadir Cliente"
            />
            <Tab value="2" label="Modificar Datos" />
            <Tab value="3" label="Eliminar Cliente" />
          </Tabs>
        </Box>
        </ThemeProvider>
        {/** Añadir cliente */}
        <div style={{display:showTab(tabActive, "1")}}>
          Añadir Cliente
        </div>
        {/** Modificar cliente */}
        <div style={{display:showTab(tabActive, "2")}}>
          Modificar Cliente
        </div>
        {/** Eliminar cliente */}
        <div style={{display:showTab(tabActive, "3")}}>
          Eliminar Cliente
        </div>
        </div>
      </div>
    );
  }

export default Clientes;