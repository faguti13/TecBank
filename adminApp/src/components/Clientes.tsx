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

    const [openInfoDialog, setOpenInfoDialog] = React.useState(false);

    const infoDialogTitles = [
      "Información faltante",
      "Error",
      "Cliente Añadido",
      "Actualización Realizada",
      "Cliente Removido"
    ];

    const infoDialogTexts = [
      "Falta información de completar para inscribir al cliente al sistema.",
      "Error al tratar de crear el perfil. Intente nuevamente o contacte a soporte.",
      "El cliente ha sido añadido exitosamente.",
      "Por favor, ingrese una credencial a buscar",
      "Lo sentimos. El usuario que se desea buscar no se encuentra en la base de datos",
      "Error al intentar la actualización de los datos. Intente nuevamente o contacte a soporte.",
      "La información se ha actualizado correctamente.",
      "La cédula ingresada corresponde a la de un usuario diferente.",
      "El cliente ha sido eliminado de la base de datos y ha roto el corazón de la empresa :'(",
      "No se ha podido borrar al usuario de la base de datos. Intente de nuevo o contacte a soporte."
    ];

    const [infoDialogTitle, setInfoDialogTitle] = React.useState(infoDialogTitles[0]);

    const [infoDialogText, setInfoDialogText] = React.useState(infoDialogTexts[0]);

    const handleClickOpenInfoDialog = (dialogTitleType: number,dialogTextType: number) => {
      setInfoDialogTitle(infoDialogTitles[dialogTitleType]);
      setInfoDialogText(infoDialogTexts[dialogTextType]);
      setOpenInfoDialog(true);
    };

    const handleCloseCreateDialog = () => {
      setOpenInfoDialog(false);
    };

    const [searchBar, setSearchBar] = React.useState("");

    const handleSearchClient = async () =>{
      if(searchBar.length > 0){
        try{
          const clientInfo = await clientService.getByCedula(searchBar);
          console.log(clientInfo);
          setSearchedClientInfo({...searchedClientInfo,
            id: (clientInfo as any).id,
            Usuario: (clientInfo as any).usuario,
            Password: (clientInfo as any).password,
            Nombre: (clientInfo as any).nombre,
            Apellido1: (clientInfo as any).apellido1,
            Apellido2: (clientInfo as any).apellido2,
            Cedula: (clientInfo as any).cedula,
            Direccion: (clientInfo as any).direccion,
            Telefono: (clientInfo as any).telefono,
            Email: (clientInfo as any).email,
            IngresoMensual: (clientInfo as any).ingresoMensual,
            TipoCliente: (clientInfo as any).tipoCliente
          }
          );
          
        }catch(err: any){
          if(err.message === '404'){
            handleClickOpenInfoDialog(1,4);
          }
        }
      }else{
        handleClickOpenInfoDialog(0,3);
      }
    }

    const handleEditClientInfo = async () =>{
      try{
        await clientService.editClientInfo(searchedClientInfo);
        handleClickOpenInfoDialog(3, 6);
      }catch(error: any){
        if(error.message === "500"){
          handleClickOpenInfoDialog(1,8);
        }
        handleClickOpenInfoDialog(1,5);
      }
    }

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
        TipoCliente: "Fisico",
    });

    const cleanClientJSON = () =>{
          let clean = {
            id: 0,
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
            TipoCliente: "Fisico",
          }
          return clean;
        };
    const [searchedClientInfo, setSearchedClientInfo] = React.useState<Cliente>(cleanClientJSON());

    const checkIfObjectIsValid = (info: Object) =>{
      var isValid =  Object.values(info).every(
        value => {
          if ((value === null || value === undefined || value === '')) return false;
          return true;
        }
      );
      return isValid;
    }

    const handleCreateClient = async(e: React.FormEvent) =>{
      e.preventDefault();
      if(checkIfObjectIsValid(newClientInfo)){
        try{
          await clientService.create(newClientInfo);
          handleClickOpenInfoDialog(2,2);
        }catch(err){
          handleClickOpenInfoDialog(1,1);
        }
      }else{
        handleClickOpenInfoDialog(0,0);
      }
    };

    const handleDeleteClient = async(e: React.FormEvent) =>{
      e.preventDefault();
      if(searchedClientInfo.id !== 0){
        try{
          await clientService.deleteClient(searchedClientInfo);
          setSearchedClientInfo(cleanClientJSON);
          handleClickOpenInfoDialog(4,8);
          handleCloseDeleteDialog();
        }catch(error){
          handleClickOpenInfoDialog(1,9);
        }
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
                        <FormControlLabel value="Fisico" control={<Radio />} label="Físico" />
                        <FormControlLabel value="Juridico" control={<Radio />} label="Jurídico" />
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
                  placeholder="Buscar Cliente por cédula..."
                  inputProps={{ 'aria-label': 'search client' }}
                  onChange={(e) => setSearchBar(e.target.value)}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchClient}>
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
                    <TextField id="standard-basic"  variant="standard" 
                    value={searchedClientInfo.Usuario} 
                    onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo, Usuario: e.target.value })}
                    />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Contraseña:
                    <FormControl sx={{width:'200px'}} variant="standard">
                      <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={searchedClientInfo.Password} 
                        onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo, Password: e.target.value })}
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
                    <div className='buttonSecondary' onClick={handleEditClientInfo} style={{float:'right'}}>
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
                    <TextField id="standard-basic"  variant="standard" 
                    value={searchedClientInfo.Nombre} 
                    onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo, Nombre: e.target.value })}
                    />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Primer Apellido:
                    <TextField id="standard-basic"  variant="standard" 
                    value={searchedClientInfo.Apellido1} 
                    onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo,Apellido1: e.target.value })}
                    />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Segundo Apellido:
                    <TextField id="standard-basic"  variant="standard" 
                    value={searchedClientInfo.Apellido2} 
                    onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo, Apellido2: e.target.value })}
                    />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Tipo de usuario: 
                    <div>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={searchedClientInfo.TipoCliente}
                          onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo, TipoCliente: e.target.value })}
                        >
                          <FormControlLabel value="Físico" control={<Radio />} label="Físico" />
                          <FormControlLabel value="Jurídico" control={<Radio />} label="Jurídico" />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Cédula:
                    <TextField id="standard-basic"  variant="standard" 
                    value={searchedClientInfo.Cedula}
                    onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo, Cedula: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className='buttonSecondary' onClick={handleEditClientInfo} style={{float:'right'}}>
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
                    <TextField id="standard-basic"  variant="standard" 
                    value={searchedClientInfo.Telefono}
                    onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo, Telefono: e.target.value })}
                    />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Ingreso mensual:
                    <TextField id="standard-basic"  variant="standard" 
                    value={searchedClientInfo.IngresoMensual}
                    onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo, IngresoMensual: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className='editClientTextFieldSpecial'>
                    Dirección:
                    <TextField
                      id="standard-multiline-static"
                      multiline
                      rows={3}
                      variant="filled"
                      value={searchedClientInfo.Direccion}
                      onChange={(e) => setSearchedClientInfo({ ...searchedClientInfo, Direccion: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className='buttonSecondary' onClick={handleEditClientInfo} style={{float:'right'}}>
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
                  <Button onClick={handleDeleteClient} autoFocus>
                    Eliminar
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
          <Dialog
            open={openInfoDialog}
            onClose={handleCloseCreateDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {infoDialogTitle}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {infoDialogText}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCreateDialog}>Ok</Button>
            </DialogActions>
          </Dialog>
          </ThemeProvider>
        </div>
      </div>
    );
  }

export default Clientes;