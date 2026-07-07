const carnet = document.getElementById('carnetData').dataset.carnet;

async function cargarDatos() {
    const res = await fetch(`/paciente/${carnet}/sesiones`);
    const json = await res.json();
    document.getElementById('nombrePaciente').textContent = `Paciente: ${json.nombre}`;
    const historial = document.getElementById('historial');
    historial.innerHTML = json.sesiones.length === 0 ? '<p class="text-muted">Sin sesiones registradas.</p>'
        : json.sesiones.map(s => `
            <div class="card mb-3">
                <div class="card-body">
                    <p class="text-muted mb-1">${s.fecha}</p>
                    <p><b>Diagnóstico:</b> ${s.diagnostico}</p>
                    <p><b>Tratamiento:</b> ${s.tratamiento}</p>
                </div>
            </div>`).join('');
}

document.getElementById('formSesion').addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = { diagnostico: document.getElementById('diagnostico').value, tratamiento: document.getElementById('tratamiento').value };
    const res = await fetch(`/paciente/${carnet}/sesion`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(datos) });
    const json = await res.json();
    mostrarToast(json.mensaje, res.ok);
    if (res.ok) { document.getElementById('formSesion').reset(); cargarDatos(); }
});

cargarDatos();