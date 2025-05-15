package edu.unisabana.patrones.scenario3.component;

import edu.unisabana.patrones.scenario3.Color;
import edu.unisabana.patrones.scenario3.mediator.Mediador;

public abstract class Componente {

    protected Mediador mediador;
    protected String nombre;
    protected Color color;

    public Componente(Mediador mediador, String nombre, Color color) {
        this.mediador = mediador;
        this.nombre = nombre;
        this.color = color;
    }

    public String getNombre() {
        return this.nombre;
    }

    public void enviarMensaje(String mensaje) {
        this.mediador.enviarMensaje(this, mensaje);
    }

    public void recibirMensaje(Componente remitente, String mensaje) {
        String texto = "%s - recibí [%s] (...enviado por %s)".formatted(this.nombre, mensaje, remitente.nombre);
        System.out.println(this.color.apply(texto));
    }
}
