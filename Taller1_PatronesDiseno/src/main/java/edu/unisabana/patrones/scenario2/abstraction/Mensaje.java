package edu.unisabana.patrones.scenario2.abstraction;

import edu.unisabana.patrones.scenario2.platform.IPlataforma;

public class Mensaje extends AbstractNotificacion {

    public Mensaje(IPlataforma plataforma) {
        super(plataforma);
    }

    @Override
    public void notificar(String contenido) {
        plataforma.mostrar("✉️ Enviando mensaje [%s]".formatted(contenido.toUpperCase()));
    }
}
