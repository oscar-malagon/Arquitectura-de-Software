package edu.unisabana.patrones.scenario2.abstraction;

import edu.unisabana.patrones.scenario2.platform.IPlataforma;

public class Confirmacion extends AbstractNotificacion {

    public Confirmacion(IPlataforma plataforma) {
        super(plataforma);
    }

    @Override
    public void notificar(String contenido) {
        plataforma.mostrar("✅ Enviando confirmación [%s]".formatted(contenido.toUpperCase()));
    }
}
