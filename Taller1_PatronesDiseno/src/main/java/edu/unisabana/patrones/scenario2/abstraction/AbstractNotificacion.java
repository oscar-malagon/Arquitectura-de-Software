package edu.unisabana.patrones.scenario2.abstraction;

import edu.unisabana.patrones.scenario2.platform.IPlataforma;

public abstract class AbstractNotificacion {

    protected IPlataforma plataforma;

    public AbstractNotificacion(IPlataforma plataforma) {
        this.plataforma = plataforma;
    }

    public abstract void notificar(String contenido);
}
