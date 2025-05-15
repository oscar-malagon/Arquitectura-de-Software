package edu.unisabana.patrones.scenario2.abstraction;

import edu.unisabana.patrones.scenario2.platform.IPlataforma;

public class Alerta extends AbstractNotificacion {

    public Alerta(IPlataforma plataforma) {
        super(plataforma);
    }

    @Override
    public void notificar(String contenido) {
        plataforma.mostrar("🚨 Enviando alerta [%s]".formatted(contenido.toUpperCase()));
    }
}
