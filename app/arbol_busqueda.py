class NodoPaciente:
    def __init__(self, carnet, nombre, datos):
        self.carnet = carnet
        self.nombre = nombre
        self.datos = datos
        self.izquierda = None
        self.derecha = None

class ArbolPacientes:
    def __init__(self):
        self.raiz = None

    def insertar(self, carnet, nombre, datos):
        nuevo = NodoPaciente(carnet, nombre, datos)
        if self.raiz is None:
            self.raiz = nuevo
        else:
            self._insertar_recursivo(self.raiz, nuevo)

    def _insertar_recursivo(self, actual, nuevo):
        if nuevo.carnet < actual.carnet:
            if actual.izquierda is None:
                actual.izquierda = nuevo
            else:
                self._insertar_recursivo(actual.izquierda, nuevo)
        else:
            if actual.derecha is None:
                actual.derecha = nuevo
            else:
                self._insertar_recursivo(actual.derecha, nuevo)

    def buscar(self, carnet):
        return self._buscar_recursivo(self.raiz, carnet)

    def _buscar_recursivo(self, actual, carnet):
        if actual is None:
            return None
        if carnet == actual.carnet:
            return actual
        elif carnet < actual.carnet:
            return self._buscar_recursivo(actual.izquierda, carnet)
        else:
            return self._buscar_recursivo(actual.derecha, carnet)