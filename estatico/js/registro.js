function validarDatos(datos, editar = false) {

    if (!editar) {
        if (!/^\d{7,8}$/.test(datos.carnet))
            return 'El CI debe tener 7 u 8 dígitos numéricos.';

        if (!datos.nombre)
            return 'Debe ingresar el nombre del paciente.';

        if (datos.nombre.length > 100)
            return 'El nombre es demasiado largo.';
    }

    if (!Number.isInteger(datos.edad) || datos.edad < 0 || datos.edad > 120)
        return 'La edad ingresada no es válida.';

    if (!datos.contacto)
        return 'Debe ingresar un contacto.';

    if (datos.contacto.length > 254)
        return 'El contacto es demasiado largo.';

    // Si contiene @ se considera correo
    if (datos.contacto.includes('@')) {

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

        carnet: document.getElementById('carnet').value.trim(),
        nombre: document.getElementById('nombre').value.trim(),
        edad: parseInt(document.getElementById('edad').value),
        contacto: document.getElementById('contacto').value.trim()

    };

    const error = validarDatos(datos);

    if (error)
        return mostrarToast(error, false);

    try {

        const res = await fetch('/paciente', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)

        });

        const json = await res.json();

        mostrarToast(json.mensaje, res.ok);

        if (res.ok)
            document.getElementById('formRegistro').reset();

    } catch (err) {

        mostrarToast('Error de conexión con el servidor.', false);

    }

});

async function buscar() {

    const carnet = document.getElementById('buscarCarnet').value.trim();

    if (!carnet)
        return mostrarToast('Ingrese un carnet para buscar.', false);

    try {

        const res = await fetch(`/paciente/${encodeURIComponent(carnet)}`);

        const json = await res.json();

        document.getElementById('resultado').innerHTML = res.ok
            ? `<p><b>Nombre:</b> ${json.nombre}</p>
               <p><b>Edad:</b> <input type="number" id="editEdad" value="${json.edad}" class="form-control d-inline w-auto"></p>
               <p><b>Contacto:</b> <input type="text" id="editContacto" value="${json.contacto}" class="form-control d-inline w-auto"></p>
               <a href="/historial/${encodeURIComponent(carnet)}" class="btn btn-primary btn-sm mt-2">Ver historial</a>
               <button onclick="editar('${carnet}')" class="btn btn-warning btn-sm mt-2">Guardar cambios</button>
               <button onclick="eliminar('${carnet}')" class="btn btn-danger btn-sm mt-2">Eliminar paciente</button>`
            : `<p class="text-danger">${json.mensaje}</p>`;

    } catch (err) {

        mostrarToast('Error de conexión con el servidor.', false);

    }

}

async function editar(carnet) {

    const datos = {

        edad: parseInt(document.getElementById('editEdad').value),
        contacto: document.getElementById('editContacto').value.trim()

    };

    const error = validarDatos(datos, true);

    if (error)
        return mostrarToast(error, false);

    try {

        const res = await fetch(`/paciente/${encodeURIComponent(carnet)}`, {

            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)

        });

        const json = await res.json();

        mostrarToast(json.mensaje, res.ok);

    } catch (err) {

        mostrarToast('Error de conexión con el servidor.', false);

    }

}

async function eliminar(carnet) {

    if (!confirm('¿Estás seguro de eliminar este paciente y todo su historial?'))
        return;

    try {

        const res = await fetch(`/paciente/${encodeURIComponent(carnet)}`, {

            method: 'DELETE'

        });

        const json = await res.json();

        mostrarToast(json.mensaje, res.ok);

        if (res.ok) {

            document.getElementById('resultado').innerHTML = '';
            document.getElementById('buscarCarnet').value = '';

        }

    } catch (err) {

        mostrarToast('Error de conexión con el servidor.', false);

    }

}