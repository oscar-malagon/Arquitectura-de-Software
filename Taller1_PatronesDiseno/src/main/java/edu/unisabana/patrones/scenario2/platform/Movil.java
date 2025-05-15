package edu.unisabana.patrones.scenario2.platform;

public class Movil implements IPlataforma {

    @Override
    public void mostrar(String contenido) {
        System.out.println(contenido + "... desde el 📞 Móvil");
    }
}
