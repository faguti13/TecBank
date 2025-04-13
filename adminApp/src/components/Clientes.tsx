import './clientes.css';
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {Tabs, Tab, Box, CssBaseline, TextField, FormControl, Input, InputLabel, InputAdornment} from '@mui/material';
import { FormControlLabel, FormLabel, Radio, RadioGroup, IconButton, Divider, Paper, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import { clientService } from '../services/clientService';

const theme = createTheme();


function showTab(tabActive: string, thisTab: string){
  if(tabActive === thisTab){
    return "flex"; 
  }else{
    return "None";
  }
}

interface Cliente {
  id?: number;
  Cedula: string;
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Direccion: string;
  Telefono: string;
  Usuario: string;
  Password: string;
  Email: string;
  IngresoMensual: number;
  TipoCliente: string;
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
     
    /*Dialogo para cuando se va a eliminar un cliente*/

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    const handleClickOpenDeleteDialog = () => {
      setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
      setOpenDeleteDialog(false);
    };

    /*Dialogo para cuando se va a crear un cliente*/

    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

    const createDialogTitles = [
      "Información faltante",
      "Error",
      "Cliente Añadido"
    ];

    const createDialogTexts = [
      "Falta información de completar para inscribir al cliente al sistema.",
      "Error al tratar de crear el perfil. Intente nuevamente o contacte a soporte.",
      "El cliente ha sido añadido exitosamente."
    ];

    const [createDialogTitle, setCreateDialogTitle] = React.useState(createDialogTitles[0]);

    const [createDialogText, setCreateDialogText] = React.useState(createDialogTexts[0]);

    const handleClickOpenCreateDialog = (dialogType: number) => {
      setCreateDialogTitle(createDialogTitles[dialogType]);
      setCreateDialogText(createDialogTexts[dialogType]);
      setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
      setOpenCreateDialog(false);
    };


    const [newClientInfo, setNewClientInfo] = React.useState<Cliente>({
        Cedula: '',
        Nombre: '',
        Apellido1: '',
        Apellido2: '',
        Direccion: '',
        Telefono: '',
        Usuario: '',
        Password: '',
        Email: '',
        IngresoMensual: 0,
        TipoCliente: "Físico",
    });

    const checkIfNewClientIsValid = () =>{
      var isValid =  Object.values(newClientInfo).every(
        value => {
          if ((value === null || value === undefined || value === '')) return false;
          return true;
        }
      );
      return isValid;
    }

    const handleCreateClient = async(e: React.FormEvent) =>{
      e.preventDefault();
      if(checkIfNewClientIsValid()){
        try{
          await clientService.create(newClientInfo);
          handleClickOpenCreateDialog(2);
        }catch(err){
          handleClickOpenCreateDialog(1);
        }
      }else{
        handleClickOpenCreateDialog(0);
      }
      
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
            </Tabs>
          </Box>
          
          {/**************************** Añadir cliente ***********************************/}
          <div style={{display:showTab(tabActive, "1"), flexFlow: 'column', minHeight: 'fit-content'}}>
            <div className='addClientBody'>
              {/*Bloque de Información*/}
              <div className='addClientBlock'>
                <div className='addClientBlockTitle'>Información de Cuenta</div>
                <div className='addClientBlockBody'>
                  <div>
                    <TextField required id="standard-basic" label="Usuario" variant="standard" 
                    value={newClientInfo.Usuario} 
                    onChange={(e) => setNewClientInfo({ ...newClientInfo, Usuario: e.target.value })}
                    />
                  </div>
                  <div>
                    <TextField required id="standard-basic" label="Email" variant="standard" 
                    value={newClientInfo.Email} 
                    onChange={(e) => setNewClientInfo({ ...newClientInfo, Email: e.target.value })}
                    />
                  </div>
                  <div>
                    <FormControl required sx={{width:'200px'}} variant="standard">
                      <InputLabel htmlFor="standard-adornment-password">Contraseña</InputLabel>
                      <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={newClientInfo.Password}
                        onChange={(e) => setNewClientInfo({ ...newClientInfo, Password: e.target.value })}
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
                              {showPassword ?  <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <Divider orientation="vertical" flexItem />
              {/*Bloque de Cuenta*/}
              <div className='addClientBlock'>
                <div className='addClientBlockTitle'>Información de Cliente</div>
                <div className='addClientBlockBody'>
                  <div>
                    <TextField 
                    required id="standard-basic" label="Nombre" variant="standard" 
                    value={newClientInfo.Nombre} 
                    onChange={(e) => setNewClientInfo({ ...newClientInfo, Nombre: e.target.value })}
                    />
                  </div>
                  <div>
                    <TextField required id="standard-basic" label="Primer Apellido" variant="standard" 
                    value={newClientInfo.Apellido1}
                    onChange={(e) => setNewClientInfo({ ...newClientInfo, Apellido1: e.target.value })}
                    />
                  </div>
                  <div>
                    <TextField required id="standard-basic" label="Segundo Apellido" variant="standard" 
                    value={newClientInfo.Apellido2}
                    onChange={(e) => setNewClientInfo({ ...newClientInfo, Apellido2: e.target.value })}
                    />
                  </div>
                  <div>
                    <FormControl>
                      <FormLabel id="radio-group-label">Tipo de Cliente</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={newClientInfo.TipoCliente}
                        onChange={(e) => setNewClientInfo({ ...newClientInfo, TipoCliente: e.target.value })}
                        defaultValue={"Físico"}
                      >
                        <FormControlLabel value="Físico" control={<Radio />} label="Físico" />
                        <FormControlLabel value="Jurídico" control={<Radio />} label="Jurídico" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      required
                      id="standard-number"
                      label="Cédula"
                      value={newClientInfo.Cedula}
                      onChange={(e) => setNewClientInfo({ ...newClientInfo, Cedula: e.target.value })}
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
              </div>
              <Divider orientation="vertical" flexItem />
              {/*Bloque de Otros*/}
              <div className='addClientBlock'>
                <div className='addClientBlockTitle'>Otros Datos</div>
                <div className='addClientBlockBody'>
                  <div>
                    <TextField id="standard-basic" label="Teléfono" variant="standard" 
                    value={newClientInfo.Telefono}
                    onChange={(e) => setNewClientInfo({ ...newClientInfo, Telefono: e.target.value })}
                    />
                  </div>
                  <div>
                    <FormControl fullWidth sx={{maxWidth: '200px' }} variant="standard">
                      <InputLabel htmlFor="standard-adornment-amount">Ingreso Mensual</InputLabel>
                      <Input
                        type='number'
                        id="standard-adornment-amount"
                        value={newClientInfo.IngresoMensual}
                        onChange={(e) => setNewClientInfo({ ...newClientInfo, IngresoMensual: parseInt(e.target.value) })}
                        startAdornment={<InputAdornment position="start">₡</InputAdornment>}
                      />
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      id="standard-multiline-static"
                      label="Dirección/Domicilio"
                      value={newClientInfo.Direccion}
                      onChange={(e) => setNewClientInfo({ ...newClientInfo, Direccion: e.target.value })}
                      multiline
                      rows={3}
                      variant="filled"
                    />
                  </div>
                </div>
              </div>
              {/*Botón de ingreso de datos*/}
              
            </div>
            <div style={{marginTop: '20px'}}>
              <div className='buttons' style={{fontSize: 'large', float:'right'}} onClick={handleCreateClient}>
                Ingresar Cliente
              </div>
            </div>
            <Dialog
                open={openCreateDialog}
                onClose={handleCloseCreateDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {createDialogTitle}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {createDialogText}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseCreateDialog}>Ok</Button>
                </DialogActions>
              </Dialog>
          </div>
          {/**************************** Modificar cliente ***********************************/}
          <div style={{display:showTab(tabActive, "2"), flexFlow: 'column'}}>
            <div className='editClientSearch'>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Buscar Cliente..."
                  inputProps={{ 'aria-label': 'search client' }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon></SearchIcon>
                </IconButton>
              </Paper>
            </div>
            <div className='editClientBody'>
              {/*Acordión de Información de Cuenta*/}
              <Accordion className='editClientAccordion'>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon style={{color:'white'}} />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                  sx={{
                    backgroundColor:'rgb(12, 102, 205)',
                    borderRadius: '5px',
                    color: 'white'
                  }}
                >
                  <Typography style={{fontWeight: 'bold'}} component="span">Información de Cuenta</Typography>
                </AccordionSummary>
                <AccordionDetails className='editClientAccordionInterior' >
                  <div className='editClientTextFieldSpecial'>
                    Usuario:
                    <TextField id="standard-basic"  variant="standard" />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Contraseña:
                    <FormControl sx={{width:'200px'}} variant="standard">
                      
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
                              {showPassword ?  <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </div>
                  <div>
                    <div className='buttonSecondary' style={{float:'right'}}>
                      Actualizar
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              {/*Acordión de Información de Cliente */}
              <Accordion className='editClientAccordion'>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon  style={{color:'white'}} />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                  sx={{
                    backgroundColor:'rgb(12, 102, 205)',
                    borderRadius: '5px',
                    color: 'white'
                  }}
                >
                  <Typography style={{fontWeight: 'bold'}} component="span">Información de Cliente</Typography>
                </AccordionSummary>
                <AccordionDetails className='editClientAccordionInterior' >
                  <div className='editClientTextFieldSpecial'>
                    Nombre:
                    <TextField id="standard-basic"  variant="standard" />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Apellido:
                    <TextField id="standard-basic"  variant="standard" />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Tipo de usuario: 
                    <div>
                      <FormControl>
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
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Cédula:
                    <TextField id="standard-basic"  variant="standard" />
                  </div>
                  <div>
                    <div className='buttonSecondary' style={{float:'right'}}>
                      Actualizar
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              {/*Acordión de otros datos*/}
              <Accordion className='editClientAccordion'>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon  style={{color:'white'}} />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                  sx={{
                    backgroundColor:'rgb(12, 102, 205)',
                    borderRadius: '5px',
                    color: 'white'
                  }}
                >
                  <Typography style={{fontWeight: 'bold'}} component="span">Otros Datos</Typography>
                </AccordionSummary>
                <AccordionDetails className='editClientAccordionInterior' >
                  <div className='editClientTextFieldSpecial'>
                    Teléfono:
                    <TextField id="standard-basic"  variant="standard" />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Ingreso mensual:
                    <TextField id="standard-basic"  variant="standard" />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Dirección:
                    <TextField
                      id="standard-multiline-static"
                      multiline
                      rows={3}
                      variant="filled"
                    />
                  </div>
                  <div>
                    <div className='buttonSecondary' style={{float:'right'}}>
                      Actualizar
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              <div className='editClientAccordion' style={{marginTop:'10px'}}>
                <div className='buttonThird' onClick={handleClickOpenDeleteDialog}>
                    Eliminar Cliente
                </div>
              </div>
              <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Eliminar cliente"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    ¿Está seguro que desea eliminar este usuario? El usuario no podrá acceder a su cuenta ni realizar transacciones bancarias.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
                  <Button onClick={handleCloseDeleteDialog} autoFocus>
                    Eliminar
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
          </ThemeProvider>
        </div>
      </div>
    );
  }

export default Clientes;