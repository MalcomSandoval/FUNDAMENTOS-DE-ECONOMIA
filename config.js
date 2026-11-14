window.APP_CONFIG = {
  // Rutas dinámicas: edite estas rutas si mueve los archivos fuente.
  // Puede usar rutas relativas (recomendado al servir la carpeta) o absolutas.
  sources: {
    ipcExcel: "IPC  ciudades.xlsx",
    empleoExcel: "Empleo departamentos.xls",
    ipcData: "ipc_riohacha.json",            // datos derivados del IPC (regenerables)
    empleoData: "empleo_guajira.json",       // datos derivados de empleo (regenerables)
    bundle: "data_guajira.json"              // paquete unificado usado por la página
  },
  territorio: {
    departamento: "La Guajira",
    capital: "Riohacha",
    codigoDane: "44"
  }
};
