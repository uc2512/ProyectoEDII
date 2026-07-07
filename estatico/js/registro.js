function validarDatos(datos) {
    if (!/^\d{7,8}$/.test(datos.carnet))
        return 'El CI debe tener 7 u 8 dígitos numéricos.';
    if (/[a-zA-Z]/.test(datos.contacto)) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.contacto))
            return 'El correo ingresado no es válido.';
    } else {
        if (!/^\d{8}$/.test(datos.contacto))
            return 'El celular debe tener exactamente 8 dígitos.';
    }
    return null;
}

document.getElementById('formRegistro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        carnet: document.getElementById('carnet').value,
        nombre: document.getElementById('nombre').value,
        edad: parseInt(document.getElementById('edad').value),
        contacto: document.getElementById('contacto').value
    };
    const error = validarDatos(datos);
    if (error) return mostrarToast(error, false);
    const res = await fetch('/paciente', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(datos) });
    const json = await res.json();
    mostrarToast(json.mensaje, res.ok);
    if (res.ok) document.getElementById('formRegistro').reset();
});

async function buscar() {
    const carnet = document.getElementById('buscarCarnet').value;
    const res = await fetch(`/paciente/${carnet}`);
    const json = await res.json();
    document.getElementById('resultado').innerHTML = res.ok
        ? `<p><b>Nombre:</b> ${json.nombre}</p>
           <p><b>Edad:</b> <input type="number" id="editEdad" value="${json.edad}" class="form-control d-inline w-auto"></p>
           <p><b>Contacto:</b> <input type="text" id="editContacto" value="${json.contacto}" class="form-control d-inline w-auto"></p>
           <a href="/historial/${carnet}" class="btn btn-primary btn-sm mt-2">Ver historial</a>
           <button onclick="editar('${carnet}')" class="btn btn-warning btn-sm mt-2">Guardar cambios</button>
           <button onclick="eliminar('${carnet}')" class="btn btn-danger btn-sm mt-2">Eliminar paciente</button>`
        : `<p class="text-danger">${json.mensaje}</p>`;
}

async function editar(carnet) {
    const datos = {
        edad: parseInt(document.getElementById('editEdad').value),
        contacto: document.getElementById('editContacto').value
    };
    const res = await fetch(`/paciente/${carnet}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(datos) });
    const json = await res.json();
    mostrarToast(json.mensaje, res.ok);
}

async function eliminar(carnet) {
    if (!confirm('¿Estás seguro de eliminar este paciente y todo su historial?')) return;
    const res = await fetch(`/paciente/${carnet}`, { method: 'DELETE' });
    const json = await res.json();
    mostrarToast(json.mensaje, res.ok);
    if (res.ok) {
        document.getElementById('resultado').innerHTML = '';
        document.getElementById('buscarCarnet').value = '';
    }
}