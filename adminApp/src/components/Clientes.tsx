import './clientes.css';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { FormControlLabel, FormLabel } from '@mui/material';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const theme = createTheme();


function showTab(tabActive: string, thisTab: string){
  if(tabActive === thisTab){
    return "block"; 
  }else{
    return "None";
  }
}



function Clientes() {
    const [tabActive, setTabActive] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setTabActive(newValue);
    };
    
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
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
              defaultValue="1"
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
          
          {/**************************** Añadir cliente ***********************************/}
          <div style={{display:showTab(tabActive, "1")}}>
            <div className='addClientBody'>
              {/*Bloque de Información*/}
              <div className='addClientBlock'>
                <div className='addClientBlockTitle'>Información de Cuenta</div>
                <div>
                  <TextField id="standard-basic" label="Usuario" variant="standard" />
                </div>
                <div>
                  <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Contraseña</InputLabel>
                    <Input
                      id="standard-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword ? 'hide the password' : 'display the password'
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            sx={{
                              fontSize: '14px'
                            }}
                          >
                            {showPassword ? "Ocultar" : "Mostrar"}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </div>
              </div>
              {/*Bloque de Cuenta*/}
              <div className='addClientBlock'>
                <div className='addClientBlockTitle'>Información de Cliente</div>
                <div>
                  <TextField id="standard-basic" label="Nombre" variant="standard" />
                </div>
                <div>
                  <TextField id="standard-basic" label="Apellido" variant="standard" />
                </div>
                <div>
                  <FormControl>
                    <FormLabel id="radio-group-label">Tipo de Cliente</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel value="Físico" control={<Radio />} label="Físico" />
                      <FormControlLabel value="Jurídico" control={<Radio />} label="Jurídico" />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div>
                  <TextField
                    id="standard-number"
                    label="Cédula"
                    type="number"
                    variant="standard"
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </div>
              </div>
              {/*Bloque de Identificación*/}
              <div className='addClientBlock'>
                <div className='addClientBlockTitle'>Otros Datos</div>
                <div>
                  <TextField id="standard-basic" label="Teléfono" variant="standard" />
                </div>
                <div>
                  <FormControl fullWidth sx={{maxWidth: '200px' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">Ingreso Mensual</InputLabel>
                    <Input
                      id="standard-adornment-amount"
                      startAdornment={<InputAdornment position="start">₡</InputAdornment>}
                    />
                  </FormControl>
                </div>
                <div>
                  <TextField
                    id="standard-multiline-static"
                    label="Dirección/Domicilio"
                    multiline
                    rows={3}
                    variant="standard"
                  />
                </div>
              </div>
              
            </div>
            
          </div>
          {/**************************** Modificar cliente ***********************************/}
          <div style={{display:showTab(tabActive, "2")}}>
            Modificar Cliente
          </div>
          {/**************************** Eliminar cliente ***********************************/}
          <div style={{display:showTab(tabActive, "3")}}>
            Eliminar Cliente
          </div>
          </ThemeProvider>
        </div>
      </div>
    );
  }

export default Clientes;