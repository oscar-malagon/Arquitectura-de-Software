package edu.unisabana.patrones.scenario3.mediator;

import edu.unisabana.patrones.scenario3.component.Componente;

public interface Mediador {

    void enviarMensaje(Componente remitente, String mensaje);

}
