package edu.unisabana.patrones.scenario2.abstraction;

import edu.unisabana.patrones.scenario2.platform.IPlataforma;

public class Advertencia extends AbstractNotificacion {

    public Advertencia(IPlataforma plataforma) {
        super(plataforma);
    }

    @Override
    public void notificar(String contenido) {
        plataforma.mostrar("⚠️ Enviando advertencia [%s]".formatted(contenido.toUpperCase()));
    }
}
