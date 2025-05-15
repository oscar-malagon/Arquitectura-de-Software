package edu.unisabana.patrones.scenario3.mediator;

import edu.unisabana.patrones.scenario3.Color;
import edu.unisabana.patrones.scenario3.component.Componente;
import edu.unisabana.patrones.scenario3.component.Usuario;

import java.util.ArrayList;
import java.util.List;

public class Grupo implements Mediador {

    public static final int UN_SEGUNDO = 1000;
    public static final int DOS_SEGUNDOS = 2000;
    List<Usuario> usuarios;

    public Grupo() {
        this.usuarios = new ArrayList<>();
    }

    @Override
    public void enviarMensaje(Componente remitente, String mensaje) {
        String texto = "...........%s dice [%s]...........".formatted(remitente.getNombre(), mensaje);
        System.out.println(Color.GREEN.apply(texto));
        retrasar(UN_SEGUNDO);
        for (Usuario usuario : usuarios) {
            if (usuario != remitente) {
                usuario.recibirMensaje(remitente, mensaje);
            }
        }
        retrasar(DOS_SEGUNDOS);
        System.out.println("-".repeat(70));
    }

    private static void retrasar(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public void agregarUsuario(Usuario usuario) {
        this.usuarios.add(usuario);
    }

    public void eliminarUsuario(Usuario usuario) {
        this.usuarios.remove(usuario);
    }
}
