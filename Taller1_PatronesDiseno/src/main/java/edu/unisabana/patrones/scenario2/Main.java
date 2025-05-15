package edu.unisabana.patrones.scenario2;

import edu.unisabana.patrones.scenario2.abstraction.Advertencia;
import edu.unisabana.patrones.scenario2.abstraction.Alerta;
import edu.unisabana.patrones.scenario2.abstraction.Confirmacion;
import edu.unisabana.patrones.scenario2.abstraction.Mensaje;
import edu.unisabana.patrones.scenario2.platform.Escritorio;
import edu.unisabana.patrones.scenario2.platform.Movil;
import edu.unisabana.patrones.scenario2.platform.Web;

public class Main {

    public static void main(String[] args) {
        Advertencia advertencia = new Advertencia(new Escritorio());
        advertencia.notificar("Ofertas imperdibles!");

        Alerta alerta = new Alerta(new Movil());
        alerta.notificar("Trancón en la autopista norte");

        Confirmacion confirmacion = new Confirmacion(new Web());
        confirmacion.notificar("Confirmar nuevo plan de telefonía");

        Mensaje mensaje = new Mensaje(new Movil());
        mensaje.notificar("Planilla en mora");
    }
}
