package edu.unisabana.patrones.scenario3.component;

import edu.unisabana.patrones.scenario3.Color;
import edu.unisabana.patrones.scenario3.mediator.Mediador;

public class Usuario extends Componente {

    public Usuario(Mediador mediador, String nombre, Color color) {
        super(mediador, nombre, color);
    }
}
