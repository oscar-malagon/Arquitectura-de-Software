package edu.unisabana.patrones.scenario3;

import edu.unisabana.patrones.scenario3.component.Usuario;
import edu.unisabana.patrones.scenario3.mediator.Grupo;

public class Main {

    public static void main(String[] args) {
        Grupo diplomado = new Grupo();

        Usuario oscar = new Usuario(diplomado, "🐶 Oscar", Color.BLUE);
        Usuario daniel = new Usuario(diplomado, "👨🏽‍🏫 Daniel", Color.RED);
        Usuario rosa = new Usuario(diplomado, "🌹 Rosa", Color.MAGENTA);
        Usuario estudianteArtes = new Usuario(diplomado, "🎨 Estudiante de Artes 0001", Color.CYAN);


        diplomado.agregarUsuario(oscar);
        diplomado.agregarUsuario(daniel);
        diplomado.agregarUsuario(rosa);
        diplomado.agregarUsuario(estudianteArtes);

        rosa.enviarMensaje("Hola todos");
        oscar.enviarMensaje("Como van?");
        daniel.enviarMensaje("queridos estudiantes, que tal todo?");
        estudianteArtes.enviarMensaje("Lo siento, creo que no pertenezco a este grupo");

        diplomado.eliminarUsuario(estudianteArtes);
        daniel.enviarMensaje("chao pues");
    }
}
