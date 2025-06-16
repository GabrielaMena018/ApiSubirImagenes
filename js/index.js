//Coloca tu endpoint de Retool API
const API_URL = 'https://retoolapi.dev/kHGTcd/tbProveedores'; 

//Contenedor de las tarjetas
const container = document.getElementById("cards-container");

async function CargarPersonas(){
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        CargarTarjetas(data);
    } catch (error) {
        console.error('Error al cargar datos: ', error);
        container.innerHTML = '<p>Error al cargar las personas.</p>'
        
    }

}
function CargarTarjetas(personas){
    container.innerHTML = ' ';
    if(personas.length == 0){ // Si "Perosnas está vacío, entonces"
        container.innerHTML = "<p>No hay personas registradas </p>";
        return; //Evita que el codigo se siga ejecutando
    }

    personas.forEach(personas => {
        container.innerHTML += `
            <div class="card">
                <img src="${personas.imagen}" alt="Foto de perfil">
                <h2>${personas.nombre}</h2>
                <p>${personas.telefono}</p>
            </div>
        `
    });
}

window.addEventListener('DOMContentLoaded', async()=>{
    const contenido = document.getElementById("contenido");
    contenido.hidden = true;
    await new Promise(resolve => setTimeout(resolve, 2000));
    document.getElementById("loader").style.display = "none";
    CargarPersonas();
    contenido.hidden = false;
});

