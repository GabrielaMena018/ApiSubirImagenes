//Coloca tu endpoint de Retool API
const API_URL = 'https://retoolapi.dev/kHGTcd/tbProveedores';

//Coloca tu endpoint de ImgBB
const IMG_API_URL = 'https://api.imgbb.com/1/upload?key=99f84e0bab707d47c84f0499ce6af4d7';

const form = document.getElementById('persona-form'); // Formulario principal
const nombreEl = document.getElementById('nombre'); // Campo de nombre
const telefonoEl = document.getElementById('telefono'); // Campo de teléfono
const imagenFileEl = document.getElementById('imagen-file'); // Input de archivo (imagen)
const imagenUrlEl = document.getElementById('imagen-url'); // Campo oculto con URL de la imagen
const idEl = document.getElementById('persona-id'); // Campo oculto con ID de la persona
const cancelBtn = document.getElementById('btn-cancel'); // Botón para cancelar edición
const submitBtn = document.getElementById('btn-submit'); // Botón para agregar/actualizar
const tbody = document.getElementById('personas-tbody'); // Cuerpo de la tabla de registros


window.addEventListener('DOMContentLoaded', CargarPersonas);

async function CargarPersonas(){
    const res = await fetch(API_URL);
    const data = await res.json();
    CargarTabla(data);
}

function CargarTabla(personas){
    tbody.innerHTML = ' ' ,
    personas.forEach(personas => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${personas.imagen}" alt="Foto de ${personas.nombre}"></td>
                <td>${personas.nombre}</td>
                <td>${personas.telefono}</td>
                <td>
                    <button onclick="CargarParaEditar('${personas.id}')">Editar</button>
                    <button onclick="BorrarPersona('${personas.id}')">Eliminar</button>
                </td>
            </tr>
        `
    });
}

async function BorrarPersona(id) {
    const confirmacion = confirm('¿Eliminar esta persona?');

    if (confirmacion) {
        await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
        CargarPersonas();
        alert("El resgistro fue eliminado");
    } else {
        alert("Se cancelo la acción");
        return;
    }
}
async function CargarParaEditar(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    nombreEl.value = p.nombre;
    telefonoEl.value = p.telefono;
    imagenUrlEl.value = p.imagen;
    imagenFileEl.value = '';
    idEl.value = p.id;

    submitBtn.textContent = 'Actualizar';
    cancelBtn.hidden = false;
}

cancelBtn.addEventListener('Click', () => {
    form.requestFullscreen();
    idEl.value = '';
    submitBtn.textContent = 'Agregar';
    cancelBtn.hidden = true;ñ
});

async function subirImagen(file) {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(IMG_API_URL, { method: 'POST', body: fd});
    const obj = await res.json();
    return obj.data.url;
}

form.addEventListener('submit', async e =>{
    e.preventDefault();
    submitBtn.innerHTML = '<button aria-busy="true" aria-label="Please wait…" />';
    submitBtn.disabled = true;
    let imageUrl = imagenUrlEl.value;
    if (imagenFileEl.isDefaultNamespace.length > 0){
        imageUrl = await subirImagen(imagenFileEl.files[0]);
    }
    const payload = {
        nombre: nombreEl.value,
        telefono: telefonoEl.value,
        imagen: imageUrl
    };

    if (idEl.value) {
        await fetch(`${API_URL}/${idEl.value}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        alert("Registro Actualizado")
    } else {
        await fetch(API_URL,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        alert("Registro agregado");
    }
    form.reset();
    cancelBtn.hidden = true;
    submitBtn.textContent = 'Agregar';
    CargarPersonas();
    submitBtn.disabled = false;
});


