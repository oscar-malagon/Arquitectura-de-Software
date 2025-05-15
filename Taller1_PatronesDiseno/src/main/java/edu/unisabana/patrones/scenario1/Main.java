package edu.unisabana.patrones.scenario1;

public class Main {

    public static void main(String[] args) {
        Automovil basico = new Automovil.Builder()
                .tipoMotor("1.5")
                .interiores("Basicos")
                .color("Azul indigo")
                .navegacionGps(false)
                .numeroLlantas(4)
                .sistemaDeSonido("Bose")
                .techoSolar(false)
                .build();

        System.out.println(basico.toString());
    }
}
